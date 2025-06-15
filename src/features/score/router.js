export const scoreRoutes = [
  {
    path: "score",
    name: "score-dashboard",
    component: () => import("./views/ScoreDashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
