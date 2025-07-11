export const developerRoutes = [
  {
    path: "developers",
    name: "developer-list",
    component: () => import("./views/DeveloperListView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN"],
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
      roles: ["ADMIN"],
    },
  },
  {
    path: "/developers/:employeeId/edit",
    name: "developer-edit",
    component: () => import("./views/DeveloperEditView.vue"),
  },

  {
    path: "/self-development/certificates",
    name: "self-development-certificates",
    component: () => import("./views/DeveloperCertificateTypeListView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["INSIDER", "OUTSIDER"],
    },
  },

  {
    path: "/self-development/owned",
    name: "developer-owned-certificates",
    component: () => import("./views/DeveloperOwnedCertificateView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["INSIDER", "OUTSIDER"],
    },
  },
];
