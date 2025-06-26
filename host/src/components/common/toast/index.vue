<script setup lang="ts">
import { useCommonStore } from '@/store/common';

interface IToastIns {
  show: () => {};
}

const nuxtApp = useNuxtApp();
const commonStore = useCommonStore();
const { toast, hideToast } = commonStore;
const { $toast } = nuxtApp;

watch(
  () => toast.stat,
  (newValue, oldValue) => {
    if (newValue) {
      toastIns.value?.show();
      hideToast({});
    }
  },
  { deep: true },
);

const toastIns = ref<IToastIns>();
const toastEl = ref(null);

onMounted(() => {
  toastIns.value = new $toast(toastEl.value);
});
</script>
<template>
  <div
    class="toast"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    data-bs-config='{"delay":2000, "title":123}'
    data-bs-customClass="beautifier"
    ref="toastEl"
  >
    <div class="toast-header">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">Hello, world! This is a toast message.</div>
  </div>
</template>
