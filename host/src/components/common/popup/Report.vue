<script lang="ts" setup>
const props = defineProps({
  datas: {
    type: Object,
    default: {},
  },
});

const frame = ref();
const { datas } = props;
const loanParams = reactive({ delimiter: datas.params.delimiter, taildata: datas.params.taildata });
const propParams = reactive({
  report: datas.params.report,
  jsondata: datas.params.jsondata,
  odidata: datas.params.odidata,
  url: datas.url,
  ozservice: datas.service,
  viewerMode : datas.viewerMode,
});
if (datas.service === 'loan') Object.assign(propParams, loanParams);
</script>
<template>
  <common-oz-Exeviewer :reportData="propParams" />
  <!-- <common-oz-Hviewer :reportData="propParams" /> -->
</template>
