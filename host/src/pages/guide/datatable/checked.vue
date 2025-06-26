<script lang="ts" setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  { key: 'isActive', label: 'Active' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'age', label: 'Age' },
]);
const items = reactive([
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  {
    isActive: false,
    age: 21,
    first_name: 'Larsen',
    last_name: 'Shaw',
  },
  {
    isActive: false,
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { isActive: false, age: 38, first_name: 'Jami', last_name: 'Carney' },
]);

const itemsBottom = reactive([
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  {
    isActive: false,
    age: 21,
    first_name: 'Larsen',
    last_name: 'Shaw',
  },
  {
    isActive: false,
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { isActive: false, age: 38, first_name: 'Jami', last_name: 'Carney' },
]);

const checkAll = computed({
  get() {
    for (const item of items) {
      if (!item.isActive) return false;
    }
    return true;
  },
  set(value) {
    for (const item of items) {
      item.isActive = value;
    }
  },
});

const checkAllThead = computed({
  get() {
    for (const item of itemsBottom) {
      if (!item.isActive) return false;
    }
    return true;
  },
  set(value) {
    for (const item of itemsBottom) {
      item.isActive = value;
    }
  },
});
</script>

<template>
  <h1>Datatable - checkbox</h1>

  <div>
    <b-form-checkbox v-model="checkAll">check all</b-form-checkbox>
  </div>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(isActive)="row">
        <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
      </template>
    </b-table>
  </div>
  <div>{{ items }} {{ checkAll }}</div>
  <br />
  <div ref="tableau" class="boardlist complex-head">
    <b-table :items="itemsBottom">
      <template #thead-top>
        <b-tr>
          <b-th><b-form-checkbox v-model="checkAllThead">&nbsp;</b-form-checkbox></b-th>
          <b-th>First Name</b-th>
          <b-th>Last Name</b-th>
          <b-th>Age</b-th>
        </b-tr>
      </template>
      <template #cell(isActive)="row">
        <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
      </template>
    </b-table>
  </div>
</template>
