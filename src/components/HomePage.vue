<script lang="ts">
import type { ResultDataType } from '@/types'
import { defineComponent, ref, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './NavBar.vue'

export default defineComponent({
    components: {
        NavBar
    },
    setup() {
        const proxyUrl = 'https://postmaster-proxy.bluemethyst.workers.dev/'
        const router = useRouter()
        const trackingNumber = ref('')
        const resultData = ref<ResultDataType>({ tracking_events: [] })
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
            if (trackingNumber.value.trim() !== '') {
                trackButton.value.click()
            }
        }

        return {
            trackingNumber,
            resultData,
            imageResult,
            trackButton,
            handleEnterKey,
            proxyUrl,
            hideButton: false
        }
    },
    methods: {
        async trackPackage() {
            if (this.trackingNumber.trim() === '') {
                console.log('Tracking number is empty.')
                return
            }
            const response = await fetch(
                this.proxyUrl + 'track?tracking_reference=' + this.trackingNumber
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
            if (this.trackingNumber.trim() === '') {
                console.log('Tracking number is empty.')
                return
            }
            const response = await fetch(
                this.proxyUrl + 'image?tracking_reference=' + this.trackingNumber
            )
            if (!response.ok) {
                console.error('Failed to gather images')
                return
            }
            const tempData = await response.json()
            this.imageResult = tempData.images
            console.log(JSON.stringify(this.imageResult))
        },
        getIconType(status: string) {
            if (status.includes('delivered')) {
                return 'check_circle'
            } else if (status.includes('in transit')) {
                return 'local_shipping'
            } else {
                return 'error'
            }
        }
    }
})
</script>
<template>
    <NavBar />
    <input
        class="input"
        v-model="trackingNumber"
        type="text"
        placeholder="Enter tracking number"
        @keyup.enter="handleEnterKey"
    />
    <button class="button" ref="trackButton" @click="trackPackage">Track</button>
    <button v-if="resultData.tracking_events[0]" class="button" @click="getTrackingImage">
        Load images
    </button>

    <!-- Dynamically display images -->
    <div v-if="imageResult && imageResult.length > 0" class="tracking-images">
        <img
            class="tracking-image"
            v-for="(imageUrl, index) in imageResult"
            :key="index"
            :src="imageUrl"
            :alt="'Image ' + (index + 1)"
        />
    </div>
    <div v-for="item in resultData.tracking_events" class="tracking-items">
        <p class="item-date">{{ item.date_time }}</p>
        <p class="item-description">
            <i class="material-icons icon-large">{{ getIconType(item.status) }}</i>

            {{ item.description }}
        </p>
        <p class="item-status">{{ item.status }}</p>
    </div>
</template>
