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
    path: "/admin/grade-per-unit-price",
    name: "SetGradePerUnitPriceView",
    component: () => import("./views/SetGradePerUnitPriceView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/initial-tech-stack",
    name: "SetInitialTechStackScoreView",
    component: () => import("./views/SetInitialTechStackScoreView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
