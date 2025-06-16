<template>
  <div class="app-shell">
    <!-- 공통 헤더 -->
    <HeaderMain />

    <!-- 페이지별 컨텐츠 영역 -->
    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderMain from "./header/HeaderMain.vue";
</script>

<style scoped>
.app-shell {
  @apply w-full min-h-screen flex flex-col bg-white relative;
}

.content-area {
  @apply w-full flex-1 px-[42px] pt-[30px] pb-[60px];
  margin-top: 82px; /* 헤더 높이만큼 여백 확보 */
}
</style>
