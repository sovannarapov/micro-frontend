<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  imageData: {
    type: Object,
    default: () => [],
  },
});

const fields = reactive([
  'NO',
  {
    key: 'used',
    label: 'Used?(Y/N)',
    class: 'text-left',
  },
  { key: 'type', label: 'Docs Type', class: 'text-left' },
  { key: 'order', label: 'Docs Order' },
  {
    key: 'contents',
    label: 'Registration Reason Contents',
    formatter: value => {
      return value ? value.replace('/images/', '') : '';
    },
  },
  { key: 'date', label: 'Registration Date/Time' },
]);

const items = computed(() => props.imageData || []);

const page = ref(1);
const displayCnt = ref(10);

const visibleRef = ref(false);
const indexRef = ref(0);
const imgs = props.imageData.map(item => item.contents);

const zoomIn = ref();
const zoomOut = ref();
const rotateLeft = ref();
const rotateRight = ref();
const controlIntv = ref();

const onClickZoomIn = () => {
  zoomIn.value.click();
};

const onClickZoomOut = () => {
  zoomOut.value.click();
};

const onClickRotateRight = () => {
  rotateRight.value.click();
};

const enableControl = () => {
  controlIntv.value = window.setInterval(() => {
    if (document.querySelector('button.zoomIn')) {
      window.clearInterval(controlIntv.value);
      controlIntv.value = null;

      zoomIn.value = document.querySelector('button.zoomIn');
      zoomOut.value = document.querySelector('button.zoomOut');
      rotateLeft.value = document.querySelector('button.rotateLeft');
      rotateRight.value = document.querySelector('button.rotateRight');
    }
  }, 100);
};

const onClickContent = param => {
  showImage(param);
  enableControl();
};

const hideImage = () => (visibleRef.value = false);
const showImage = index => {
  indexRef.value = index;
  visibleRef.value = true;
};

const printImage = () => {
  const imgUrl = props.imageData[indexRef.value].contents;
  const newWindow = window.open('');

  newWindow?.document.write('<img src="' + imgUrl + '" onload="window.print();window.close()" />');
  newWindow?.focus();
};

onMounted(() => {
  showImage(0);
  enableControl();
});
</script>
<template>
  <div class="con_area">
    <div class="boardlist">
      <b-table id="image-table" :items="items" :fields="fields">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(contents)="row"
          ><a href="#" @click.prevent="e => onClickContent(row.index)">{{
            row.item.contents.replace('/images/', '')
          }}</a></template
        >
      </b-table>
    </div>
    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Preview</h2></li>
        <li class="form_box">
          <b-button class="ico ico_minus" @click="onClickZoomOut">minus</b-button>
          <b-button class="ico ico_plus" @click="onClickZoomIn">plus</b-button>
          <b-button class="btn btn_line" @click="onClickRotateRight">Image Rotation</b-button>
          <b-button class="btn btn_line" @click="() => printImage()">Print</b-button>
        </li>
      </ul>

      <div class="boxline">
        <vue-easy-lightbox :visible="visibleRef" :imgs="imgs" :index="indexRef" @hide="hideImage">
          <template v-slot:toolbar="{ toolbarMethods }">
            <button class="zoomIn" @click="toolbarMethods.zoomIn">zoom in</button>
            <button class="zoomOut" @click="toolbarMethods.zoomOut">zoom out</button>
            <button class="rotateLeft" @click="toolbarMethods.rotateLeft">Anticlockwise rotation</button>
            <button class="rotateRight" @click="toolbarMethods.rotateRight">clockwise rotation</button>
          </template>
        </vue-easy-lightbox>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.boxline {
  :deep(.vel-btns-wrapper) {
    display: none;
  }
}
</style>
