<script lang="ts" setup>
import { PropType } from 'vue';

const props = defineProps({
  fields: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const tableau = ref();
const onInputChange = (value, item) => {
  item = value;
};
</script>

<template>
  <common-util-excel />
  <br />
  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #thead-top="data">
        <b-tr>
          <b-th v-for="field in fields" :key="field.key" :style="{ width: field.width ? field.width : 'auto' }"
            ><span class="sr-only">{{ field.label }}</span></b-th
          >
        </b-tr>
      </template>
      <template #cell(first_name)="row">
        <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails"> Details via check </b-form-checkbox>
      </template>
      <template #cell(show_details)="row">
        <b-form-input
          v-model="row.item.first_name"
          placeholder="Enter your name"
          @input="e => onInputChange(e, row.item.first_name)"
        ></b-form-input>
        <span style="visibility: hidden">{{ row.item.first_name }}</span>
      </template>
    </b-table>
  </div>
</template>
<style>
.table.b-table thead tr:last-child {
  display: none;
}
</style>
