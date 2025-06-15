export const developerRoutes = [
  {
    path: "developers",
    name: "developer-list",
    component: () => import("./views/DeveloperListView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "developers/:id",
    name: "developer-detail",
    component: () => import("./views/DeveloperDetailView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
