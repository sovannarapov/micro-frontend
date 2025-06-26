<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});
import * as XLSX from 'xlsx';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';

DataTable.use(DataTablesCore);

const data = [
  [1, 2],
  [3, 4],
];

let uploadedFile;

const getExtension = filename => {
  return filename.substring(filename.lastIndexOf('.') + 1);
};

const attachFile = event => {
  const target = event.target;
  if (target && target.files) {
    uploadedFile = target.files[0];
    const ext = getExtension(uploadedFile.name);

    if (ext === 'xlsx') parseXLSX();
  }
};

const parseXLSX = () => {
  const file = uploadedFile;
  const items = [];
  const reader = new FileReader();

  reader.onload = () => {
    const data = reader.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    workbook.SheetNames.forEach(sheetName => {
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      items.push(roa);
      console.log(items[0]);
    });
  };
  reader.readAsBinaryString(file);
};
</script>

<template>
  <div>
    <h1>Datatable</h1>
    <input
      id="upload-file"
      ref="singleFile"
      type="file"
      @change="attachFile"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    />
    <DataTable :data="data" class="display">
      <thead>
        <tr>
          <th>A</th>
          <th>B</th>
        </tr>
      </thead>
    </DataTable>
  </div>
</template>
