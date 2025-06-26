<script setup>
  import { procDownload, convertImg } from '@/common/util/helpers';

  const props = defineProps({
    datas: {
      type: Object,
      default: () => {},
    },
  });
  const fields = reactive([
    {
      key: 'used',
      label: 'Used?(Y/N)',
      class: 'text-left',
    },
    { key: 'type', label: 'Docs Type', class: 'text-left' },
    { key: 'order', label: 'Docs Order' },
    {
      key: 'originalFileName',
      label: 'File Name',
    },
    { key: 'date', label: 'Registration Date/Time' },
  ]);
  const fileData = reactive([
    {
      used: 'Y',
      type: 'type 0',
      order: 'order 0',
      filePath: 'test',
      fileName: 'test.png',
      originalFileName: 'test.png',
      defaultFilePath: '/channel_shareddata/',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 1',
      order: 'order 1',
      filePath: '0001',
      fileName: 'KBPBLOANKBPBONweblogic08112023160917000108001_71163943',
      originalFileName: 'PKIS-ITA-AN-06 Requirement Definition_230220_confirm.xlsx',
      fileExtension: 'xlsx',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 0',
      order: 'order 0',
      filePath: 'test',
      fileName: 'test.png',
      originalFileName: 'test.png',
      defaultFilePath: '/channel_shareddata/',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 1',
      order: 'order 1',
      filePath: '0001',
      fileName: 'KBPBLOANKBPBONweblogic08112023160917000108001_71163943',
      originalFileName: 'PKIS-ITA-AN-06 Requirement Definition_230220_confirm.xlsx',
      fileExtension: 'xlsx',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 0',
      order: 'order 0',
      filePath: 'test',
      fileName: 'test.png',
      originalFileName: 'test.png',
      defaultFilePath: '/channel_shareddata/',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 1',
      order: 'order 1',
      filePath: '0001',
      fileName: 'KBPBLOANKBPBONweblogic08112023160917000108001_71163943',
      originalFileName: 'PKIS-ITA-AN-06 Requirement Definition_230220_confirm.xlsx',
      fileExtension: 'xlsx',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 0',
      order: 'order 0',
      filePath: 'test',
      fileName: 'test.png',
      originalFileName: 'test.png',
      defaultFilePath: '/channel_shareddata/',
      contents: '',
      date: '11102022',
    },
    {
      used: 'Y',
      type: 'type 1',
      order: 'order 1',
      filePath: '0001',
      fileName: 'KBPBLOANKBPBONweblogic08112023160917000108001_71163943',
      originalFileName: 'PKIS-ITA-AN-06 Requirement Definition_230220_confirm.xlsx',
      fileExtension: 'xlsx',
      contents: '',
      date: '11102022',
    },
  ]);
  const fileImage = ref(null);
  const visibleRef = ref(false);

  const onClickContent = async param => {
    const tgtData = fileData[param];
    const { fileExtension } = tgtData;
    const imageExtension = ['jpg', 'png', 'gif', 'bmp'];

    if (fileExtension && !imageExtension.includes(fileExtension)) {
      visibleRef.value = false;
      procDownload('/csm/downloadFile', tgtData);

      return false;
    }

    try {
      convertImg('/csm/downloadFile', tgtData, data => {
        visibleRef.value = true;
        fileImage.value.handleImage(data);
      });
    } catch (e) {
      console.warn(e);
    }
  };
</script>
<template>
  <div class="con_area">
    <div class="boardlist">
      <b-table id="image-table" sticky-header responsive :items="fileData" :fields="fields">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(originalFileName)="row"
          ><a href="#" @click.prevent="e => onClickContent(row.index)">{{ row.item.originalFileName }}</a></template
        >
      </b-table>
    </div>
    <b-file-image-control v-show="visibleRef" ref="fileImage" imageHeight='600'/>
  </div>
</template>
<style scoped>
  .boardlist {
    margin-bottom: 20px;
  }
  #image-table {
    max-height: 220px;
  }
</style>
