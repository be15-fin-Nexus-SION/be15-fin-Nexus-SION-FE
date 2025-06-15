import { createRouter, createWebHistory } from "vue-router";
import AppShell from "@/components/AppShell.vue";
import { developerRoutes } from "@/features/developer/router.js";
import { projectRoutes } from "@/features/project/router.js";
import { squadRoutes } from "@/features/squad/router.js";
import { statisticsRoutes } from "@/features/statistics/router.js";
import { adminRoutes } from "@/features/admin/router.js";
import { authRoutes } from "@/features/auth/router.js";
import { scoreRoutes } from "@/features/score/router.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/developers",
      component: AppShell,
      children: [
        ...developerRoutes,
        ...projectRoutes,
        ...squadRoutes,
        ...statisticsRoutes,
        ...adminRoutes,
        ...scoreRoutes,
      ],
    },
    ...authRoutes,
  ],
});

// // 전역 가드
// router.beforeEach((to) => {
//   const authStore = useAuthStore()
//
//   // 인증 필요인데 로그인 안됨
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     showErrorToast('로그인이 필요한 페이지입니다.')
//     setTimeout(() => {
//       router.push('/developers')
//     }, 1000)
//   }
//
//   // 로그인된 사용자가 로그인/회원가입 페이지 접근 시
//   if ((to.name === 'login' || to.name === 'signup') && authStore.isAuthenticated) {
//     showErrorToast('이미 로그인된 상태입니다.')
//     return { path: '/developers' }
//   }
//
//   // 게스트 전용 페이지 접근 제한
//   if (to.meta.guestOnly && authStore.isAuthenticated) {
//     return { path: '/developers' }
//   }
// })

export default router;
