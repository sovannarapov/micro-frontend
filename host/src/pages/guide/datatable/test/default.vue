<script lang="ts" setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  {
    key: 'first_name',
    label: 'First Name',
    class: 'text-left',
    formatter: value => {
      return value;
    },
  },
  { key: 'last_name', label: 'Last Name', class: 'text-left' },
  { key: 'age', label: 'Age' },
]);
const items = reactive([
  { age: 40, align: 'right', first_name: 'Dickerson', last_name: 'Macdonald' },
  { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami7', last_name: 'Carney2' },
  {
    age: 89,
    first_name: 'asdfdsf',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami6', last_name: 'Carney3' },
  {
    age: 89,
    first_name: 'hfgdf',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami5', last_name: 'Carney4' },
  {
    age: 89,
    first_name: 'jjjj',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami4', last_name: 'Carney5' },
  {
    age: 89,
    first_name: 'kkkk',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami2', last_name: 'Carney6' },
  {
    age: 89,
    first_name: 'Geneva4',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami1', last_name: 'Carney7' },
]);

const displayCnt = ref(3);
const page = ref(1);
const rows = items.length;
const dpItem = computed(() => {
  const itemsObj = toRaw(items);
  const starts = (page.value - 1) * 3;
  const ends = starts + 3;
  const tobeObj = itemsObj.splice(starts, ends);
  console.log('itemsObj', itemsObj, starts, ends);
  return tobeObj;
});
// watch(
//   () => items,
//   (n, o) => {
//     console.log('??', n, o);
//   },
//   { deep: true },
// );
</script>

<template>
  <h1>Datatable</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields" :per-page="displayCnt" :current-page="page" id="my-table"> </b-table>
  </div>
  <b-pagination v-model="page" :total-rows="rows" :per-page="displayCnt" aria-controls="my-table"></b-pagination>
  <div>{{ page }} {{ displayCnt }} {{ rows }} {{ dpItem }}</div>
</template>
