// src/api/notificationSse.js
import { showNotificationToast } from "@/utills/toast.js";
import { useAuthStore } from "@/stores/auth.js";
import { EventSourcePolyfill } from "event-source-polyfill";

let eventSource = null;
let lastPing = Date.now();
let pingCheckInterval = null;

const config = {
  retryCount: 0,
  MAX_RETRIES: 5,
  INITIAL_RETRY_DELAY: 2000,
  MAX_RETRY_DELAY: 30000,
};

export function subscribeToNotification(onMessageCallback) {
  closeNotificationConnection(); // 항상 먼저 안전 종료

  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  const lastEventId = localStorage.getItem("lastEventId") || "";
  const baseUrl = import.meta.env.VITE_API_URL;

  eventSource = new EventSourcePolyfill(`${baseUrl}/notifications/connect`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Last-Event-Id": lastEventId,
    },
    withCredentials: true,
    heartbeatTimeout: 45000, // 기본 타임아웃 45초
  });

  eventSource.onopen = () => {
    config.retryCount = 0; // 성공 시 리셋
    lastPing = Date.now();
    startPingWatchdog(onMessageCallback);
  };

  eventSource.addEventListener("ping", () => {
    lastPing = Date.now();
  });

  eventSource.addEventListener("initial-connect", () => {});

  eventSource.addEventListener("sse", (event) => {
    try {
      const data = JSON.parse(event.data);
      const id = event.lastEventId || event.id;
      if (id) localStorage.setItem("lastEventId", id);

      // store 업데이트
      onMessageCallback(data);
      showNotificationToast(data.message);
    } catch (err) {
      console.error("❌ [SSE] 알림 파싱 실패:", err);
    }
  });

  eventSource.onerror = () => {
    console.error("⚠️ [SSE] 연결 오류 발생. 재연결 시도");
    reconnect(onMessageCallback); // 오류 시에도 재연결 시도
  };
}

function startPingWatchdog(onMessageCallback) {
  clearPingWatchdog();

  pingCheckInterval = setInterval(() => {
    const diff = Date.now() - lastPing;

    if (diff > 60_000) {
      // 60초 이상 ping 없음
      console.warn("⏱️ [SSE] ping 타임아웃! 재연결 시도");
      reconnect(onMessageCallback);
    }
  }, 30_000); // 30초마다 ping 상태 확인
}

function clearPingWatchdog() {
  if (pingCheckInterval) {
    clearInterval(pingCheckInterval);
    pingCheckInterval = null;
  }
}

function reconnect(onMessageCallback) {
  closeNotificationConnection();

  config.retryCount++;
  if (config.retryCount > config.MAX_RETRIES) {
    console.error(
      `❌ [SSE] 재연결 시도 ${config.retryCount}회 초과. 연결 포기`,
    );
    return;
  }

  // 지수 백오프 계산
  const delay = Math.min(
    config.INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount - 1),
    config.MAX_RETRY_DELAY,
  );

  setTimeout(() => {
    subscribeToNotification(onMessageCallback);
  }, delay);
}

export function closeNotificationConnection() {
  if (eventSource) {
    eventSource.close();
  }
  clearPingWatchdog();
}

export function initNotificationSse(onMessageCallback) {
  window.addEventListener("beforeunload", () => {
    // 새로고침 시 연결 안전 종료
    closeNotificationConnection();
  });

  subscribeToNotification(onMessageCallback);
}
