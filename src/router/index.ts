import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        }
    ]
})

/*router.beforeEach((to, from, next) => {
    // Check if the route has a query parameter named 'trackingNumber'
    if (to.query.trackingNumber) {
        // Assuming you have a store or a way to manage state globally
        // For example, using Vuex or Pinia
        // Set the trackingNumber in your store/state
        store.commit('setTrackingNumber', to.query.trackingNumber)

        // Optionally, navigate to the same path to avoid flickering
        next({ ...to, replace: true })
    }

    next()
})*/

export default router
