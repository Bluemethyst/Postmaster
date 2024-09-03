<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'NavBar',
    setup() {
        return {}
    }
})
</script>

<template>
    <nav v-motion-slide-visible-top>
        <h1>Postmaster</h1>
        <div class="credits">
            <a target="_blank" href="https://icons8.com/icon/86875/mail">Mail</a> icon by <a target="_blank"
                    href="https://icons8.com">Icons8</a>
        </div>
    </nav>
</template>

