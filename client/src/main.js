import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
// import { createMetaManager, defaultConfig, resolveOption } from 'vue-meta'

// const metaManager = createMetaManager(defaultConfig, resolveOption)
const app = createApp(App)
    
app.use(Router)
// app.use(metaManager)
app.mount('#app')