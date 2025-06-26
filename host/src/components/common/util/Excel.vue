<script lang="ts" setup>
import { read, utils, writeFile, writeFileXLSX } from 'xlsx';

const tableau = ref();
const data = ref();

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
      const bstr = e.target.result;
      const wb = read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      data.value = utils.sheet_to_json(ws, { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });
      html.value = utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
    };

    reader.readAsBinaryString(file);
  }
};
</script>
<template>
  <input type="file" @change="onChange" />
  <br />
  <button @click="exportFileJson">Export XLSX json</button>
  <br />
  <button @click="exportFile">Export XLSX table</button>
</template>
