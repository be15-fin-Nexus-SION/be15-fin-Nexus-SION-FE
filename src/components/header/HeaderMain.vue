<template>
  <header class="header-wrapper">
    <div class="header-inner">
      <!-- 좌측: 로고 + 메뉴 -->
      <div class="left-group">
        <!-- 로고 클릭 시 / 로 이동 -->
        <router-link to="/" class="logo-container">
          <span class="logo-text">SION</span>
          <div class="logo-underline"></div>
        </router-link>
        <HeaderNav />
      </div>

      <!-- 우측: 인증 메뉴 -->
      <div class="right-area">
        <AuthMenu @open-notification-modal="handleNotificationModal" />
      </div>
    </div>
  </header>
</template>

<script setup>
import HeaderNav from "./HeaderNav.vue";
import AuthMenu from "./AuthMenu.vue";

const emit = defineEmits(["open-notification-modal"]);

function handleNotificationModal() {
  emit("open-notification-modal");
}
</script>

<style scoped>
.header-wrapper {
  @apply w-full bg-white border-b border-[#EEEEEE];
}

.header-inner {
  @apply w-full max-w-screen-xl h-[82px] flex items-center justify-between px-[42px] mx-auto;
}

.left-group {
  @apply flex items-center gap-[64px];
}

.logo-container {
  @apply flex flex-col items-center justify-center relative h-[63px] cursor-pointer;
}

.logo-text {
  @apply text-[32px] leading-[39px] tracking-[0.05em] font-bold text-black text-center;
}

.logo-underline {
  @apply w-[84px] border-t-[3px] border-[#33429A] mt-[4px];
}

.right-area {
  @apply flex items-center gap-[10px];
}
</style>
