<template>
  <div class="flex flex-col h-[200px]">
    <ul
      v-if="notifications.length > 0"
      class="overflow-y-auto hide-scrollbar space-y-4"
    >
      <li
        v-for="n in notifications"
        :key="n.notificationId"
        class="bg-white/90 rounded-lg px-5 py-4 border-l-4 border-[#90caf9] shadow-sm hover-setting transition-all"
        @click="goToRelatedPage(n)"
      >
        <div class="text-[14px] text-[#555] mb-1">
          <span v-if="!n.isRead" class="text-red-500">* </span>
          {{ n.message }}
        </div>
        <div class="text-[12px] text-[#999] text-right">
          {{ timeAgo(n) }}
        </div>
      </li>
      <li
        class="text-gray-400 cursor-pointer text-sm text-center"
        @click="handleViewMore"
      >
        더보기
      </li>
    </ul>

    <!-- 가운데 정렬된 메시지 -->
    <div
      v-else
      class="h-full flex items-center justify-center text-gray-400 text-sm text-center"
    >
      알림이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNotifications } from "@/api/notification";
import { useModalStore } from "@/stores/modal.js";
import { goToRelatedPage, timeAgo } from "@/composable/useNotification.js";

const notifications = ref([]);

onMounted(async () => {
  try {
    const res = await getNotifications(0, 10);
    notifications.value = res.data?.data?.content ?? [];
  } catch (e) {
    console.error("❌ 알림 불러오기 실패:", e);
  }
});

const modalStore = useModalStore();
function handleViewMore() {
  modalStore.openModal();
}
</script>

<style scoped>
.hover-setting {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s ease;
}

.hover-setting:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.28);
}
</style>
