<script lang="ts">
import { defineComponent } from 'vue'
import LoginGoogle from './LoginGoogle.vue';

export default defineComponent({
    name: 'NavBar',
    components: {
        LoginGoogle,
    },
    setup() {
        return {}
    }
})
</script>

<template>
    <nav v-motion-slide-visible-top>
        <h1>Postmaster</h1>
        <div class="credits">
            <a
                target="_blank"
                href="https://fonts.google.com/icons?selected=Material+Symbols+Outlined:package_2:FILL@0;wght@700;GRAD@0;opsz@48&icon.query=deliver&icon.size=64&icon.color=%2374c7ec&icon.style=Outlined&icon.platform=web"
                >Package</a
            >
            icon from
            <a target="_blank" href="https://fonts.google.com/icons">Google Fonts</a>
            <LoginGoogle />
        </div>
    </nav>
</template>
