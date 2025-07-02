// src/stores/auth.js

import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
      } catch (e) {
        clearAuth(); // 파싱 실패 시 초기화
      }
    }

    function clearAuth() {
      accessToken.value = null;
      expirationTime.value = null;
      memberId.value = null;
      memberRole.value = null;
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
