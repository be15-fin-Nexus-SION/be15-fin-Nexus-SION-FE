export const projectRoutes = [
  {
    path: "projects",
    name: "project-list",
    component: () => import("./views/ProjectListView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "projects/:id",
    name: "project-detail",
    component: () => import("./views/ProjectDetailView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
