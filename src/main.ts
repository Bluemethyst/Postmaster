import './assets/main.css'

import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(MotionPlugin)
app.use(router)

app.mount('#app')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('service-worker.js')
        .then((registration) => {
            console.log('Service worker registered:', registration)
        })
        .catch((error) => {
            console.error('Service worker registration failed:', error)
        })
}
