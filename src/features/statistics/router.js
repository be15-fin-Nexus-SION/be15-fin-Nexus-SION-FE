export const statisticsRoutes = [
  {
    path: "/statistics/stack/member-count",
    name: "StackMemberCountView",
    component: () => import("./views/StackMemberCountView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
