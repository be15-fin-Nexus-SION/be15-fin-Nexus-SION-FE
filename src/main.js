import "./assets/main.css";
import Toast from "vue-toastification";
import { VueQueryPlugin } from "@tanstack/vue-query";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "vue-toastification/dist/index.css";
import "pretendard/dist/web/static/pretendard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./App.vue";
import router from "./router/index.js";

// main.js

async function bootstrap() {
  const app = createApp(App);

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
  app.use(VueQueryPlugin);

  app.use(router);
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

  app.mount("#app");
}

bootstrap();
