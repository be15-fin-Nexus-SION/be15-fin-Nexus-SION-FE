export const squadRoutes = [
  {
    path: "squads",
    name: "squad-list",
    component: () => import("./views/SquadListView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "squads/:squadCode",
    name: "squad-detail",
    component: () => import("./views/SquadDetailView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "squads/create/:projectId",
    name: "squad-create",
    component: () => import("./views/SquadCreateView.vue"),
    meta: {
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
];
