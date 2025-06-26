<script setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  'NO',
  {
    key: 'age',
    label: 'Age',
  },
  {
    key: 'first_name',
    label: 'First Name',
  },
  { key: 'last_name', label: 'Last Name', class: 'text-left' },
  { key: 'gender', label: 'Gender' },
]);
const itemsFromServer = reactive([
  { age: 40, first_name: 'Dickerson', last_name: 'Macdonald', gender: 'M' },
  { age: 40, first_name: 'Dickerson', last_name: 'Shaw', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'F',
  },
  { age: 38, first_name: 'merged Jami', last_name: 'Carney', gender: 'F' },
  {
    age: 25,
    first_name: 'merged Jami',
    last_name: 'Wilson',
    gender: 'F',
  },
  { age: 25, first_name: 'merged Jami', last_name: 'Carney', gender: 'F' },
  {
    age: 25,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'merged Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Geneva', last_name: 'merged Wilson', gender: 'M' },
  {
    age: 38,
    first_name: 'Geneva',
    last_name: 'merged Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'merged Wilson', gender: 'M' },
]);

const items = reactive([]);
const isBusy = ref(false);
const getData = async () => {
  isBusy.value = true;
  Object.assign(items, itemsFromServer);

  try {
    const options = {
      id: '#complex-table',
      data: fields,
      // merge 제외 해야하는 대상 column index 삽입
      exclude: [0, 4],
    };
    const merged = await useMergeRow(options);

    if (merged) isBusy.value = false;
  } catch (e) {
    console.warn(e);
  }
};
</script>

<template>
  <h1>Datatable - merge row</h1>
  <br /><br />
  <div><b-button @click="getData">load data</b-button></div>
  <br />
  <div class="boardlist sticky-head">
    <b-table id="complex-table" responsive :fields="fields" :items="items" :busy="isBusy">
      <template #cell(NO)="row">
        {{ row.index + 1 }}
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>
<style scoped>
#complex-table {
  height: 350px;
}
#fixed-table tr.oddr td {
  background-color: rgb(244, 244, 244);
}
</style>
