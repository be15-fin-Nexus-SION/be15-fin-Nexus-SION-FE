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
    path: "developers/:employeeId",
    name: "developer-detail",
    component: () => import("./views/DeveloperDetailView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "developers/add",
    name: "developer-add",
    component: () => import("./views/DeveloperAddView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/developers/:employeeId/edit',
    name: 'developer-edit',
    component: () => import("./views/DeveloperEditView.vue")
  },
];
