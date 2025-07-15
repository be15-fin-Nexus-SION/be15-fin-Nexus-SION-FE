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
import { closeNotificationConnection } from "@/api/notificationSse.js";
import { useNotificationStore } from "@/stores/notification.js";

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

function timeAgo(notification) {
  const now = new Date();
  const created = new Date(notification.createdAt);
  const diff = now - created;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return `${seconds}초`;
  if (minutes < 60) return `${minutes}분`;
  if (hours < 24) return `${hours}시간`;
  if (days < 7) return `${days}일`;
  return `${weeks}주`;
}

const notificationStore = useNotificationStore();

async function goToRelatedPage(notification) {
  let url = "";

  const type = notification.notificationType;
  console.log(type);

  switch (type) {
    case "TASK_UPLOAD_REQUEST":
      url = `/projects/history/register/${notification.linkedContentId}`;
      break;
    case "FP_ANALYSIS_COMPLETE":
    case "FP_ANALYSIS_FAILURE":
      url = `/projects/${notification.linkedContentId}`;
      break;
    case "SQUAD_SHARE":
      url = `/squads/${notification.linkedContentId}`;
      break;
    case "GRADE_CHANGE":
      return;
    case "TASK_APPROVAL_REQUEST":
    case "TASK_APPROVAL_RESULT":
    case "TASK_APPROVAL_REQUEST_AGAIN":
      url = `/projects/history/${notification.linkedContentId}`;
      break;
    case "CERTIFICATION_APPROVAL_REQUEST":
      url = `/admin/certificates/approval`;
      break;
    default:
      return;
  }

  closeNotificationConnection();
  await notificationStore.markAsRead(notification.notificationId);

  // 🔄 새로고침하면서 페이지 이동
  window.location.href = url;
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
