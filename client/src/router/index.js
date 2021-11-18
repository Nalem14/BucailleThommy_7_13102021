import { createRouter } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },

  { path: "/u/:id-:name", name: "Profile", component: () => import("../views/Profile.vue") },
  { path: "/u/settings", name: "ProfileSettings", component: () => import("../views/ProfileSettings.vue") },
  { path: "/u/messages", name: "Messages", component: () => import("../views/Message.vue") },
  
  { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue") },

  { path: "/p/:id-:slug", name: "Post", component: () => import("../views/Post.vue") },

  { path: "/c/:id-:slug", name: "Community", component: () => import("../views/Community.vue") },
];

export default function (history) {
  return createRouter({
    history,
    routes,
  });
}
