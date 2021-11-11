import { createSSRApp } from "vue"
import { createWebHistory } from "vue-router"
import createRouter from "./router"
import store from './store'
import App from "./App.vue"

const app = createSSRApp(App)
const router = createRouter(createWebHistory())

app.use(router)
app.use(store)

// this assumes App.vue template root element has `id="app"`
router.isReady().then(() => {
  app.mount("#app")
})