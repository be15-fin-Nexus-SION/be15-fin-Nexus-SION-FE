// src/utils/notification.js
import { showNotificationToast } from "@/utills/toast.js";
import { useAuthStore } from "@/stores/auth.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import { showNotificationBadge } from "@/features/notification/utils/notificationBadge.js";

let eventSource = null;
let lastPing = Date.now();
let pingCheckInterval = null;

// 지수 백오프
let retryCount = 0;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 2000; // 2초
const MAX_RETRY_DELAY = 30000; // 30초

export function subscribeToNotification(onMessageCallback) {
  if (eventSource) {
    eventSource.close();
  }

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
    console.log("✅ [SSE] 연결됨");
    retryCount = 0; // 성공 시 리셋
    lastPing = Date.now();
    startPingWatchdog(onMessageCallback);
  };

  eventSource.addEventListener("ping", (event) => {
    console.log("📡 [SSE] ping 받음:", event.data);
    lastPing = Date.now();
  });

  eventSource.addEventListener("initial-connect", (event) => {
    console.log("🚀 [SSE] initial-connect:", event.data);
  });

  eventSource.addEventListener("sse", (event) => {
    try {
      const data = JSON.parse(event.data);
      const id = event.lastEventId || event.id;
      if (id) localStorage.setItem("lastEventId", id);

      console.log("📩 [SSE] 알림 수신:", data);

      // store 업데이트
      onMessageCallback(data);
      showNotificationToast(data.content);
      showNotificationBadge();
    } catch (err) {
      console.error("❌ [SSE] 알림 파싱 실패:", err);
    }
  });

  eventSource.onerror = (err) => {
    console.error("❌ [SSE] 연결 오류:", err);
    reconnect(onMessageCallback); // 오류 시에도 재연결 시도
  };
}

function startPingWatchdog(onMessageCallback) {
  clearPingWatchdog();

  pingCheckInterval = setInterval(() => {
    const now = Date.now();
    const diff = now - lastPing;

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

  retryCount++;
  if (retryCount > MAX_RETRIES) {
    console.error(`❌ [SSE] 재연결 시도 ${retryCount}회 초과. 연결 포기`);
    return;
  }

  // 지수 백오프 계산
  let delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
  if (delay > MAX_RETRY_DELAY) delay = MAX_RETRY_DELAY;

  console.log(`🔄 [SSE] ${retryCount}번째 재연결 시도 (대기 ${delay}ms)`);

  setTimeout(() => {
    subscribeToNotification(onMessageCallback);
  }, delay);
}

export function closeNotificationConnection() {
  if (eventSource) {
    eventSource.close();
    console.log("🔌 [SSE] 연결 종료");
  }
  clearPingWatchdog();
}
