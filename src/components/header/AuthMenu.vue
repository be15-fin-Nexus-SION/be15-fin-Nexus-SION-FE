<script setup>
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
</script>

<template>
  <div class="auth-container">
    <template v-if="authStore.isAuthenticated">
      <router-link to="/logout" class="auth-text">로그아웃</router-link>
    </template>
    <template v-else>
      <router-link to="/login" class="auth-text">로그인</router-link>
      <router-link to="/signup" class="auth-text">회원가입</router-link>
    </template>
    <!-- 또는 설정/로그아웃 -->
  </div>
</template>

<style scoped>
.auth-container {
  @apply flex flex-row items-center gap-[10px];
}
.auth-text {
  @apply w-[91px] h-[63px] text-[18px] leading-[22px] font-semibold text-black flex items-center justify-center;
}
.auth-text:hover {
  color: #6574f6; /* 원하는 hover 색상으로 조정 가능 */
}
</style>
