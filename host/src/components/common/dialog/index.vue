<script setup lang="ts">
import { useCommonStore } from '@/store/common/';

const commonStore = useCommonStore();
const { dialog } = commonStore;

const title = computed(() => commonStore.dialog.title);
const contents = computed(() => commonStore.dialog.contents);
const cancelDialog = () => {
  commonStore.hideDialog();
};
const confirmDialog = () => {
  commonStore.hideDialog({ flag: true });
};
watch(
  () => dialog.stat,
  (newValue, oldValue) => {
    // console.log('dialog', newValue, oldValue);
  },
  { deep: true },
);
</script>

<template>
  <b-modal id="dialog-1" :title="title" v-model="dialog.stat" hide-footer no-close-on-backdrop>
    <div class="my-4" v-html="contents" />
    <div class="btn_area">
      <b-button class="btn" block @click="cancelDialog">Cancel</b-button>
      <b-button class="btn btn_primary" block @click="confirmDialog">Confirm</b-button>
    </div>
  </b-modal>
</template>
