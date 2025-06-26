<script setup>
  definePageMeta({
    layout: 'guide',
  });

  const imageData = reactive([
    {
      used: 'Y',
      type: 'type 0',
      order: 'order 0',
      contents: '/images/darth-vader-main_4560aff7.jpeg',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 1',
      order: 'order 1',
      contents: '/images/01-rogue-one-story-gallery_d6a2ec25.jpeg',
      date: '11102022',
    },
  ]);
</script>
<template>
  <b-image-control :imageData="imageData" />
</template>
