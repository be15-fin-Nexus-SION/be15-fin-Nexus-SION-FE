<template>
  <div class="auth-container">
    <span class="auth-text">로그인</span>
    <span class="auth-text">회원가입</span>
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
</style>
