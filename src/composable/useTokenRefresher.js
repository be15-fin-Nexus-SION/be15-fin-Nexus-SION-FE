import { reissueAccessToken } from "@/api/member.js";
import { useAuthStore } from "@/stores/auth.js";

let isRefreshing = false;
let subscribers = [];

function onAccessTokenFetched(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

export async function refreshToken() {
  const authStore = useAuthStore();

  // 이미 갱신 중이면 Promise 대기
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      addSubscriber((newToken) => {
        if (!newToken) return reject(new Error("토큰 갱신 실패"));
        resolve(newToken);
      });
    });
  }

  isRefreshing = true;

  try {
    const res = await reissueAccessToken();
    const newToken = res.data.data.accessToken;
    authStore.setAuth(newToken);
    onAccessTokenFetched(newToken);
    return newToken;
  } catch (err) {
    onAccessTokenFetched(null); // 모든 구독자에게 실패 알림
    await authStore.clearAuth();
    throw err;
  } finally {
    isRefreshing = false;
  }
}
