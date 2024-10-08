<script lang="ts">
import type { ResultDataType } from '@/types'
import { defineComponent, ref, watchEffect, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './NavBar.vue'
import { format } from 'date-fns'
import { toast, type ToastType } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

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

        const notify = (message: string, level: ToastType | undefined) => {
            toast(message, {
                "theme": "dark",
                "type": level,
                "position": "bottom-center",
                "transition": "slide",
                "dangerouslyHTMLString": true
            })// ToastOptions
        }

        watch(
            () => router.currentRoute.value.query,
            (newQuery) => {
                if (newQuery.trackingNumber) {
                    trackingNumber.value = newQuery.trackingNumber as string
                }
            },
            { immediate: true }
        )
        watchEffect(() => {
            if (trackingNumber.value !== '') {
                router.push({ path: '/', query: { trackingNumber: trackingNumber.value } })
            } else {
                router.push({ path: '/' })
            }
        })

        const handleEnterKey = () => {
            if (trackingNumber.value.trim() !== '') {
                trackButton.value.click()
            }
        }

        return {
            notify,
            trackingNumber,
            resultData,
            imageResult,
            trackButton,
            handleEnterKey,
            proxyUrl,
            hideButton: false,
            isLoadingImages: false,
            isLoadingTracking: false
        }
    },
    computed: {
        reversedTrackingEvents() {
            return this.resultData.tracking_events.slice().reverse()
        }
    },
    methods: {
        formatDate(dateTime: string) {
            return format(new Date(dateTime), 'PPpp')
        },
        async trackPackage() {
            this.$forceUpdate()

            this.isLoadingTracking = true
            if (this.trackingNumber.trim() === '') {
                this.notify("Tracking number is empty", "warning")
                this.isLoadingTracking = false
                return
            }
            const response = await fetch(
                this.proxyUrl + 'track?tracking_reference=' + this.trackingNumber
            )
            if (!response.ok) {
                this.notify("Failed to track parcel. Please try again", "error")
                this.isLoadingTracking = false
                return
            }
            const tempData = await response.json()
            if (tempData.results[0].errors) {
                this.notify("Invalid tracking number", "error")
                this.resultData = tempData.results[0]
                this.isLoadingTracking = false
                return
            } else {
                this.resultData = tempData.results[0]
                this.isLoadingTracking = false
                this.$forceUpdate()
            }
        },
        async getTrackingImage() {
            this.isLoadingImages = true
            this.$forceUpdate()
            if (this.trackingNumber.trim() === '') {
                this.notify("Tracking number is empty", "warning")
                this.isLoadingImages = false
                return
            }
            const response = await fetch(
                this.proxyUrl + 'image?tracking_reference=' + this.trackingNumber
            )
            if (response.status == 404) {
                this.isLoadingImages = false
                this.notify("No images found for this parcel", "error")
                this.$forceUpdate()
                return
            }
            const tempData = await response.json()
            this.imageResult = tempData.images
            this.isLoadingImages = false
            this.$forceUpdate()
        },
        getIconType(status: string) {
            if (status.includes('Delivered')) {
                return 'check_circle'
            } else if (status.includes('in transit')) {
                return 'local_shipping'
            } else if (status.includes('depot') || status.includes('Depot')) {
                return 'home'
            } else if (status.includes('International departure')) {
                return 'flight_takeoff'
            } else if (status.includes('International arrival')) {
                return 'flight_land'
            } else if (
                status.includes('transit') ||
                status.includes('Transit') ||
                status.includes('With courier')
            ) {
                return 'local_shipping'
            } else {
                return 'info'
            }
        }
    }
})
</script>
<template>
    <NavBar />
    <div v-motion-slide-visible-top class="input-div">
        <input class="input" v-model="trackingNumber" type="text" placeholder="Enter tracking number"
            @keyup.enter="handleEnterKey" />
        <button class="button" ref="trackButton" @click="trackPackage">Track</button>
        <div v-if="resultData.tracking_events">
            <button v-if="resultData.tracking_events[0]" class="button" @click="getTrackingImage">
                Load images
            </button>
        </div>
    </div>

    <h1 v-if="resultData.errors?.[0].details == 'No data found for this Tracking Reference'" class="tracking-error">
    </h1>
    <h1 v-else-if="resultData.errors?.[0].details" class="tracking-error">
        Tracking Error: {{ resultData.errors?.[0].details }}
    </h1>

    <div v-else>
        <div v-if="isLoadingImages" class="loading-circle">
            <span class="loader"></span>
        </div>

        <div v-if="imageResult && imageResult.length > 0" class="tracking-images">
            <img v-motion-slide-visible-top class="tracking-image" v-for="(imageUrl, index) in imageResult" :key="index"
                :src="imageUrl" :alt="'Image ' + (index + 1)" />
        </div>

        <div>
            <div v-if="isLoadingTracking" class="loading-circle">
                <span class="loader"></span>
            </div>

            <div v-for="(item, index) in reversedTrackingEvents" :key="index" class="tracking-parent">
                <div>
                    <i class="material-icons-outlined large-icons" style="font-size: 60px"
                        v-motion-slide-visible-left>{{
                        getIconType(item.status) }}</i>
                </div>
                <div class="tracking-items" v-motion-slide-visible-right>
                    <div v-if="item.date_time" class="item-date">
                        <i class="material-icons-outlined">event</i>
                        <p>{{ formatDate(item.date_time) }}</p>
                    </div>
                    <div v-if="item.description" class="item-description">
                        <i class="material-icons-outlined">description</i>
                        <p>{{ item.description }}</p>
                    </div>
                    <div v-if="item.depot_name" class="item-location">
                        <i class="material-icons-outlined">pin_drop</i>
                        <p>{{ item.depot_name }}</p>
                    </div>
                    <div v-if="item.status" class="item-status">
                        <i class="material-icons-outlined">info</i>
                        <p>{{ item.status }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
