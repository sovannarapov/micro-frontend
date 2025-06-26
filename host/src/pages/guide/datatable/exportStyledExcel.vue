<script setup>
import { writeFileXLSX, read, readFile, utils, writeFile } from 'xlsx-js-style';

definePageMeta({
  layout: 'guide',
});

const exportName = ref('');
// style 적용된 aoa 데이터
const styledAoA = [
  [
    {
      v: 'TITLE',
      t: 's',
      s: { alignment: { horizontal: 'center' }, font: { bold: true, color: { rgb: '0000FF' }, sz: 30 } },
    },
    ,
    ,
    ,
    ,
    ,
    ,
  ],
  [
    { v: 'Courier: 24', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
    2,
    { v: 'line\nbreak', t: 's', s: { alignment: { wrapText: true } } },
    ,
    ,
    5,
    6,
    7,
  ],
  [2, 3, , , 6, 7, 8],
  [{ v: 'bold & color', t: 's', s: { font: { bold: true, color: { rgb: 'FF0000' } } } }, 4, , , 7, 8, 9],
  [4, 5, 6, 7, 8, { v: 'fill: color', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } }, 0],
];
// merge 대상
const merge = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
  { s: { r: 1, c: 2 }, e: { r: 3, c: 3 } },
  { s: { r: 1, c: 7 }, e: { r: 4, c: 7 } },
];
const htmlWithStyle = ref();

const completeParse = data => {
  const { html } = data;

  htmlWithStyle.value = html;
};
</script>

<template>
  <h1>Datatable - export styled excel</h1>
  <br />
  <b-form-input v-model="exportName" placeholder="Export할 excel명 지정" />
  <br />

  <b-excel-util
    mode="export"
    :name="exportName"
    :styledAoAData="styledAoA"
    :mergeOption="merge"
    @on-update="completeParse"
  />
  <br /><br />
  <h2><strong>Export할 table 영역</strong></h2>
  <br /><br />
  <div class="boardlist">
    <div ref="tableau" v-html="htmlWithStyle"></div>
  </div>

  <br /><br />
</template>
