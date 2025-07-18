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
    path: "projects/register",
    name: "project-register",
    component: () => import("@/features/project/views/ProjectRegisterView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "projects/:projectCode",
    name: "project-detail",
    component: () => import("./views/ProjectDetailView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/projects/history/register/:id",
    name: "project-history-register",
    component: () => import("./views/ProjectHistoryRegisterView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["INSIDER", "OUTSIDER"],
    },
  },
  {
    path: "/projects/history/:id",
    name: "project-history-detail",
    component: () => import("./views/ProjectHistoryDetailView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN", "INSIDER", "OUTSIDER"],
    },
  },
];
