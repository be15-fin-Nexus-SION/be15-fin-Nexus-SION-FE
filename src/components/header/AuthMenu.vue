<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { logout } from "@/api/member.js";
import { showSuccessToast } from "@/utills/toast.js";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await logout();
    showSuccessToast("로그아웃이 완료되었습니다.");
    authStore.clearAuth();
    await router.push("/login");
  } catch (e) {
    console.error("로그아웃 API 실패", e);
    showSuccessToast("로그아웃이 실패했습니다. 다시 시도해주세요.");
  }
};
</script>

<template>
  <div class="auth-container">
    <template v-if="authStore.isAuthenticated">
      <button class="auth-text" @click="handleLogout">로그아웃</button>
    </template>
    <template v-else>
      <router-link to="/login" class="auth-text">로그인</router-link>
      <router-link to="/signup" class="auth-text">회원가입</router-link>
    </template>
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
