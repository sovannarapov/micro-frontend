<script setup>
import { writeFileXLSX, read, readFile, utils, writeFile } from 'xlsx-js-style';

definePageMeta({
  layout: 'guide',
});

const htmlData = ref('');
const jsonData = reactive({});
const tableToExport = ref();
const exportName = ref('');
const wb = utils.book_new();

let row = [
  { v: 'Courier: 24', t: 's', s: { font: { name: 'Courier', sz: 24 } } },
  { v: 'bold & color', t: 's', s: { font: { bold: true, color: { rgb: 'FF0000' } } } },
  { v: 'fill: color', t: 's', s: { fill: { fgColor: { rgb: 'E9E9E9' } } } },
  { v: 'line\nbreak', t: 's', s: { alignment: { wrapText: true } } },
];
const ws = utils.aoa_to_sheet([row]);
// utils.book_append_sheet(wb, ws, 'readme demo');
// writeFile(wb, 'xlsx-js-style-demo.xlsx');
const o = utils.sheet_to_html(ws);
console.log('oooo', o);

const completeImport = data => {
  const { html, json } = data;

  htmlData.value = html;
  Object.assign(jsonData, json);

  console.log('jsonData', jsonData);
};
</script>

<template>
  <h1>Datatable - export, import</h1>

  <!-- prop mode : all || export || import -->
  <b-excel-util :targetTable="tableToExport" @on-import="completeImport" mode="all" :name="exportName" />
  <br /><br />
  <h2><strong>Import table 영역</strong></h2>
  <br /><br />
  <div class="boardlist">
    <div ref="tableau" v-html="htmlData"></div>
  </div>
  <br /><br />
  <h2><strong>Export table 영역</strong></h2>
  <br /><br />
  <h2><strong>Excel 명 입력</strong></h2>
  <b-form-input v-model="exportName" placeholder="Export할 excel명 지정" />
  <br /><br />
  <div ref="tableToExport" class="boardlist">
    <b-table-simple responsive>
      <caption>
        Items sold in August, grouped by Country and City:
      </caption>
      <colgroup>
        <col />
        <col />
      </colgroup>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <colgroup>
        <col />
        <col />
      </colgroup>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th colspan="2">Region</b-th>
          <b-th colspan="3">Clothes</b-th>
          <b-th rowspan="2">Accessories</b-th>
          <b-th rowspan="2">Rings</b-th>
        </b-tr>
        <b-tr>
          <b-th>Country</b-th>
          <b-th>City</b-th>
          <b-th>Trousers</b-th>
          <b-th>Skirts</b-th>
          <b-th>Dresses</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr>
          <b-th rowspan="3">Belgium</b-th>
          <b-th class="text-right">Antwerp</b-th>
          <b-td>0056</b-td>
          <b-td>22</b-td>
          <b-td>43</b-td>
          <b-td variant="success">72</b-td>
          <b-td>23</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Gent</b-th>
          <b-td>46</b-td>
          <b-td variant="warning">18</b-td>
          <b-td>50</b-td>
          <b-td>61</b-td>
          <b-td variant="danger">15</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Brussels</b-th>
          <b-td>51</b-td>
          <b-td>27</b-td>
          <b-td>38</b-td>
          <b-td>69</b-td>
          <b-td>28</b-td>
        </b-tr>
        <b-tr>
          <b-th rowspan="17">The Netherlands</b-th>
          <b-th class="text-right">Amsterdam</b-th>
          <b-td variant="success">89</b-td>
          <b-td>34</b-td>
          <b-td>69</b-td>
          <b-td>85</b-td>
          <b-td>38</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td>
        </b-tr>
      </b-tbody>
      <b-tfoot>
        <b-tr>
          <b-td colspan="7" variant="secondary" class="text-right"> Total Rows: <b>5</b> </b-td>
        </b-tr>
      </b-tfoot>
    </b-table-simple>
  </div>
</template>
