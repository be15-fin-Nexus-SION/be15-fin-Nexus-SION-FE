<script setup>
// 로그인 관련 로직
import { login } from "@/api/member.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import { useRouter } from "vue-router";
import LoginForm from "@/features/auth/components/LoginForm.vue";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async (payload) => {
  try {
    const resp = await login(payload);
    const at = resp.data.data.accessToken;
    authStore.setAuth(at);
    showSuccessToast("로그인 되었습니다.");
    await router.replace(
      authStore.memberRole === "ADMIN"
        ? "/admin/dashboard"
        : "/self-development/dashboard",
    );
  } catch (error) {
    console.error("로그인 실패:", error.response.data.message);
    showErrorToast(error.response.data.message);
  }
};
</script>

<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <img src="@/assets/sion-logo.svg" alt="SION Logo" class="logo" />
    </div>
    <LoginForm @submit="handleLogin" />
    <div class="flex m-4 gap-[8px] text-sm text-gray-500">
      <span>아이디가 없으신가요?</span>
      <router-link to="/signup" class="text-primary hover:underline"
        >회원가입</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.login-container {
  @apply flex flex-col items-center justify-center min-h-screen pb-28;
}

.logo-wrapper {
  @apply mb-8;
}

.logo {
  @apply w-[250px];
}
</style>
