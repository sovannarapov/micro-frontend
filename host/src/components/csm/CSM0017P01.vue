<script setup>
const props = defineProps({
  datas: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(['popup-emit']);

const closePopup = data => {
  emit('popup-emit', data);
};
</script>
<template>
  <b-form-file-new @close-popup="closePopup" :datas="datas" />
</template>
<style></style>
