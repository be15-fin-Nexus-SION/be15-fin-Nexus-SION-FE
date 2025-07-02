export const adminRoutes = [
  {
    path: "/admin/domains",
    name: "AdminDomainsView",
    component: () => import("./views/AdminDomainsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/jobs",
    name: "AdminJobsView",
    component: () => import("./views/AdminJobsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/tech-stacks",
    name: "AdminTechStacksView",
    component: () => import("./views/AdminTechStacksView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/clients",
    name: "AdminClientsView",
    component: () => import("./views/AdminClientsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
