<script lang="ts" setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  {
    key: 'first_name',
    label: 'First Name',
    class: 'text-left',
    width: '150px',
    formatter: value => {
      return value;
    },
  },
  { key: 'last_name', label: 'Last Name', class: 'text-center' },
  { key: 'age', label: 'Age', class: 'text-right' },
]);
const items = reactive([
  { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney' },
]);
const fixed = ref(true);
</script>

<template>
  <h1>Datatable</h1>

  <div ref="tableau" class="boardlist">
    <b-table :fixed="fixed" responsive :items="items" :fields="fields">
      <template #head()="scope">
        <div class="text-nowrap">Heading {{ scope.label }}</div>
      </template></b-table
    >
  </div>
</template>
