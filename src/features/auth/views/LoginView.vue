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
    await router.push("/");
  } catch (error) {
    console.error("로그인 실패:", error);
    showErrorToast("로그인에 실패했습니다. 다시 시도해주세요.");
  }
};
</script>

<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <img src="@/assets/sion-logo.svg" alt="SION Logo" class="logo" />
    </div>
    <LoginForm @submit="handleLogin" />
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
