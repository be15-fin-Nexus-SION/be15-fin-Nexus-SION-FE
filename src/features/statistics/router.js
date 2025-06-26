export const statisticsRoutes = [
  {
    path: "/statistics/stack/member-count",
    name: "StackMemberCountView",
    component: () => import("./views/StackMemberCountView.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/statistics/stack/avg-career",
    name: "StackAvgCareerView",
    component: () => import("./views/StackAvgCareerView.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/statistics/stack/popular",
    name: "StackPopularView",
    component: () => import("./views/StackPopularView.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/statistics/project/participation",
    name: "ProjectParticipationView",
    component: () => import("./views/JobParticipation.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
