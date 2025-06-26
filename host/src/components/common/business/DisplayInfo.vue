<script lang="ts" setup>
import { numberWithCommas } from '@/common/util/helpers';

const props = defineProps({
  displayCnt: {
    type: Number,
    default: 0,
  },
  pageCntList: {
    type: Array,
    default: () => [],
  },
  listData: {
    type: Object,
    default: () => {},
  },
  buttonEnabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['changeDisplayCnt', 'onClickButton']);
const displayCntInner = ref(props.displayCnt);

watch(
  () => displayCntInner.value,
  (newValue, oldValue) => {
    emit('changeDisplayCnt', Number(newValue));
  },
);
</script>
<template>
  <ul class="boardlist_top">
    <li class="form_box">
      <p class="text">
        Total
        <span>{{ !listData.totalCnt ? 0 : numberWithCommas(listData.totalCnt) }} </span>
      </p>
      <span class="text">show</span>
      <b-form-select v-model="displayCntInner" :options="pageCntList" value-field="value" text-field="name">
      </b-form-select>
    </li>
    <li v-if="buttonEnabled"><b-button @click="emit('onClickButton')">test</b-button></li>
  </ul>
</template>
