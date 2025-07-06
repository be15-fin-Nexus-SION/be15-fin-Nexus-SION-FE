export const squadRoutes = [
  {
    path: "squads",
    name: "squad-list",
    component: () => import("./views/SquadListView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "squads/:squadCode",
    name: "squad-detail",
    component: () => import("./views/SquadDetailView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
