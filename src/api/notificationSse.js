// src/utils/notification.js
import { showNotificationToast } from "@/utills/toast.js";
import { useAuthStore } from "@/stores/auth.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import { showNotificationBadge } from "@/features/notification/utils/notificationBadge.js";

let eventSource = null;
let lastPing = Date.now();
let pingCheckInterval = null;

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
    heartbeatTimeout: 45000, // 기본 타임아웃 45초, 핑은 30초마다
  });

  eventSource.onopen = () => {
    console.log("✅ SSE 연결됨");
    lastPing = Date.now();
    if (pingCheckInterval) clearInterval(pingCheckInterval);
    pingCheckInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastPing > 60_000) {
        // 60초 이상 ping 없음
        console.warn("⏱️ ping이 너무 오래 없음! SSE 재연결 시도");
        reconnect(onMessageCallback);
      }
    }, 30_000); // 30초마다 확인
  };

  eventSource.addEventListener("ping", (event) => {
    console.log("ping 이벤트 받음:", event.data);
    lastPing = Date.now();
  });

  eventSource.addEventListener("initial-connect", (event) => {
    console.log(event.data);
  });

  eventSource.addEventListener("sse", (event) => {
    try {
      console.log(event);
      const data = JSON.parse(event.data);
      const id = event.lastEventId || event.id;
      if (id) localStorage.setItem("lastEventId", id);

      console.log("📩 알림 수신:", data);

      // store 업데이트
      onMessageCallback(data);
      // toast 알림 추가
      showNotificationToast(data.senderNickname + "님이 " + data.content);
      // UI 변경
      showNotificationBadge();
    } catch (err) {
      console.error("❌ 알림 파싱 실패:", err);
    }
  });

  eventSource.onerror = (err) => {
    console.error("❌ SSE 연결 오류:", err);
  };
}

function reconnect(onMessageCallback) {
  closeNotificationConnection();
  subscribeToNotification(onMessageCallback);
}

export function closeNotificationConnection() {
  if (eventSource) {
    eventSource.close();
    console.log("🔌 SSE 연결 종료");
  }
  if (pingCheckInterval) {
    clearInterval(pingCheckInterval);
    pingCheckInterval = null;
  }
}
