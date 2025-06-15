export const adminRoutes = [
  {
    path: "admin/settings",
    name: "admin-settings",
    component: () => import("./views/AdminSettingsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "admin/users",
    name: "admin-user-list",
    component: () => import("./views/AdminUserListView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
