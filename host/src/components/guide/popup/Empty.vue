<script setup>
defineOptions({
  inheritAttrs: false,
});

const instance = getCurrentInstance();
const {
  suspense: { parent },
} = instance;
const isLayered = computed(() => (!parent ? true : false));

// isLayered.value가 true면 layerpopup
console.log('isLayered : ', isLayered.value);
</script>
<template>
  <div>parent 확인 parent 확인 parent 확인 parent 확인 parent 확인 parent 확인 parent 확인 parent 확인</div>
  <div>{{ isLayered }}</div>
</template>
