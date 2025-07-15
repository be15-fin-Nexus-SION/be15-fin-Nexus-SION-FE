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

const getDashboardRouteByRole = (role) => {
  return role === "ADMIN"
    ? { name: "AdminDashboardView" }
    : { name: "developer-dashboard" };
};

const routes = [
  {
    path: "/",
    name: "home",
    component: AppShell,
    redirect: () => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return { name: "login" };
      return getDashboardRouteByRole(authStore.memberRole);
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

router.beforeEach((to) => {
  const authStore = useAuthStore();

  // 로그인 필요
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    showErrorToast("로그인이 필요한 페이지입니다.");
    return { name: "login" };
  }

  // 로그인, 회원가입 접근 시
  if (
    (to.name === "login" || to.name === "signup") &&
    authStore.isAuthenticated
  ) {
    return getDashboardRouteByRole(authStore.memberRole);
  }

  // guestOnly 접근 시
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return getDashboardRouteByRole(authStore.memberRole);
  }

  // / 접근 시 → 권한별 대시보드 이동
  if (to.path === "/" && authStore.isAuthenticated) {
    return getDashboardRouteByRole(authStore.memberRole);
  }

  // 권한 체크
  const { roles } = to.meta;
  if (
    Array.isArray(roles) &&
    roles.length > 0 &&
    !roles.includes(authStore.memberRole)
  ) {
    showErrorToast("접근 권한이 없습니다.");
    return false;
  }

  // allowSelfOrAdmin 체크
  if (to.meta.allowSelfOrAdmin) {
    const targetId = to.params.employeeId;
    if (
      !(authStore.memberRole === "ADMIN" || authStore.memberId === targetId)
    ) {
      showErrorToast("접근 권한이 없습니다.");
      return false;
    }
  }
});

export default router;
