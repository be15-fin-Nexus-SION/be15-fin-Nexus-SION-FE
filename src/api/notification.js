import api from "./axios.js";

export function getNotifications(page = 1, size = 10) {
  return api.get("/notifications/me", {
    params: {
      page,
      size,
    },
  });
}

export function readAllNotifications() {
  return api.patch("/notifications/reads");
}

export function readANotification(notificationId) {
  return api.patch(`/notifications/reads/${notificationId}`);
}

export function shareSquad(payload) {
  return api.post("/notifications/squad-share", payload);
}
