import { createSSRApp } from "vue";
// server router uses a different history from the client one
import { createMemoryHistory } from "vue-router";
import createRouter from "./router";
import store from "./store";
import Notifications from "@kyvg/vue3-notification";
import App from "./App.vue";

export default function () {
  const app = createSSRApp(App);
  const router = createRouter(createMemoryHistory());

  app.use(router);
  app.use(store);
  app.use(Notifications);

  return {
    app,
    router,
  };
}
