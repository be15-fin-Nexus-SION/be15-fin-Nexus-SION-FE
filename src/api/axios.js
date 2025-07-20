import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";
import { reissueAccessToken } from "@/api/member.js";
import { stopLoading } from "@/composable/useLoadingBar.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ 중복 리프레시 방지 변수
let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken)
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  return config;
});

/* 강사님 코드로 초기 구조 세팅 */
api.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  async (err) => {
    stopLoading();
    const authStore = useAuthStore();
    const { config, response } = err;

    if (!config) return Promise.reject(err);

    if (config.url.includes("/auth/refresh")) {
      // 리프레시 요청에서 401이 오면 바로 로그아웃 처리
      await authStore.clearAuth();
      return Promise.reject(err);
    }

    // 401 에러만 처리
    if (response?.status === 401) {
      // 이미 재시도 한 요청이면 로그아웃 하고 에러 던짐
      if (config._retry) {
        await authStore.clearAuth();
        return Promise.reject(err);
      }
      config._retry = true;

      // 토큰 재발급 시도
      if (isRefreshing) {
        // ⏳ 리프레시 중이면 새 토큰 받을 때까지 대기
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await reissueAccessToken();
        const newToken = refreshRes.data.data.accessToken;
        authStore.setAuth(newToken);

        // 📣 기다리던 요청들에 새 토큰 전달
        onAccessTokenFetched(newToken);

        // 헤더 갱신 후 원래 요청 재시도
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshErr) {
        // 재발급 실패하면 로그아웃
        await authStore.clearAuth();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false; // ✅ 여기 추가!!
      }
    }

    // 그 외 에러는 그대로 던짐
    return Promise.reject(err);
  },
);

export default api;
