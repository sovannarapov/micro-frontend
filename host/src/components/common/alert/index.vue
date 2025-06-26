<script setup lang="ts">
  import { useCommonStore } from '@/store/common/';
  import { storeToRefs } from 'pinia';

  const commonStore = useCommonStore();

  const { alert } = storeToRefs(commonStore);
  const title = computed(() => commonStore.alert.title);
  const status = computed(() => commonStore.alert.status);
  const contents = computed(() => commonStore.alert.contents);

  const onConfirm = () => {
    commonStore.hideAlert({ flag: true });
  };
  const onClose = e => {
    commonStore.hideAlert({ flag: false });
    // error 상황일 경우 강제 confirm 처리
    if (status.value === 'error') onConfirm();
  };
</script>

<template>
  <b-modal id="modal-1" :title="title" v-model="alert.stat" hide-footer no-close-on-backdrop @close="e => onClose(e)">
    <p class="my-4" v-html="contents" />
    <div class="btn_area">
      <b-button class="btn btn_primary" block @click="onConfirm">Confirm</b-button>
    </div>
  </b-modal>
</template>
