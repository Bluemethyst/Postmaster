<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const trackingNumber = ref('')
        const router = useRouter()

        watchEffect(() => {
            // Check if trackingNumber is not empty before updating the URL
            if (trackingNumber.value !== '') {
                router.push({ path: '/', query: { trackingNumber: trackingNumber.value } })
            } else {
                // If trackingNumber is empty, clear the query parameter from the URL
                router.push({ path: '/' })
            }
        })

        return {
            trackingNumber,
            resultData: ''
        }
    },
    methods: {
        async trackPackage() {
            const response = await fetch(
                '/api/tracking/api/parceltrack/parcels?tracking_reference=' + this.trackingNumber
            )
            if (!response.ok) {
                console.error('Failed to track package')
                return
            }
            const tempData = await response.json()
            this.resultData = tempData.results[0]
            console.log(this.trackingNumber)
            console.log(JSON.stringify(this.resultData))
        },
        async getTrackingImage() {
            const response = await fetch('api/tracking/api/image?tn=' + this.trackingNumber)
            if (!response.ok) {
                console.error('Failed to gather images')
                return
            }
            const tempData = await response.json()
            this.resultData = tempData.images
            console.log(JSON.stringify(this.resultData))
        }
    }
})
</script>
<template>
    <h1>Postmaster</h1>
    <input v-model="trackingNumber" type="text" placeholder="Enter tracking number" />
    <button @click="trackPackage">Track</button>
    <button @click="getTrackingImage">Load images</button>
</template>
