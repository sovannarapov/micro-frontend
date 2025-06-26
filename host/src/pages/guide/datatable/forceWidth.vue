<script setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  'NO',
  { key: 'apiPath', label: 'API Path', class: 'text-left' },
  { key: 'tranName', label: 'Transaction Name', class: 'text-left' },
  { key: 'chnlDstcd', label: 'Channel Distinction Code' },
  { key: 'bzwkDstcd', label: 'Business Distinction Code' },
  {
    key: 'bzwkDtailDstcd',
    label: 'Business Detail Distinction Code Business Detail Distinction Code Business Detail Distinction Code',
    class: 'ws_normal',
  },
  { key: 'screnNo', label: 'Screen No' },
  { key: 'aplyStartYmd', label: 'Apply Start Date', thStyle: { width: '200px' } },
  { key: 'aplyEndYmd', label: 'Apply End Date', thStyle: { width: '200px' } },
  { key: 'tranCtrlYn', label: 'Trasaction Control Yn' },
  { key: 'useYn', label: 'Use Yn' },
  { key: 'logStorgYn', label: 'Log Store Yn' },
  { key: 'rmark', label: 'Remark' },
]);
const items = reactive([
  {
    apiPath: 'apiPath',
    tranName: 'tranName',
    chnlDstcd: 'chnlDstcd',
    bzwkDstcd: 'bzwkDstcd',
    bzwkDtailDstcd: 'bzwkDtailDstcd',
    screnNo: 'screnNo',
    aplyStartYmd: 'aplyStartYmd',
    aplyEndYmd: 'aplyEndYmd',
    tranCtrlYn: 'tranCtrlYn',
    useYn: 'useYn',
    logStorgYn: 'logStorgYn',
    rmark: 'rmark',
  },
  {
    apiPath: 'apiPath',
    tranName: 'tranName',
    chnlDstcd: 'chnlDstcd',
    bzwkDstcd: 'bzwkDstcd',
    bzwkDtailDstcd: 'bzwkDtailDstcd',
    screnNo: 'screnNo',
    aplyStartYmd: 'aplyStartYmd',
    aplyEndYmd: 'aplyEndYmd',
    tranCtrlYn: 'tranCtrlYn',
    useYn: 'useYn',
    logStorgYn: 'logStorgYn',
    rmark: 'rmark',
  },
  {
    apiPath: 'apiPath',
    tranName: 'tranName',
    chnlDstcd: 'chnlDstcd',
    bzwkDstcd: 'bzwkDstcd',
    bzwkDtailDstcd: 'bzwkDtailDstcd',
    screnNo: 'screnNo',
    aplyStartYmd: 'aplyStartYmd',
    aplyEndYmd: 'aplyEndYmd',
    tranCtrlYn: 'tranCtrlYn',
    useYn: 'useYn',
    logStorgYn: 'logStorgYn',
    rmark: 'rmark',
  },
  {
    apiPath: 'apiPath',
    tranName: 'tranName',
    chnlDstcd: 'chnlDstcd',
    bzwkDstcd: 'bzwkDstcd',
    bzwkDtailDstcd: 'bzwkDtailDstcd',
    screnNo: 'screnNo',
    aplyStartYmd: 'aplyStartYmd',
    aplyEndYmd: 'aplyEndYmd',
    tranCtrlYn: 'tranCtrlYn',
    useYn: 'useYn',
    logStorgYn: 'logStorgYn',
    rmark: 'rmark',
  },
  {
    apiPath: 'apiPath',
    tranName: 'tranName',
    chnlDstcd: 'chnlDstcd',
    bzwkDstcd: 'bzwkDstcd',
    bzwkDtailDstcd: 'bzwkDtailDstcd',
    screnNo: 'screnNo',
    aplyStartYmd: 'aplyStartYmd',
    aplyEndYmd: 'aplyEndYmd',
    tranCtrlYn: 'tranCtrlYn',
    useYn: 'useYn',
    logStorgYn: 'logStorgYn',
    rmark: 'rmark',
  },
]);
const page = ref(1);
const displayCnt = ref(10);
</script>

<template>
  <h1>Datatable - header width</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(NO)="row">
        {{ row.index + 1 + (page - 1) * displayCnt }}
      </template>
      <template #cell(aplyStartYmd)="row">
        <div style="width: 400px">{{ row.item.aplyStartYmd }}</div>
      </template>
    </b-table>
  </div>
</template>
