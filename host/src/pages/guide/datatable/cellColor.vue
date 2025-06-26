<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { highlightCell } = storeToRefs(guideStore);

const fields = reactive([
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  {
    key: 'age',
    label: 'Age',
  },
]);
</script>

<template>
  <h1>Datatable - cell color</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="highlightCell" :fields="fields" />
  </div>
  <div>{{ highlightCell }}</div>
  <br />
  <div>
    * guideStore 참고 하세요.<br />현재 작성된 예제는 age가 40이상인 경우와 이하인 경우의 class 를 info와 warning으로
    분기 처리하였습니다.<br />
    필요에 따라 분기 처리 후 class명은 추가 가능합니다.
  </div>
</template>
