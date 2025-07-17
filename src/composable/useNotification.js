import { closeNotificationConnection } from "@/api/notificationSse.js";
import { useNotificationStore } from "@/stores/notification.js";

export function timeAgo(notification) {
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

export async function goToRelatedPage(notification) {
  let url = "";

  const type = notification.notificationType;

  switch (type) {
    case "TASK_UPLOAD_REQUEST":
      url = `/projects/history/register/${notification.linkedContentId}`;
      break;
    case "FP_ANALYSIS_COMPLETE":
    case "FP_ANALYSIS_FAILURE":
    case "SQUAD_CONFIRMED":
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

  const notificationStore = useNotificationStore();
  await notificationStore.markAsRead(notification.notificationId);

  // 🔄 새로고침하면서 페이지 이동
  window.location.href = url;
}
