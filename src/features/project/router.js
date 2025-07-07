export const projectRoutes = [
  {
    path: "projects",
    name: "project-list",
    component: () => import("./views/ProjectListView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "projects/register",
    name: "project-register",
    component: () => import("./views/ProjectRegisterView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "projects/:projectCode",
    name: "project-detail",
    component: () => import("./views/ProjectDetailView.vue"),
    meta: { requiresAuth: true },
  },
];
