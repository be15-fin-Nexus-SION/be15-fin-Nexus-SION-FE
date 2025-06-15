export const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("./views/LoginView.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("./views/SignupView.vue"),
    meta: {
      guestOnly: true,
    },
  },
];
