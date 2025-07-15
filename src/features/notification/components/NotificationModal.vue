<script setup>
import NotificationList from "@/features/notification/components/NotificationList.vue";
import { ref } from "vue";
import { getNotifications } from "@/api/notification.js";
import { startLoading } from "@/composable/useLoadingBar.js";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import { useNotificationStore } from "@/stores/notification.js";
import Close_LG from "@/assets/icons/Close_LG.svg";

const emit = defineEmits(["close"]);
const scrollContainer = ref(null);
const notificationStore = useNotificationStore();

const fetchFn = async (page) => {
  try {
    startLoading();
    const data = await getNotifications(page);
    if (page === 0) {
      notificationStore.setNotifications(data.data.data.content); // 초기화
    } else {
      notificationStore.appendNotifications(data.data.data.content); // 추가
    }
    return data;
  } catch (e) {
    console.error("알림 목록 로드 실패", e);
    return [];
  }
};

const { isLastPage } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});

async function handleAllRead() {
  await notificationStore.markAllAsRead();
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="noti-modal">
      <div class="modal-header">
        <div class="header1">알림</div>
        <div class="flex gap-4">
          <button
            class="text-caption text-gray-400 hover:text-primary-hover"
            @click="handleAllRead"
          >
            모두 읽음 처리
          </button>
          <button class="cancel-button" @click="emit('close')">
            <img :src="Close_LG" alt="닫기 버튼" class="close-icon" />
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div
          v-if="notificationStore.notifications.length === 0"
          class="empty-message-wrapper"
        >
          <div class="text-gray-400 text-sm text-center py-2">
            도착한 알림이 없습니다
          </div>
        </div>
        <div v-else class="body-scroll" ref="scrollContainer">
          <NotificationList
            @close="emit('close')"
            :notifications="notificationStore.notifications"
          />
          <div v-if="isLastPage" class="text-gray-400 text-sm text-center py-2">
            sion
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/30 flex justify-center items-center z-50;
}

.noti-modal {
  @apply w-[480px] min-h-[80vh] max-h-[90vh] bg-white text-center shadow-elevated flex flex-col rounded-md;
}

.modal-header {
  @apply w-full flex justify-between items-center border-b p-4;
}

.close-icon {
  @apply w-4 h-4;
}

.cancel-button {
  @apply border-none cursor-pointer;
}

.modal-body {
  @apply flex-1 flex flex-col;
}

.header1 {
  @apply text-bodyLg font-bold text-left;
}

.body-scroll {
  @apply overflow-y-auto space-y-1 p-4 max-h-[70vh];
}

.empty-message-wrapper {
  @apply flex-grow flex justify-center items-center;
}
</style>
