<template>
  <div class="auth-container">
    <router-link to="/login" class="auth-text">로그인</router-link>
    <router-link to="/signup" class="auth-text">회원가입</router-link>
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
