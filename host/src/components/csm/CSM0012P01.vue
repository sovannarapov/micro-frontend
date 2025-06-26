<script setup>
// import { storeToRefs } from 'pinia';
// import { useCommonStore } from '@/store/common';
// import { useCSM0012M00 } from '@/store/csm/CSM0012M00.js';
import { formatBytes, getSessionInfo } from '@/common/util/helpers';
import { setCodes, getCodes, getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import

// interface IpopupDatas {
//   fileBzwkDstic: string;
//   idnfiNo: string;
//   files: [];
// }

// interface IPopupInfo {
//   stat: boolean;
//   title: string;
//   width: number;
//   height: number;
//   component: string;
//   datas: IpopupDatas;
//   // TODO : type 작성
//   callback: (any) => void;
// }
const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
const sessionInfo = getSessionInfo();
const bzwkCode = getCodesFromStorage({
  key: 'bzwkInstncIdnfr',
  value: 'CSM000004',
  key: 'cmpsCdValCtnt',
  value: 'CSM0012M00',
})[0];
const insData = reactive({
  title: '',
  notiStartYmd: '',
  notiEndYmd: '',
  notiId: '',
  brncoBrnCd: sessionInfo.brnCode,
  regEmpId: sessionInfo.uno,
  regYms: '',
  notiYn: '',
  sysNotiYn: '',
  chgEmpId: '',
  chgYms: '',
  fixYn: '',
  lowrkBrnNotiYn: '',
  delEmpId: '',
  aplyEndYmd: '',
  delYn: '',
  lastJobUUID: '',
  content: '',
  fileId: [],
  fileBzwkDstic: bzwkCode.bzwkIncd ? bzwkCode.bzwkIncd : '0001', //공지사항은 csm다른 파일업로드는 업무에 맞는값으로 세팅
  fileInfo: [],
  fileDesc: [],
});
const fields = reactive([
  {
    key: 'originalFileName',
    label: 'File Name',
    thStyle: { width: '60%' },
  },
  {
    key: 'fileSize',
    label: 'File Size',
    thStyle: { width: '10%' },
    formatter: value => {
      return formatBytes(value);
    },
  },
  {
    key: 'fileDesc',
    label: 'Desc',
    thStyle: { width: '20%' },
    class: 'text-center',
  },
]);
const route = useRoute();
// const { path } = route;
// const sessionInfo = getSessionInfo();
// const menuTitle = path.substring(path.lastIndexOf('/') + 1);
// store 선언
// const commonStore = useCommonStore();
// const storeCSM0012M00 = useCSM0012M00();
// const { popup } = commonStore;
// const { fetchListNotice, fetchExecution } = storeCSM0012M00;
// const { notiListData } = storeToRefs(storeCSM0012M00);
// const idnfiNoValue = path.substring(path.lastIndexOf('/') + 1);
const uploadedFiles = ref([]);
const useYns = reactive([
  { value: '1', name: 'Y' },
  { value: '0', name: 'N' },
]);
const systemNotiList = reactive([
  { value: '1', name: 'IT' },
  { value: '0', name: 'Biz' },
]);
const propData = computed(() => props.datas);
watch(
  propData,
  (newValue, oldValue) => {
    console.log('propData====>>  ', propData, ' : ', newValue);
    //idnfiNo.value = newValue.idnfiNo; //required setting
    // if (newValue.fileBzwkDstic) {
    //   fileBzwkDstic.value = newValue.fileBzwkDstic;
    //   //getFilesInfo();
    // }
    Object.assign(insData, newValue.idnfiNo);
    if (newValue.uploaded) {
      uploadedFiles.value = [...uploadedFiles.value, ...newValue.uploaded];
    }
  },
  { deep: true, immediate: true },
);
const onClickDownLoad = (e, name) => {
  e.preventDefault();

  const filterFile = uploadedFiles.value.filter(file => file.originalFileName === name);

  if (filterFile) {
    const tgtFile = toRaw(filterFile[0]);
    const { filePath, fileName, originalFileName, fileExtension } = tgtFile;

    procDownload({ filePath, fileName, originalFileName, fileExtension });
  }
};
const procDownload = async param => {
  try {
    const result = await useDefaultFetch('/csm/downloadFile', {
      method: 'get',
      responseType: 'blob',
      params: {
        ...param,
      },
    });

    if (result) {
      const { data, fileName } = result;
      const url = window.URL.createObjectURL(data);

      const a = document.createElement('a');
      const clickHandler = () => {
        window.setTimeout(() => {
          window.URL.revokeObjectURL(url);
          removeEventListener('click', clickHandler);
        }, 150);
      };

      a.href = url;
      a.download = fileName || 'download';

      a.addEventListener('click', clickHandler, false);
      a.click();
    }
  } catch (e) {}
};
</script>

<template>
  <!-- <ul class="title_area sub">
    <li>
      <h2>Detail Contents</h2>
    </li>
  </ul> -->
  <div v-bind:class="[{ boardwrite: true }]">
    <table>
      <colgroup>
        <col width="110px" />
        <col width="*" />
        <col width="140px" />
        <col width="320px" />
        <col width="160px" />
        <col width="*" />
      </colgroup>
      <tbody>
        <tr>
          <th>Notified?(Y/N)</th>
          <td>
            <b-form-select
              v-select-mix
              v-model="insData.notiYn"
              :options="useYns"
              value-field="value"
              text-field="name"
              readonly
            >
            </b-form-select>
          </td>
          <th>Period Of Notified</th>
          <td>
            <div class="form_box">
              <b-date-picker v-model:modelValue="insData.notiStartYmd" readonly />
              <span class="text">~</span>
              <b-date-picker v-model:modelValue="insData.notiEndYmd" :minDate="insData.notiStartYmd" readonly />
            </div>
          </td>
          <th>System Notified?(Y/N)</th>
          <td>
            <b-form-select
              v-select-mix
              v-model="insData.sysNotiYn"
              :options="systemNotiList"
              value-field="value"
              text-field="name"
              readonly
            >
            </b-form-select>
          </td>
        </tr>
        <tr>
          <th>Title</th>
          <td colspan="5"><b-form-input v-model="insData.title" maxlength="300" readonly /></td>
        </tr>
        <tr>
          <th>Content</th>
          <td colspan="5">
            <textarea style="width: 100%; height: 200px" v-model="insData.content" readonly></textarea>
          </td>
        </tr>
        <tr>
          <th>Uploaded File</th>
          <td colspan="5">
            <div class="filebox">
              <!-- <b-form-tags input-id="" v-model="tags" class="tag"></b-form-tags> -->
              <div class="boardlist file-table" style="height: 193px">
                <b-table
                  striped
                  hover
                  selectable
                  sticky-header
                  responsive
                  id="my-table"
                  :fields="fields"
                  :items="uploadedFiles"
                >
                  <!-- <template #cell(fileDesc)="row">
                        <div style="width: 100px">
                          <b-form-input v-model="row.item.fileDesc"></b-form-input>
                        </div>
                      </template> -->
                  <template #cell(fileDesc)="row">
                    <b-form-input
                      v-model="row.item.fileDesc"
                      placeholder="Enter file Description"
                      readonly
                    ></b-form-input>
                    <span style="visibility: hidden">{{ row.item.fileDesc }}</span>
                  </template>
                  <template #cell(originalFileName)="row">
                    <a href="#" @click="e => onClickDownLoad(e, row.item.originalFileName)">{{
                      row.item.originalFileName
                    }}</a>
                  </template>
                </b-table>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- //con_area -->
</template>
