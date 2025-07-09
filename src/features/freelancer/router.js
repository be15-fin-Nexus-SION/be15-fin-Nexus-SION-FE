export const freelancerRoutes = [
  {
    path: "/freelancers",
    name: "freelancer-list",
    component: () => import("./views/FreelancerListView.vue"),
    meta: { requiresAuth: true },
  },
];
