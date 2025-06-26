<script setup>
  definePageMeta({
    layout: 'guide',
  });

  // 엑셀 import 시 엑샐 첫줄 데이터가 fields label에 없을 경우 import 제외 됨
  const fields = reactive([
    {
      key: 'first_name',
      label: 'First Name',
      class: 'text-left',
    },
    // excel import에서 제외 시킬 key에 excludeImport 설정
    { key: 'manager', label: 'Manager', excludeImport: true },
    { key: 'last_name', label: 'Last Name', class: 'text-left' },
    { key: 'date', label: 'Date' },
    { key: 'team', label: 'Team', excludeImport: true },
  ]);
  const excelTable = ref();
  const excelTableReady = ref(false);
  const htmlData = ref('');

  const completeImport = async data => {
    const { html, json } = data;

    htmlData.value = html;

    const filterTable = await useFilterColumn(fields, excelTable);
    excelTableReady.value = filterTable;
  };

  const clearImport = () => {
    useEmitEvent('excel', { clear: true });
  };
</script>

<template>
  <h1>Datatable - import Excel</h1>
  <br />

  <div class="guide-form-buttons">
    <b-excel-util mode="import" @on-import="completeImport" button-name="select 이름 지정" />
    <b-button @click="clearImport">clear form data</b-button>
  </div>
  <br /><br />
  <h2><strong>Import table 영역</strong></h2>

  <br /><br />
  <div class="boardlist">
    <div ref="excelTable" v-show="excelTableReady" v-html="htmlData"></div>
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
