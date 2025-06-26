<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const formData = ref(new FormData());
const file = ref();
const callGetApi = async () => {
  try {
    const result = await useTestFetch('/uploadFile', {
      method: 'post',
      body: formData.value,
    });

    if (result && result.resultCd === '0000') {
      formData.value = new FormData();
      console.log('result :: ', result);
    }
  } catch (e) {
    console.warn(e);
  }
};

const onChange = event => {
  file.value = event.target.files ? event.target.files[0] : null;

  formData.value.append('file', file.value);
};
</script>
<template>
  <div>
    <h1>Rest api</h1>
    <br />
    <h2><strong>Get</strong></h2>
    <br />
    <b-form-file @change="onChange"></b-form-file>
    <div>
      <b-button @click="callGetApi">call get api</b-button>
    </div>
    <br />
    {{ file }}
  </div>
</template>
