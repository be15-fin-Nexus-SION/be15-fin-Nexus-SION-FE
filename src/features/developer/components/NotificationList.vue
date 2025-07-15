<template>
  <div
    class="h-[178px] p-6 rounded-xl bg-white shadow-[0_0_2px_rgba(0,0,0,0.25)] overflow-y-auto w-full hide-scrollbar"
  >
    <ul v-if="notifications.length > 0" class="space-y-4 text-sm text-gray-700">
      <li v-for="n in notifications" :key="n.notificationId">
        ✔ {{ n.message }} ({{ formatDate(n.createdAt) }})
      </li>
      <li
        class="h-full flex items-center justify-center cursor-pointer text-gray-400 text-sm text-center"
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

const notifications = ref([]);

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR");
}

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
