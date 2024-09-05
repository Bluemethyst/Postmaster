import './assets/main.css'

import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import { config } from 'dotenv'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
const googleClientId = process.env.VUE_APP_GOOGLE_CLIENT_ID

app.use(MotionPlugin)
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: googleClientId
})

app.mount('#app')
