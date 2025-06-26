<script lang="ts" setup>
  import { useCommonStore } from '@/store/common/';
  import { storeToRefs } from 'pinia';

  const commonStore = useCommonStore();
  const { toggleBussinessError } = commonStore;
  const { businessError } = storeToRefs(commonStore);
  const { messages } = businessError.value;

  const statTimeout = ref();
  const stat = computed(() => businessError.value.stat);

  const clearErrorTimeout = () => {
    clearTimeout(statTimeout.value);
    statTimeout.value = null;
  };

  const clearToast = () => {
    clearErrorTimeout();
    toggleBussinessError('');
  };
  watch(
    () => stat.value,
    (currentStat, previousStat) => {
      clearErrorTimeout();
      if (currentStat !== previousStat) {
        if (currentStat !== '') {
          statTimeout.value = setTimeout(() => {
            toggleBussinessError('');
            clearErrorTimeout();
          }, 5000);
        }
      }
    },
  );
</script>
<template>
  <div :class="`toast-pop ${stat}`" :style="{ pointerEvents: stat ? 'all' : 'none' }">
    {{ messages[stat] }}
    <b-button class="btn-close" @click="clearToast()" v-if="stat !== ''"></b-button>
  </div>
</template>
