<script setup>
  definePageMeta({
    layout: 'guide',
  });

  const htmlData = ref('');
  const jsonData = reactive({});

  const completeImport = data => {
    const { html, json, keyedJson } = data;

    htmlData.value = html;
    Object.assign(jsonData, json);

    console.log('jsonData', json);
    console.log('keyedJson', keyedJson);
  };
  const clearImport = () => {
    useEmitEvent('excel', { clear: true });
  };

  const rowRange = reactive({ start: 1, end: 4 });
  // 시작 줄이나 마지막 줄 미지정
  // const rowRange = reactive({ start: 1, end: null });
</script>

<template>
  <div>
    <h1>Datatable - import Excel</h1>
    <br />
    <div>
      <h3>Row range 입력</h3>
      <br />
      <p>start</p>
      <b-form-input v-model="rowRange.start" type="number"></b-form-input>
      <p>end</p>
      <b-form-input v-model="rowRange.end" type="number"></b-form-input>
    </div>
    <br />
    <div class="guide-form-buttons">
      <b-excel-util mode="import" @on-import="completeImport" :rowRange="rowRange" button-name="select 이름 지정" />
      <b-button @click="clearImport">clear form data</b-button>
    </div>
    <br /><br />
    <h2><strong>Import table 영역</strong></h2>

    <br /><br />
    <div class="boardlist">
      <div ref="tableau" v-html="htmlData"></div>
    </div>
  </div>
</template>
<style lang="scss">
  .guide-form-buttons {
    > div {
      display: inline-block;
    }
    button {
      display: inline-block;
    }
  }
</style>
