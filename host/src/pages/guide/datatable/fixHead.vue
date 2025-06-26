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
</script>

<template>
  <h1>Datatable</h1>

  <div ref="tableau" class="boardlist">
    <b-table id="my-table" :items="items" :fields="fields" sticky-header responsive> </b-table>
  </div>
  <br />
  <br />
  <div class="boardlist">
    <b-table id="foot-table" :items="items" :fields="fields" sticky-header responsive>
      <template>
        <b-tr>
          <b-td colspan="3">12121</b-td>
        </b-tr>
      </template>
    </b-table>
  </div>
</template>
<style>
#my-table {
  max-height: 350px;
}
#my-table-with-footer {
  max-height: 350px;
}
</style>
