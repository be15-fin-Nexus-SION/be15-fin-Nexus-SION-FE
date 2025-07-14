import { createRouter, createWebHistory } from "vue-router";
import AppShell from "@/components/AppShell.vue";

import { developerRoutes } from "@/features/developer/router.js";
import { projectRoutes } from "@/features/project/router.js";
import { squadRoutes } from "@/features/squad/router.js";
import { statisticsRoutes } from "@/features/statistics/router.js";
import { adminRoutes } from "@/features/admin/router.js";
import { authRoutes } from "@/features/auth/router.js";
import { scoreRoutes } from "@/features/score/router.js";

import { useAuthStore } from "@/stores/auth.js";
import { showErrorToast } from "@/utills/toast.js";
import { freelancerRoutes } from "@/features/freelancer/router.js";

const routes = [
  {
    path: "/",
    name: "home",
    component: AppShell,
    redirect: () => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        return { name: "login" }; // 미로그인 시 로그인 페이지로
      }
      if (authStore.memberRole === "ADMIN") {
        return { path: "/developers" }; // 관리자면 도메인 관리로
      }
      return { path: `/developers/dashboard` }; // 그 외는 자신의 프로필로
    },
    children: [
      ...developerRoutes,
      ...projectRoutes,
      ...squadRoutes,
      ...statisticsRoutes,
      ...adminRoutes,
      ...scoreRoutes,
      ...freelancerRoutes,
    ],
  },
  ...authRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 가드: 인증 · 권한 · guestOnly · 로그인/회원가입 접근 제어
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  // 1) 인증 필요 페이지인데 비로그인
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    showErrorToast("로그인이 필요한 페이지입니다.");
    return { path: `/login` };
  }

  // 2) 로그인한 상태로 login/signup 접근 금지
  if (
    (to.name === "login" || to.name === "signup") &&
    authStore.isAuthenticated
  ) {
    showErrorToast("이미 로그인된 상태입니다.");
    return { path: `/developers/${authStore.memberId}` };
  }

  // 3) guestOnly 페이지 접근 금지
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { path: `/developers/${authStore.memberId}` };
  }

  // 4) roles 메타로 권한 체크
  const { roles } = to.meta;
  console.log(roles);
  console.log(authStore.memberRole);
  if (
    Array.isArray(roles) &&
    roles.length > 0 &&
    !roles.includes(authStore.memberRole)
  ) {
    showErrorToast("접근 권한이 없습니다.");
    return { path: `/developers/${authStore.memberId}` };
  }

  if (to.meta.allowSelfOrAdmin) {
    const targetId = to.params.employeeId;
    const isAdmin = authStore.memberRole === "ADMIN";
    const isSelf = authStore.memberId === targetId;

    if (!isAdmin && !isSelf) {
      showErrorToast("접근 권한이 없습니다.");
      return { path: `/developers/${authStore.memberId}` };
    }
  }
  // 정상 진행
});

export default router;
