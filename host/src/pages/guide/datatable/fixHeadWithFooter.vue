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

const itemsWithFooter = reactive(JSON.parse(JSON.stringify(items)));

const addFooter = () => {
  itemsWithFooter.splice(0);
  Object.assign(itemsWithFooter, [
    ...items,
    {
      age: items.reduce((init, acc) => init + acc.age, 0),
      first_name: 'footer',
      last_name: 'Carney',
      _rowVariant: 'footer',
    },
  ]);
};
</script>

<template>
  <h1>Datatable</h1>
  <div class="boardlist footer">
    <b-table id="my-table-with-footer" :items="itemsWithFooter" :fields="fields" sticky-header responsive> </b-table>
  </div>
  <div><b-button @click="addFooter">Add Footer</b-button></div>
</template>
<style>
#my-table-with-footer {
  max-height: 350px;
}
</style>
