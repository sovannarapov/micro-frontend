<script setup>
import Contents from '@/components/csm/CSM0015M00.vue';

definePageMeta({
  layout: 'default',
  keepalive: true,
});
</script>

<template>
  <div class="contWrap">
    <business-title />
    <Contents />
  </div>

  
</template>
