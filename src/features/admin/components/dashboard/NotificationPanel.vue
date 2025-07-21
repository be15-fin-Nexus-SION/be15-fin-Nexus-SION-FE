<script setup>
import { ref } from "vue";
import { startLoading } from "@/composable/useLoadingBar.js";
import { getAllNotifications, getNotifications } from "@/api/notification.js";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import { useNotificationStore } from "@/stores/notification.js";
import { goToRelatedPage, timeAgo } from "@/composable/useNotification.js";

const myScrollContainer = ref(null);
const allScrollContainer = ref(null);

const fetchMyNotification = async (page) => {
  try {
    startLoading();
    const data = await getNotifications(page);
    return data;
  } catch (e) {
    console.error("알림 목록 로드 실패", e);
    return [];
  }
};

const fetchAllNotification = async (page) => {
  try {
    startLoading();
    const data = await getAllNotifications(page);
    return data;
  } catch (e) {
    console.error("알림 목록 로드 실패", e);
    return [];
  }
};

const {
  items: myNotifications,
  isLastPage: isMyLastPage,
  reset,
} = useInfiniteScroll({
  fetchFn: fetchMyNotification,
  scrollTargetRef: myScrollContainer,
});

const { items: allNotifications, isLastPage: isAllLastPage } =
  useInfiniteScroll({
    fetchFn: fetchAllNotification,
    scrollTargetRef: allScrollContainer,
  });

const notificationStore = useNotificationStore();

async function handleAllRead() {
  await notificationStore.markAllAsRead();
  await reset();
}
</script>

<template>
  <div class="flex gap-8 w-full">
    <!-- 내 알림 -->
    <div
      class="flex-1 p-6 space-y-5 rounded-xl shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
    >
      <div class="w-full flex justify-between items-center">
        <h3 class="text-[18px] font-bold text-[#333]">📥 내 알림</h3>
        <button
          v-if="myNotifications.length > 0"
          class="text-caption text-gray-400 hover:text-primary-hover"
          @click="handleAllRead"
        >
          모두 읽음 처리
        </button>
      </div>
      <div class="flex flex-col h-[200px]">
        <ul
          v-if="myNotifications.length > 0"
          class="overflow-y-auto hide-scrollbar space-y-4"
          ref="myScrollContainer"
        >
          <li
            v-for="item in myNotifications"
            :key="item.id"
            class="bg-white/90 rounded-lg px-5 py-4 border-l-4 border-[#90caf9] shadow-sm hover-setting transition-all"
            @click="goToRelatedPage(item)"
          >
            <div class="text-[14px] text-[#555] mb-1">
              <span v-if="!item.isRead" class="text-red-500">* </span>
              {{ item.message }}
            </div>
            <div class="text-[12px] text-[#999] text-right">
              {{ timeAgo(item) }}
            </div>
          </li>
          <li v-if="isMyLastPage" class="text-gray-400 text-sm text-center">
            sion
          </li>
        </ul>
        <div
          v-else
          class="h-full flex items-center justify-center text-gray-400 text-sm text-center"
        >
          알림이 없습니다.
        </div>
      </div>
    </div>

    <!-- 전체 알림 -->
    <div
      class="flex-1 p-6 rounded-xl shadow-lg transition-all bg-gradient-to-br from-[#f3e5f5] to-[#f8f4fc] border border-[#ce93d8]"
    >
      <h3 class="text-[18px] font-bold mb-5 text-[#333]">📢 전체 알림</h3>

      <div class="flex flex-col h-[200px]">
        <ul
          v-if="allNotifications.length > 0"
          class="overflow-y-auto hide-scrollbar space-y-4"
          ref="allScrollContainer"
        >
          <li
            v-for="item in allNotifications"
            :key="item.id"
            class="bg-white/90 rounded-lg px-5 py-4 border-l-4 border-[#ba68c8] shadow-sm transition-all"
          >
            <div v-if="item.receiverName" class="text-[12px] text-[#999] mb-2">
              {{ item.receiverName }}
            </div>
            <div class="text-[14px] text-[#555] mb-1">
              {{ item.message }}
            </div>
            <div class="text-[12px] text-[#999] text-right">
              {{ timeAgo(item) }}
            </div>
          </li>
          <li v-if="isAllLastPage" class="text-gray-400 text-sm text-center">
            sion
          </li>
        </ul>

        <div
          v-else
          class="h-full flex items-center justify-center text-gray-400 text-sm text-center"
        >
          알림이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-setting {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s ease;
}

.hover-setting:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.28);
}
</style>
