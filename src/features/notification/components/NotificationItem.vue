<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification.js";
import { closeNotificationConnection } from "@/api/notificationSse";

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const notificationStore = useNotificationStore();

const router = useRouter();

const timeAgo = computed(() => {
  const now = new Date();
  const created = new Date(props.notification.createdAt);
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
});

async function goToRelatedPage() {
  let url = "";

  const type = props.notification.notificationType;
  console.log(type);

  switch (type) {
    case "TASK_UPLOAD_REQUEST":
      url = `/projects/history/register/${props.notification.linkedContentId}`;
      break;
    case "FP_ANALYSIS_COMPLETE":
    case "FP_ANALYSIS_FAILURE":
      url = `/projects/${props.notification.linkedContentId}`;
      break;
    case "SQUAD_SHARE":
      url = `/squads/${props.notification.linkedContentId}`;
      break;
    case "GRADE_CHANGE":
      return;
    case "TASK_APPROVAL_REQUEST":
    case "TASK_APPROVAL_RESULT":
    case "TASK_APPROVAL_REQUEST_AGAIN":
      url = `/projects/history/${props.notification.linkedContentId}`;
      break;
    case "CERTIFICATION_APPROVAL_REQUEST":
      url = `/admin/certificates/approval`;
      break;
    default:
      return;
  }

  await notificationStore.markAsRead(props.notification.notificationId);
  emit("close");

  // 🔄 새로고침하면서 페이지 이동
  window.location.href = url;
}
</script>

<template>
  <div
    class="flex items-center h-[44px] p-2 border border-stroke-gray rounded-md gap-2 cursor-pointer"
    @click="goToRelatedPage"
  >
    <div class="text-start text-bodySm leading-snug flex-1">
      <span v-if="!props.notification.isRead" class="text-red-500">* </span>
      <span>{{ props.notification.message }}</span>
      <span class="text-gray-300 pl-1">{{ timeAgo }}</span>
    </div>
  </div>
</template>

<style scoped></style>
