<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const compAlert = param => {
  console.log('compAlert', param);
};
const openAlert = () => {
  const options = { title: 'alert 1', contents: 'alert contents 1', param: { test: 'test' }, callback: compAlert };
  useAlert(options);
};
</script>
<template>
  <div>
    <h1>Alert</h1>

    <div>
      <b-button variant="outline-primary" @click="openAlert">Alert</b-button>
    </div>
  </div>
</template>
