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
    <nav>
        <h1>Postmaster</h1>
    </nav>
</template>

<style scoped>
@import '../assets/main.css';

nav {
    background-color: var(--color-background);
    color: var(--color-font);
    padding: 1rem;
    text-align: center;
}
</style>