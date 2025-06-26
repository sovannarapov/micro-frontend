<script setup>
import { ref } from 'vue'
import RCounter from './components/RCounter.vue'
// import Home from './views/Home.vue'

const count = ref(0)
</script>

<template>
  <div>
    <!-- <Home /> -->
    <RCounter :count="count" @update:count="count = $event" />
  </div>
</template>
