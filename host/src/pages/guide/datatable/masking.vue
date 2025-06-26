<script lang="ts" setup>
import { numberWithCommas } from '@/common/util/helpers';

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
  {
    key: 'salary',
    label: 'Salary',
    formatter: value => {
      return numberWithCommas(value);
    },
  },
]);
const items = reactive([
  { age: 40, first_name: 'Dickerson', last_name: 'Macdonald', salary: '132356465354245.23424' },
  { age: 21, first_name: 'Larsen', last_name: 'Shaw', salary: '13235646535' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    salary: 5056564686445,
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', salary: 1231512312323 },
]);
</script>

<template>
  <h1>Datatable</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields"> </b-table>
  </div>
</template>
