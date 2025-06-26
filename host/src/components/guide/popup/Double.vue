<script setup>
const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['popup-emit']);

const onClick = () => {
  const params = { test: 'from double popup' };
  emit('popup-emit', params);
};
</script>
<template>
  <h2>Dobule Popup Test</h2>
  <b-button @click="onClick">Confirm</b-button>
</template>
