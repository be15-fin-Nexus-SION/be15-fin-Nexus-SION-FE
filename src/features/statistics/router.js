export const statisticsRoutes = [
  {
    path: "statistics",
    name: "statistics-overview",
    component: () => import("./views/StatisticsOverview.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
