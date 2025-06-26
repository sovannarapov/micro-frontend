<script lang="ts" setup>
  const props = defineProps({
    buttonName: {
      type: String,
      default: () => 'Select File',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    fileName: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: File,
      default: null,
    },
  });

  const FormFile = ref();
  const files = ref();

  const importFile = () => {
    FormFile.value.click();
  };

  const clearForm = () => {
    files.value = null;
    FormFile.value.value = '';
  };

  watch(
    () => props.modelValue,
    (newValue, oldVaue) => {
      if (newValue !== oldVaue) {
        if (newValue === null) files.value = null;
      }
    },
    { deep: true, immediate: true },
  );

  watch(
    () => props.fileName,
    name => {
      if (!name) files.value = null;
    },
  );

  defineExpose({
    clearForm,
  });
</script>
<template>
  <div>
    <input accept="*" type="file" id="formFile" ref="FormFile" label="File input" />
    <b-button @click="importFile" :disabled="isDisabled">{{ buttonName }}</b-button>
    <span class="fileName" v-if="fileName">{{ fileName }}</span>
  </div>
</template>
<style lang="scss">
  #formFile {
    display: none;
  }

  .fileName {
    padding: 5px;
  }
</style>
