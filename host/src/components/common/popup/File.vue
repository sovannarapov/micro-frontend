<script lang="ts" setup>
  const props = defineProps({
    datas: {
      type: Object,
      default: {},
    },
    readOnly: {
      type: Boolean,
      default: () => false,
    },
  });
  const emit = defineEmits(['popup-emit']);
  const closePopup = data => {
    emit('popup-emit', data);
  };
</script>
<template>
  <b-form-file-new @close-popup="closePopup" :datas="datas" :readOnly="readOnly" />
</template>
<style></style>
