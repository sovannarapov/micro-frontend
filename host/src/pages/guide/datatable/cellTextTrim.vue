<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { cellTextTrimTableDataList } = storeToRefs(guideStore);

const fields = reactive([
  { key: 'first_name', label: 'First Name', thStyle: { width: '33.3%' } },
  { key: 'last_name', label: 'Last Name', thStyle: { width: '33.3%' } },
  {
    key: 'age',
    label: 'Age',
    thStyle: { width: '33.3%' },
  },
]);
</script>

<template>
  <h1>Datatable - cell text trim * 작업중</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="cellTextTrimTableDataList" :fields="fields">
      <template #cell(last_name)="row">
        <!-- td내 text의 max length 를 v-trim-text에 설정 -->
        <p :title="row.item.last_name" v-trim-text="'50'">
          {{ row.item.last_name }}
        </p>
      </template>
    </b-table>
  </div>
  <div>{{ cellTextTrimTableDataList }}</div>
  <br />
</template>
