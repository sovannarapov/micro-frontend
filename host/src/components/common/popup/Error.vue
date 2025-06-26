<script lang="ts" setup>
  const props = defineProps({
    datas: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['popup-emit']);

  const { resultCd, resultData } = props.datas;
  const resultCode = computed(() => resultCd || '');
  const resultMessage = computed(() => {
    if (!resultData) return '';
    return {
      ...resultData,
      exceptionTrace: resultData.exceptionTrace.replace(/\r\n\tat|\n\tat/gi, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;at'),
    };
  });

  const showError = ref(false);
  const toggleError = () => {
    showError.value = !showError.value;
  };
</script>
<template>
  <ul class="listType1">
    <li>
      <span class="title">Error Msg</span><span class="fc_red">[{{ resultCode }}] {{ resultMessage.errorMsg }}</span>
    </li>
    <li><span class="title">Measures Msg</span>[{{ resultMessage.treatCd }}] {{ resultMessage.treatMsg }}</li>
    <li>
      <span class="title">Customized Msg</span>
      <p v-html="resultMessage.customMsg" />
    </li>
    <li><span class="title">Channel</span>{{ resultMessage.errChnlDstcd }}</li>
    <li><span class="title">UUID</span>{{ resultMessage.uuid }}</li>
  </ul>
  <div class="btn_area tar">
    <b-button class="btn" @click="toggleError">Error log</b-button>
  </div>
  <div v-show="showError" class="lineBox" v-html="resultMessage.exceptionTrace"></div>
</template>

<style>
  .lineBox {
    height: auto;
    max-height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 10px;
  }
</style>
