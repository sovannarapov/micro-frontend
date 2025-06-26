<script lang="ts" setup>
const props = defineProps({
  tranType: {
    type: String,
    default: '',
  },
  tranTypeList: {
    type: Object,
    default: () => [],
  },
  enabled: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['execBtn', 'changeTranType']);

const typesText = computed(() =>
  props.tranTypeList.reduce((acc, value, idx) => (acc += `${idx > 0 ? ' ' : ''}${idx + 1}: ${value.name}`), ''),
);
// 거래 구분
const tranTypeInner = ref('1');

watch(
  () => props.tranType,
  (newValue, oldValue) => {
    tranTypeInner.value = newValue;
  },
  { deep: true },
);

watch(
  () => tranTypeInner.value,
  (newValue, oldValue) => {
    emit('changeTranType', newValue);
  },
);

const onExec = async () => {
  const tgt = props?.tranTypeList?.filter(param => param.value === tranTypeInner.value)[0];
  const { value } = tgt ? toRaw(tgt) : 0;

  emit('execBtn');
};
</script>
<template>
  <!-- 실행 -->
  <ul class="notiarea flex_row jc_sb">
    <li class="form_box">
      <span class="text">Transaction Type</span>
      <b-form-select v-model="tranTypeInner" :options="tranTypeList" value-field="value" text-field="name">
      </b-form-select>
      <span class="text ml10">{{ typesText }}</span>
    </li>
    <li>
      <button class="btn" @click="onExec()" :disabled=enabled><span>Execute</span></button>
    </li>
  </ul>
  <!-- end 실행 -->
</template>
