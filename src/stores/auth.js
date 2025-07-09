// src/stores/auth.js

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useNotificationStore } from "@/stores/notification.js";
import {
  closeNotificationConnection,
  subscribeToNotification,
} from "@/api/notificationSse.js";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref(null);
    const expirationTime = ref(null);
    const memberId = ref(null);
    const memberRole = ref(null);

    const isAuthenticated = computed(
      () => !!accessToken.value && Date.now() < (expirationTime.value || 0),
    );

    function setAuth(at) {
      accessToken.value = at;

      try {
        const payload = JSON.parse(atob(at.split(".")[1]));
        if (!payload.exp) throw new Error("만료 시간 없음");
        expirationTime.value = payload.exp * 1000;
        memberId.value = payload.sub;
        memberRole.value = payload.role;

        // SSE 알림 구독
        const notificationStore = useNotificationStore();

        subscribeToNotification((data) => {
          notificationStore.prependNotification(data);
        });
      } catch (e) {
        clearAuth(); // 파싱 실패 시 초기화
      }
    }

    function clearAuth() {
      accessToken.value = null;
      expirationTime.value = null;
      memberId.value = null;
      memberRole.value = null;

      // sse 연결 종료
      closeNotificationConnection();
    }

    return {
      accessToken,
      expirationTime,
      memberId,
      memberRole,
      isAuthenticated,
      setAuth,
      clearAuth,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ["accessToken", "expirationTime", "memberId", "memberRole"],
    },
  },
);
