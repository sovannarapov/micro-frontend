<script setup lang="ts">
import { useCommonStore } from '@/store/common/';

const commonStore = useCommonStore();
const toggleClass = computed(() => (commonStore.loaderStatus ? 'show' : 'hide'));
</script>
<template>
  <div :class="`loading ${toggleClass}`" id="loading">
    <div class="d-flex justify-content-center mb-3">
      <b-spinner variant="warning" label="Spinning"></b-spinner>
    </div>
  </div>
</template>
<style scoped>
/*
 * Transition
 */
.view-enter-active,
.view-leave-active {
  transition: opacity 0.7s;
}

.view-leave-active {
  position: absolute;
}

.view-enter,
.view-leave-to {
  opacity: 0;
}

/*
 * Loading
 */
.v-progress-circular {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  color: greenyellow;
  margin: 0;
}

/* popup, loading */
.popup,
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  font-family: 'KBFG Text', sans-serif;
}
.loading.show {
  display: block;
}

.loading.hide {
  display: none;
}

.popup:before,
.loading:before {
  content: '';
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.popup {
  z-index: 1039;
}

.loading {
  z-index: 1040;
}
</style>
