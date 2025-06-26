<script setup>
  definePageMeta({
    layout: 'guide',
  });

  const fields = reactive([
    { key: 'first_name', label: 'First Name', thStyle: { width: '500px' } },
    { key: 'last_name', label: 'Last Name' },
    { key: 'age', label: 'Age' },
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
</script>

<template>
  <h1>Datatable - header width</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields"> </b-table>
  </div>
</template>
