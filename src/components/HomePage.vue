<script lang="ts">
import { defineComponent, ref, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()
        const trackingNumber = ref('')
        const resultData = ref('')
        const imageResult = ref('')
        const trackButton = ref()

        // Watch for changes in the route query parameters
        watch(
            () => router.currentRoute.value.query,
            (newQuery) => {
                // Check if the trackingNumber query parameter exists
                if (newQuery.trackingNumber) {
                    // Update the trackingNumber ref with the value from the URL
                    trackingNumber.value = newQuery.trackingNumber as string
                }
            },
            { immediate: true }
        ) // immediate: true ensures the watcher runs immediately after setup

        watchEffect(() => {
            // Check if trackingNumber is not empty before updating the URL
            if (trackingNumber.value !== '') {
                router.push({ path: '/', query: { trackingNumber: trackingNumber.value } })
            } else {
                // If trackingNumber is empty, clear the query parameter from the URL
                router.push({ path: '/' })
            }
        })

        const handleEnterKey = () => {
            console.log('Enter key pressed')
            // Call the trackPackage method when the Enter key is pressed
            trackButton.value.click()
        }

        return {
            trackingNumber,
            resultData,
            imageResult,
            trackButton,
            handleEnterKey
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
            this.imageResult = tempData.images
            console.log(JSON.stringify(this.imageResult))
        }
    }
})
</script>
<template>
    <h1>Postmaster</h1>
    <input
        v-model="trackingNumber"
        type="text"
        placeholder="Enter tracking number"
        @keyup.enter="handleEnterKey"
    />
    <button ref="trackButton" @click="trackPackage">Track</button>
    <button @click="getTrackingImage">Load images</button>

    <p>{{ resultData }}</p>
    <!-- Dynamically display images -->
    <div v-if="imageResult && imageResult.length > 0">
        <img
            v-for="(imageUrl, index) in imageResult"
            :key="index"
            :src="imageUrl"
            :alt="'Image ' + (index + 1)"
        />
    </div>
</template>
