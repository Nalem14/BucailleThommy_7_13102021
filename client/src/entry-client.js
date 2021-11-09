import { createSSRApp } from "vue";
import { createWebHistory } from "vue-router";
import createRouter from "./router";
import App from "./App.vue";
// client-specific bootstrapping logic...

const app = createSSRApp(App);
const router = createRouter(createWebHistory());

app.use(router);

// this assumes App.vue template root element has `id="app"`
router.isReady().then(() => {
  app.mount("#app");
});
