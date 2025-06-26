<script lang="ts" setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  { key: 'first_name', label: 'First Name', width: '120px' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'show_details', label: 'Detail' },
]);
const items = reactive([
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  {
    isActive: false,
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    _showDetails: true,
  },
  { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' },
]);
</script>

<template>
  <b-datatable :fields="fields" :items="items" />
</template>
