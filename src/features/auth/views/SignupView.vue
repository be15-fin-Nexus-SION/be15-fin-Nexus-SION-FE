<script setup>
import { signup } from "@/api/member.js";
import { useRouter } from "vue-router";
import SignupForm from "@/features/auth/components/SignupForm.vue";
import { showErrorToast } from "@/utills/toast.js";

const router = useRouter();

const handleRegister = async (payload) => {
  try {
    await signup(payload);
    alert("회원가입이 완료되었습니다.");
    await router.push("/login");
  } catch (error) {
    console.error("회원 가입 실패:", error);
    showErrorToast("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
};
</script>

<template>
  <div class="register-container">
    <div class="logo-wrapper">
      <img src="@/assets/sion-logo.svg" alt="SION Logo" class="logo" />
    </div>
    <SignupForm @submit="handleRegister" />
  </div>
</template>

<style scoped>
.register-container {
  @apply flex flex-col items-center justify-center min-h-screen pb-28;
}

.logo-wrapper {
  @apply mb-8;
}

.logo {
  @apply w-[250px];
}
</style>
