// src/main.js

import "./assets/main.css";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import "pretendard/dist/web/static/pretendard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router/index.js";
import { useNotificationStore } from "@/stores/notification.js";
import { initNotificationSse } from "@/api/notificationSse.js";
import { useAuthStore } from "@/stores/auth.js";

async function bootstrap() {
  const app = createApp(App);

  // Pinia 설정
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  setActivePinia(pinia);
  app.use(pinia);

  // Vue Query
  app.use(VueQueryPlugin);

  // 라우터 (가드는 이미 router/index.js 에서 설정)
  app.use(router);

  // Toast
  app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });

  // SSE 연결 초기화
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    const notificationStore = useNotificationStore();
    initNotificationSse((data) => {
      notificationStore.prependNotification(data);
    });
  }

  // 마운트
  app.mount("#app");
}

bootstrap();
