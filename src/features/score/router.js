export const scoreRoutes = [
  {
    path: "score",
    name: "score-dashboard",
    component: () => import("./components/ScoreDashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
