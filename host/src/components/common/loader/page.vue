<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/store/common/';

type SorE = 'success' | 'error';

const commonStore = useCommonStore();
const { pageLoaded } = storeToRefs(commonStore);

const divClass = ref('pageLoaderWrap visible');
const status: SorE = 'success';
const percent = ref(0);
const color = '#fcaf17';
const failedColor = '#ed3f14';
const loadingInterval = ref();

const start = () => {
  percent.value = 0;
  divClass.value = 'pageLoaderWrap visible';
  loadingInterval.value = setInterval(() => {
    percent.value < 101 ? (percent.value += 10) : (percent.value = 100);
  }, 100);
};

const stop = () => {
  percent.value = 100;

  window.setTimeout(() => {
    divClass.value = 'pageLoaderWrap hidden';
  }, 500);

  clearInterval(loadingInterval.value);
};

type styleType = { width: string; backgroundColor?: string };
const styles = computed(() => {
  let style: styleType = {
    width: '',
    backgroundColor: '',
  };

  style.width = `${percent.value}%`;

  switch (String(status)) {
    case 'success':
      style.backgroundColor = color;
      break;
    case 'error':
      style.backgroundColor = failedColor;
      break;
  }
  return style;
});

watch(
  () => pageLoaded.value,
  (loaded, oldVal) => {
    loaded === true ? stop() : start();
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <div :class="divClass">
    <div class="loading-bar">
      <div class="inner" :style="styles"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pageLoaderWrap.visible {
  display: table;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 980;
  background-color: rgba(255, 255, 255, 0);
  transition: all 0.5s linear;
  p {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }

  .loading-bar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    & .inner {
      transition: width 0.2s linear;
      height: 3px;
    }

    & .color-primary {
      background-color: #fcaf17;
    }

    & .color-error {
      background-color: #ed3f14;
    }
  }
}
.pageLoaderWrap.hidden {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 980;
  background-color: rgba(255, 255, 255, 0);
  transition: all 1s linear;
}

.on-success {
  background-color: #fcaf17;
}
.on-error {
  background-color: #ed3f14;
}
</style>
