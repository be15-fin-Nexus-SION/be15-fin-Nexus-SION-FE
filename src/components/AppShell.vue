<script setup lang="ts">
import HeaderMain from "@/components/header/HeaderMain.vue";
import NotificationModal from "@/features/notification/components/NotificationModal.vue";
import { ref } from "vue";

const showNotificationModal = ref(false);
</script>

<template>
  <div class="app-shell">
    <!-- 공통 헤더 -->
    <HeaderMain @open-notification-modal="showNotificationModal = true" />

    <!-- 페이지별 컨텐츠 영역 -->
    <main class="content-area">
      <div class="content-inner">
        <router-view />
      </div>

      <NotificationModal
        v-show="showNotificationModal"
        :is-modal-open="showNotificationModal"
        @close="showNotificationModal = false"
      />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  @apply w-full min-h-screen flex flex-col bg-white;
}

.content-area {
  @apply flex justify-center w-full flex-1;
}

.content-inner {
  @apply w-full max-w-[1200px]; /* 원하는 최대 너비 */
}
</style>
