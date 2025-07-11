import { defineStore } from "pinia";

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
  },
});
