import { createRouter } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
];

export default function (history) {
  return createRouter({
    history,
    routes,
  });
}
