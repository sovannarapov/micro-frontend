<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const onClickPopup = () => {
  const options = {
    title: 'Error',
    width: 1000,
    height: 250,
    component: 'Error',
    datas: [{ test: 'test' }],
  };
  usePopup(options);
};
</script>
<template>
  <div>
    <h1>Layer Popup</h1>

    <div>
      <b-button variant="outline-primary" @click="onClickPopup">Open popup</b-button>
    </div>
  </div>
</template>
