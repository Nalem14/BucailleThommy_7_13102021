import { createRouter } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  { path: "/", name: "Home", meta: { requiresAuth: false }, component: () => import("../views/Home.vue") },

  { path: "/u/:id-:name", name: "Profile", meta: { requiresAuth: false }, component: () => import("../views/Profile.vue") },
  { path: "/u/settings", name: "ProfileSettings", meta: { requiresAuth: true }, component: () => import("../views/ProfileSettings.vue") },
  { path: "/u/messages", name: "Messages", meta: { requiresAuth: true }, component: () => import("../views/Message.vue") },
  
  { path: "/login", name: "Login", meta: { requiresAuth: false }, component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", meta: { requiresAuth: false }, component: () => import("../views/Register.vue") },

  { path: "/p/:id-:slug", name: "Post", meta: { requiresAuth: false }, component: () => import("../views/Post.vue") },

  { path: "/c/:id-:slug", name: "Community", meta: { requiresAuth: false }, component: () => import("../views/Community.vue") },
];

export default function (history) {
  return createRouter({
    history,
    routes,
  });
}
