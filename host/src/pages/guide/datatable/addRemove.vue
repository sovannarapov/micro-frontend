<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { addRow, removeRow, hideRow, clearRow } = guideStore;
const { addRemoveRows, selectedComboRow } = storeToRefs(guideStore);

const fields = reactive([
  { key: 'isActive', label: 'Active' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  {
    key: 'age',
    label: 'Age',
  },
]);

const selectedValue = reactive({});
const onInputChange = (key, rowIndex) => {
  // value : 선택된 combobox의 key
  // rowIndex : 선택된 행의 key

  // 선택된 값
  Object.assign(selectedValue, addRemoveRows.value[rowIndex].last_names[parseInt(key) - 1]);
};
</script>

<template>
  <h1>Datatable - add, remove, hide, clear row</h1>

  <div>
    <b-button @click="addRow">Add</b-button
    ><b-button @click="removeRow" :disabled="selectedComboRow.length === 0">Remove</b-button
    ><b-button @click="hideRow" :disabled="selectedComboRow.length === 0">Hide</b-button
    ><b-button @click="clearRow">Clear</b-button>
  </div>
  <div ref="tableau" class="boardlist">
    <b-table :items="addRemoveRows" :fields="fields">
      <template #cell(isActive)="row">
        <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
      </template>
      <template #cell(first_name)="row">
        <b-form-select
          v-model="row.item.last_name"
          v-select-mix
          :options="row.item.last_names"
          value-field="value"
          text-field="name"
          @change="e => onInputChange(e, row.index)"
        >
        </b-form-select>
      </template>
    </b-table>
  </div>
  <div>{{ addRemoveRows }}</div>
  <div>{{ selectedComboRow }}</div>
  <br />
</template>
