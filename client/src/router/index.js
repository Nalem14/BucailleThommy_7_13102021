import { createRouter } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  { path: "/profile", name: "Profile", component: () => import("../views/Profile.vue") },
  { path: "/profile/settings", name: "ProfileSettings", component: () => import("../views/ProfileSettings.vue") },
];

export default function (history) {
  return createRouter({
    history,
    routes,
  });
}
