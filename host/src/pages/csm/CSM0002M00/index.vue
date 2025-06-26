<script setup>
  import Contents from '@/components/csm/CSM0002M00.vue';

  definePageMeta({
    layout: 'default',
    keepalive: true,
  });
</script>

<template>
  <div class="contWrap">
    <business-title :show="['exe:validateExe']" />
    <Contents />
  </div>
</template>
