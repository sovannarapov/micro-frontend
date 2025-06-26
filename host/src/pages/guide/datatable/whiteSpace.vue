<script setup>
definePageMeta({
  layout: 'guide',
});

const fields = reactive([
  { key: 'id', label: 'ID' },
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
const itemsFromServer = reactive([
  { age: 40, first_name: '    Dickerson', last_name: 'Macdonald' },
  { age: 21, first_name: '  Larsen', last_name: 'Shaw' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
  },
  { age: 38, first_name: '    ', last_name: '' },
  { age: 38, first_name: 'Jami', last_name: 'Carney' },
]);
// first_name field에 텍스트가 있는 item들만 반환
const items = computed(() =>
  // 1. map으로 id 삽입
  // 2. filter로 공백있는 item filtering
  itemsFromServer.map((item, index) => ({ ...item, id: index + 1 })).filter(item => item.first_name.trim().length > 0),
);
</script>

<template>
  <h1>Datatable</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(id)="row">
        <span>{{ row.item.id }}</span>
      </template>
      <template #cell(first_name)="row">
        <b-form-input readonly v-model="row.item.first_name"></b-form-input>
      </template>
    </b-table>
  </div>
</template>
