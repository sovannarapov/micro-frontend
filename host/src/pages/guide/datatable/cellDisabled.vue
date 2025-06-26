<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
});

const guideStore = useGuideStore();
const { disableCell } = storeToRefs(guideStore);

const fields = reactive([
  { key: 'first_name', label: 'First Name' },
  {
    key: 'amount',
    label: 'Amount',
  },
  { key: 'last_name', label: 'Last Name' },
  {
    key: 'age',
    label: 'Age',
  },
]);

const onInputChange = (value, item) => {
  item = value;
};

// 대상 테이블 선언
const focusable = ref(null);
// 대상 input 목록
const inputs = reactive([]);
// enter event 적용
const initFocusEvent = () => {
  // 활상화된 input들 중 autoFocusable class가 있는 것들만 검색
  Object.assign(inputs, focusable?.value?.querySelectorAll('input.autoFocusable'));
  inputs.forEach((_, idx) => _.setAttribute('data-id', idx));

  const callback = e => {
    // enter 시 다음 input으로 이동
    if (e.which === 13) {
      const idx = parseInt(e.target.dataset['id']);
      const nextInput = inputs[idx + 1];

      if (nextInput) nextInput.focus();
    }
  };

  for (const node of inputs) {
    node.addEventListener('keyup', callback, false);
  }
};

// 테이블 데이터 로드 확인
watch(
  () => disableCell.value,
  value => {
    window.setTimeout(() => {
      inputs.splice(0);
      initFocusEvent();
    }, 300);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <h1>Datatable - cell & input disabled</h1>

  <div ref="focusable" class="boardlist">
    <b-table :items="disableCell" :fields="fields">
      <template #cell(amount)="row">
        <b-form-input
          :class="row.item?._cellVariants?.amount ? '' : 'autoFocusable'"
          v-model="row.item.amount"
          v-input-add-comma
          placeholder="Enter your name"
          :disabled="row.item?._cellVariants?.amount"
          @input="e => onInputChange(e, row.item.amount)"
        ></b-form-input>
      </template>
      <template #cell(age)="row">
        <b-form-input v-model="row.item.age"></b-form-input>
      </template>
    </b-table>
  </div>
  <div>{{ disableCell }}</div>
  <br />
</template>
