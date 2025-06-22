import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// Vitest 환경 설정
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true, // describe, test, expect 전역 사용 가능
    environment: "jsdom", // DOM 환경 제공
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
