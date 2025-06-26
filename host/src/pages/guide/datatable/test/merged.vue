<script setup>
import { ref, onMounted } from 'vue';
import { read, utils, writeFile, writeFileXLSX } from 'xlsx';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const html = ref('');
const rows = ref([]);
const tableau = ref();
const data = ref();

onMounted(async () => {
  // const f = await fetch('https://sheetjs.com/pres.numbers');
  // const ab = await f.arrayBuffer();
  // const wb = read(ab);
  // rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
});

/* get live table and export to XLSX */
const exportFile = () => {
  const wb = utils.table_to_book(tableau.value.getElementsByTagName('TABLE')[0]);
  writeFileXLSX(wb, 'SheetJSVueHTML.xlsx');
};

const exportFileJson = () => {
  const ws = utils.json_to_sheet(data.value, { skipHeader: true });

  const merge = [
    { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } },
    // { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
  ];
  ws['!merges'] = merge;
  const wb = utils.book_new();

  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, 'SheetJSVueAoO.xlsx');
};

const onChange = event => {
  const file = event.target.files ? event.target.files[0] : null;
  if (file) {
    const reader = new FileReader();

    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      data.value = utils.sheet_to_json(ws, { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });
      console.log('data.value', data.value);
      html.value = utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
    };

    reader.readAsBinaryString(file);
  }
};
</script>

<template>
  <div ref="tableau" v-html="html"></div>
  <input type="file" @change="onChange" />
  <br />
  <button @click="exportFileJson">Export XLSX json</button>
  <br />
  <button @click="exportFile">Export XLSX table</button>
  <br />
  <br />
  <!-- <table>
    <thead>
      <th>Name</th>
      <th>Index</th>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in data" :key="idx">
        <td>{{ row.Name }}</td>
        <td>{{ row.Index }}</td>
      </tr>
    </tbody>
    <tfoot>
      <td colSpan="{2}"></td>
    </tfoot>
  </table> -->
</template>
