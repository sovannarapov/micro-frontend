<script setup>
const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['popup-emit', 'set-close-param']);

const onClick = () => {
  const params = { test: 'from single popup' };
  emit('popup-emit', params);
};

const popupCallback = param => {
  console.log('popupCallback dobule', param);
};
const onOpenPopup = () => {
  const options = { title: 'Double Popup', component: 'Double', width: 500, height: 300, callback: popupCallback };
  usePopup(options);
};
// 닫기 버튼 클릭 시 전달한 파라미터가 있을 경우 설정
const onSetCloseParam = () => {
  const params = { closing: 'closing from single popup' };
  // emit으로 close param 설정
  emit('set-close-param', params);
  // event bus로 close param 설정
  useEmitEvent('lyPopup', params);
};
</script>
<template>
  <h2>Popup Test</h2>
  <div>{{ datas }}</div>
  <b-button @click="onClick">Confirm</b-button>
  <b-button @click="onOpenPopup">Open Popup Again</b-button>
  <b-button @click="onSetCloseParam">Set close param</b-button>
</template>
