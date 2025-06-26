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

const items = reactive(
  new Array(15)
    .fill(null)
    .map((item, index) => ({ age: index + 1, first_name: `Jami ${index + 1}`, last_name: 'Carney' })),
);

const fixColFields = reactive([
  { key: 'id', stickyColumn: true, variant: 'bg_green' },
  { key: 'a', stickyColumn: true, variant: 'bg_red' },
  ,
  { key: 'b', stickyColumn: true, variant: 'bg_yellow' },
  ,
  { key: 'c', stickyColumn: true, variant: 'bg_blue' },
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
]);

const fixColItems = reactive([]);

const loadedItems = reactive([
  {
    id: 1,
    a: 'aaaaaaaaaa',
    b: 'bbbbbbbbbb',
    c: 'cccccccccc',
    d: 'dddddddddd',
    e: 'eeeeeeeeee',
    f: 'ffffffffff',
    g: 'gggggggggg',
    h: 'hhhhhhhhhh',
    i: 'iiiiiiiiii',
    j: 'jjjjjjjjjj',
    k: 'kkkkkkkkkk',
    l: 'llllllllll',
  },
  { id: 2, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 3, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 4, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 5, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 6, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 7, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 8, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 9, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
  { id: 10, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11 },
]);

const onLoadData = () => {
  Object.assign(fixColItems, loadedItems);
};

// column fix를 위해 설정
useFixedColumn(fixColItems, 'fix-column-table', 'left');
</script>

<template>
  <h1>Datatable</h1>
  <br />
  <div>
    <b-button @click="onLoadData">load data</b-button>
    <span class="ml20">배경 칼라 bg_green / bg_red / bg_yellow / bg_blue</span>
  </div>
  <br />
  <div class="boardlist">
    <b-table
      id="fix-column-table"
      sticky-header
      responsive
      :no-border-collapse="false"
      :items="fixColItems"
      :fields="fixColFields"
    >
      <!-- <template #head(id)="scope">
        <div class="text-nowrap">Row ID</div>
      </template>
      -->
      <template #row()="scope">
        <div class="text-nowrap">Heading {{ scope.label }}</div>
      </template>
    </b-table>
  </div>
</template>

<style scoped>
.boardlist {
  width: 800px;
}
#fix-column-table {
  max-height: 200px;
}
</style>
