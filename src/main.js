import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
//pinia在stores的index.js中1.独立维护2.统一导出
import pinia from './stores/index'
import './assets/main.css'
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
