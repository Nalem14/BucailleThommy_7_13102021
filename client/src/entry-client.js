import { createSSRApp } from "vue";
import { createWebHistory } from "vue-router";
import createRouter from "./router";
import store from "./store";
import meta from "./plugins/meta";
import App from "./App.vue";

const app = createSSRApp(App);
const router = createRouter(createWebHistory());

app.use(router);
app.use(store);
app.use(meta);

// Routes auth guard
router.beforeEach(async (to) => {
  console.log(store)
  if (to.meta.requiresAuth && !store.getters['user/isAuthenticated']) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})

// this assumes App.vue template root element has `id="app"`
router.isReady().then(() => {
  app.mount("#app");
});
