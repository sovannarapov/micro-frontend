<script setup>
import { writeFileXLSX, read, readFile, utils, SSF, write, writeFile } from 'xlsx-js-style';

useHead({
  script: [
    { src: '../../../public/js/FileSaver.min.js', type: 'text/javascript', async: true },
    { src: '../../../public/js/html2canvas.min.js', type: 'text/javascript', async: true },
    { src: '../../../public/js/tableExport.min.js', type: 'text/javascript', async: true },
  ],
});

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

const style = '<style>.green { background-color: green; }</style>';
onMounted(() => {});
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
  <div class="boardlist">
    <table class="pvtTable">
      <thead>
        <tr>
          <th></th>
          <th class="pvtColLabel" style="background: red">black</th>
          <th class="pvtColLabel">hisp</th>
          <th class="pvtColLabel">other</th>
          <th class="pvtTotalLabel">Totals</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="pvtRowLabel">no</td>
          <td class="pvtVal row0 col0">317</td>
          <td class="pvtVal row0 col1">494</td>
          <td class="pvtVal row0 col2">2,485</td>
          <td class="pvtTotal rowTotal">3,296</td>
        </tr>
        <tr>
          <td class="pvtRowLabel">yes</td>
          <td class="pvtVal row1 col0">187</td>
          <td class="pvtVal row1 col1">186</td>
          <td class="pvtVal row1 col2">691</td>
          <td class="pvtTotal rowTotal">1,064</td>
        </tr>
        <tr>
          <td class="pvtTotalLabel">Totals</td>
          <td class="pvtTotal colTotal">504</td>
          <td class="pvtTotal colTotal">680</td>
          <td class="pvtTotal colTotal">3,176</td>
          <td class="pvtGrandTotal">4,360</td>
        </tr>
      </tbody>
    </table>
    <table
      id="testTable"
      summary="Code page support in different versions of MS Windows."
      rules="groups"
      frame="hsides"
      border="2"
    >
      <caption>
        CODE-PAGE SUPPORT IN MICROSOFT WINDOWS
      </caption>
      <colgroup align="center"></colgroup>
      <colgroup align="left"></colgroup>
      <colgroup span="2" align="center"></colgroup>
      <colgroup span="3" align="center"></colgroup>
      <thead valign="top">
        <tr>
          <th>Code-Page<br />ID</th>
          <th>Name</th>
          <th>ACP</th>
          <th>OEMCP</th>
          <th>Windows<br />NT 3.1</th>
          <th>Windows<br />NT 3.51</th>
          <th>Windows<br />95</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1200</td>
          <td style="background-color: #00f; color: #fff">Unicode (BMP of ISO/IEC-10646)</td>
          <td></td>
          <td></td>
          <td>X</td>
          <td>X</td>
          <td>*</td>
        </tr>
        <tr>
          <td>1250</td>
          <td style="font-weight: bold">
            <a href="http://www.jquery2dotnet.com/">http://www.jquery2dotnet.com/</a>
          </td>
          <td>X</td>
          <td></td>
          <td>X</td>
          <td>X</td>
          <td>X</td>
        </tr>
        <tr>
          <td class="green">1255</td>
          <td>Hebrew</td>
          <td>X</td>
          <td></td>
          <td></td>
          <td></td>
          <td>X</td>
        </tr>
        <tr>
          <td>437</td>
          <td>MS-DOS United States</td>
          <td></td>
          <td>X</td>
          <td>X</td>
          <td>X</td>
          <td>X</td>
        </tr>
        <tr>
          <td>708</td>
          <td>Arabic (ASMO 708)</td>
          <td></td>
          <td>X</td>
          <td></td>
          <td></td>
          <td>X</td>
        </tr>
        <tr>
          <td>709</td>
          <td>Arabic (ASMO 449+, BCON V4)</td>
          <td></td>
          <td>X</td>
          <td></td>
          <td></td>
          <td>X</td>
        </tr>
        <tr>
          <td>710</td>
          <td>Arabic (Transparent Arabic)</td>
          <td></td>
          <td>X</td>
          <td></td>
          <td></td>
          <td>X</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.pvtTable,
th,
td {
  background-color: white;
  border: 1px solid blue;
}

.pvtColLabel,
.pvtRowLabel {
  background-color: gray;
  color: white;
}

.pvtTotalLabel,
.pvtGrandTotal,
.pvtTotal {
  background-color: green;
  color: white;
  border: 1px solid green;
}

.pvtTable > tbody > tr:nth-child(2n + 1) > td {
  background-color: #ccdf88;
}
</style>
