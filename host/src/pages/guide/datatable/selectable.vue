<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { selectRow } = guideStore;
const { tableDataList, tableDataListSelectable, selectedRow } = storeToRefs(guideStore);
const fields = reactive([
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'age', label: 'Age' },
]);
const selected = ref([]);
const onRowSelected = item => {
  selected.value = item;
};
</script>

<template>
  <h1>Datatable - selectable</h1>

  <br /><br />
  Select row type 1<br />
  <div class="boardlist">
    <b-table :items="tableDataList" :fields="fields" @row-clicked="selectRow"> </b-table>
  </div>
  <div>{{ tableDataList }}</div>
  <br />
  <div>
    <p>selected row ::</p>
    <p>{{ selectedRow }}</p>
  </div>
  <br />
  <br />
  <hr />
  <br />
  <br />
  Select row type 2<br />
  <div class="boardlist">
    <b-table :items="tableDataListSelectable" :fields="fields" selectable @row-selected="onRowSelected"> </b-table>
  </div>
  <div>
    <p>selected row ::</p>
    <p>{{ selected }}</p>
  </div>
</template>
