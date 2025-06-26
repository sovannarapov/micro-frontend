<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  interface FileValueType {
    value?: any;
  }

  const props = defineProps({
    imageHeight: {
      type:String,
      default: () => '380'
    }
  })
  const wrapper = ref(null);
  const visibleRef = ref(true);
  const indexRef = ref(0);
  const files: FileValueType = ref([0]);
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

  const handleImage = imgData => {
    files.value[0] = imgData;

    setTimeout(() => {
      showImage(0);
      enableControl();
    }, 100);
  };

  const hideImage = () => (visibleRef.value = false);
  const showImage = index => {
    indexRef.value = index;
  };

  const printImage = () => {
    const imgUrl = files.value[0];
    const newWindow = window.open('');

    newWindow?.document.write('<img src="' + imgUrl + '" onload="window.print();window.close()" />');
    newWindow?.focus();
  };

  defineExpose({ wrapper, handleImage });

  const wheelTgt = ref()
  onMounted(() => {
    enableControl();

    wheelTgt.value = document.querySelector('.boxline .vel-img-wrapper')
    if (wheelTgt.value) {
      wheelTgt.value.addEventListener("wheel", (e) => {
        e.preventDefault();
        e.stopPropagation()
      });
    }
  });

  onUnmounted(() => {
    wheelTgt.value.removeEventListener("wheel", (e) => {});
  })
</script>
<template>
  <div class="con_area" ref="wrapper" >
    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Preview </h2></li>
        <li class="form_box">
          <b-button class="ico ico_minus" @click="onClickZoomOut">minus</b-button>
          <b-button class="ico ico_plus" @click="onClickZoomIn">plus</b-button>
          <b-button class="btn btn_line" @click="onClickRotateRight">Image Rotation</b-button>
          <b-button class="btn btn_line" @click="() => printImage()">Print</b-button>
        </li>
      </ul>

      <div class="boxline" :style="`height:${props.imageHeight}px`">
        <vue-easy-lightbox :visible="visibleRef" :imgs="files" :index="indexRef" @hide="hideImage" >
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
