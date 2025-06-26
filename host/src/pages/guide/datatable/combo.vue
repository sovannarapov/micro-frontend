<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { selectRow } = guideStore;
const { comboTableDataList, selectedRow } = storeToRefs(guideStore);
const fields = reactive([
  { key: 'first_name', label: 'First Name' },
  { key: 'last_names', label: 'Last Name' },
  { key: 'age', label: 'Age' },
]);
const selectedValue = reactive({});
const onInputChange = (rowIndex, key) => {
  // value : 선택된 combobox의 key
  // rowIndex : 선택된 행의 key
  console.log('chnage', rowIndex, key);
  // 선택된 값
  // Object.assign(selectedValue, comboTableDataList.value[rowIndex].last_names[parseInt(key) - 1]);
};
</script>

<template>
  <h1>Datatable - selectable</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="comboTableDataList" :fields="fields">
      <template #cell(last_names)="row">
        <b-form-select
          v-model="row.item.last_name"
          v-select-mix
          :options="row.item.last_names"
          value-field="value"
          text-field="name"
          @change="e => onInputChange(row.index, e)"
        >
        </b-form-select>
      </template>
    </b-table>
  </div>
  <div>{{ comboTableDataList }}</div>
  <br />
  <div>
    <p>selected combobox ::</p>
    <p>{{ selectedValue }}</p>
  </div>
</template>
