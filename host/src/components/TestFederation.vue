<!-- filepath: host/src/components/TestFederation.vue -->
<script setup>
  import { ref } from 'vue';

  // Dynamically import remote component
  const RCounter = defineAsyncComponent(() => import('remote_app/components/RCounter'));

  const hostCount = ref(0);
  const remoteCount = ref(0);
  const remoteClass = ref('btn btn-secondary btn-lg'); // Class for remote button
</script>

<template>
  <div>
    <h2 class="h2">Host-Remote Reactive Test</h2>
    <p class="p">Host Count: {{ hostCount }}</p>
    <button class="btn btn-primary btn-lg" @click="hostCount++">Increment (from host)</button>
    <hr />
    <RCounter :remoteClass="remoteClass" :count="remoteCount" @update:count="remoteCount = $event" />
  </div>
</template>
