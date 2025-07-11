import { defineStore } from "pinia";
import { readAllNotifications, readANotification } from "@/api/notification.js";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  getters: {
    hasUnreadNotification(state) {
      return state.notifications.some((n) => !n.isRead);
    },
  },
  actions: {
    setNotifications(newList) {
      this.notifications = newList;
    },
    appendNotifications(moreList) {
      this.notifications.push(...moreList);
    },
    prependNotification(newOne) {
      this.notifications.unshift(newOne);
    },
    clearNotifications() {
      this.notifications = [];
    },
    // ✅ [신규] 단일 알림 읽음 처리 + 낙관적 업데이트 + 서버 싱크
    async markAsRead(notificationId) {
      const target = this.notifications.find((n) => n.id === notificationId);
      if (!target) return;
      try {
        target.isRead = true;

        await readANotification(notificationId);
      } catch (err) {
        console.error("읽음 처리 실패", err);
      }
    },
    async markAllAsRead() {
      try {
        await readAllNotifications();
        this.notifications.forEach((n) => {
          n.isRead = true;
        });
      } catch (err) {
        console.error("읽음 처리 실패", err);
      }
    },
  },
});
