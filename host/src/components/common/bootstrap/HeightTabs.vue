<script setup>
  const props = defineProps({
    labels: {
      type: Array,
      default: () => [],
    },
    contents: {
      type: String,
      default: '',
    },
  });

  const activeLabel = ref(props.labels[0]);
  const singleTab = ref();

  const activateTab = index => {
    if (!singleTab.value) singleTab.value = document.querySelectorAll(`.${props.contents} > div`);
    activeLabel.value = props.labels[index];

    for (const [didx, div] of Object.entries(singleTab.value)) {
      div.style.overflow = 'hidden';
      div.style.height = 0;
      if (index === parseInt(didx)) div.style.height = 'auto';
    }
  };

  const onLabelClick = index => {
    activateTab(index);
  };

  onMounted(() => {
    singleTab.value = document.querySelectorAll(`.${props.contents} > div`);

    for (const [didx, div] of Object.entries(singleTab.value)) {
      if (parseInt(didx) !== 0) {
        div.style.overflow = 'hidden';
        div.style.height = 0;
      }
    }
  });

  defineExpose({
    activateTab,
  });
</script>
<template>
  <div>
    <div class="btn_tabs">
      <b-button
        v-for="(label, index) in labels"
        :key="label"
        @click="onLabelClick(index)"
        :class="`btn_tab ${activeLabel === label ? 'active' : ''}`"
        >{{ label }}</b-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .btn_tabs {
    margin-bottom: 20px;
  }
</style>
