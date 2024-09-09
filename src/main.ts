import './assets/main.css'

import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

const app = createApp(App)

app.use(MotionPlugin)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000
} as ToastContainerOptions)

app.mount('#app')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch((error) => {
        console.error('Service worker registration failed:', error)
    })
}
