<script setup>
const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['popup-emit', 'setCloseParam']);

const { rowIndex } = props.datas;

const onClick = () => {
  const param = { rowIndex, name: `branch ${rowIndex}` };
  emit('popup-emit', param);
};

// 닫기 버튼 클릭 시 전달한 파라미터가 있을 경우 설정
const onSetCloseParam = () => {
  const params = { closing: 'closing from single popup' };
  emit('setCloseParam', params);
};
</script>
<template>
  <br />
  <div>Row Index : {{ rowIndex }}</div>
  <div class="mt20">
    <b-button @click="onClick">Confirm</b-button>
    <b-button @click="onSetCloseParam">Set close param</b-button>
  </div>
</template>
