<script setup lang="ts">
  import { useDropzone } from 'vue3-dropzone';
  import { useCommonStore } from '@/store/common';
  import { storeToRefs } from 'pinia';
  import { formatBytes, procDownload } from '@/common/util/helpers';

  interface IpopupDatas {
    fileBzwkDstic: string;
    idnfiNo: string;
    files: [];
  }

  interface IPopupInfo {
    stat: boolean;
    title: string;
    width: number;
    height: number;
    component: string;
    datas: IpopupDatas;
    // TODO : type 작성
    callback: (any) => void;
  }

  interface IUploadedFile {
    fileExtension: string;
    fileBzwkDstic: string;
    fileId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    idnfiNo: string;
    originalFileName: string;
  }

  interface IFileType {
    name: string;
    size: number;
  }

  interface IStateFilesType {
    files: IFileType[];
  }

  interface IStateFilesComputed {
    value: IFileType[];
  }

  const props = defineProps({
    datas: {
      type: Object,
      default: () => {},
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['closePopup']);

  const commonStore = useCommonStore();
  const { popup, showToast, attachFiles, uploadFiles, fetchFilesInfo } = commonStore;
  const propData = computed(() => props.datas);
  const formData = ref(new FormData());
  const state: IStateFilesType = reactive({
    files: [],
  });
  const fields = reactive([
    {
      key: 'originalFileName',
      label: 'File Name',
      thStyle: { width: '70%' },
    },
    {
      key: 'fileSize',
      label: 'File Size',
      thStyle: { width: '20%' },
      formatter: value => {
        return formatBytes(value);
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      thStyle: { width: '10%' },
      class: 'text-center',
    },
  ]);

  const fileBzwkDstic = ref();
  const idnfiNo = ref();

  const currentAttachedFiles = computed(() => {
    const temp: IStateFilesComputed = ref([]);

    temp.value = state.files;

    return temp.value;
  });
  const uploadedFiles: any = ref([]);
  const blockedExtensiions =
    'exe,cmd,bat,sh,js,jsp,html,htm,java,class,sql,script,jscript,vbscript,css,xhtml,jspf,asp,php';
  // const sizeLimit = 20000000;
  const sizeLimit = 50000000;

  const onDrop = (acceptFiles, rejectReasons) => {
    // console.log(acceptFiles);

    const overfileSize = acceptFiles.filter(file => file.size > sizeLimit);
    console.log('overfileSize:::  ', overfileSize.size);
    if (overfileSize.length > 0) {
      const overfileSizeAlertOptions = {
        title: 'alert',
        contents: 'The maximum upload file size is [50MB].',
        status: 'error',
        callback: null,
      };
      // console.log('overFileSize', overfileSizeAlertOptions);
      useAlert(overfileSizeAlertOptions);
    }

    const blockedExtenstionFiles = acceptFiles.filter(file => blockedExtensiions.includes(file.name.substring(file.name.lastIndexOf('.')+1)));
     console.log('blockedExtenstionFiles:::  ', blockedExtenstionFiles[0]);
    if (blockedExtenstionFiles.length > 0) {
      const blockedExtenstionFilesAlertOptions = {
        title: 'alert',
        contents: `This file is not allowed to be uploaded. [${blockedExtenstionFiles[0].path.substring(blockedExtenstionFiles[0].path.lastIndexOf('.')+1)}].`,
        status: 'error',
        callback: null,
      };
      // console.log('blockedExtenstionFiles', blockedExtenstionFilesAlertOptions);
      useAlert(blockedExtenstionFilesAlertOptions);
    }

    const filteredFiles = acceptFiles.filter(
      file => !blockedExtensiions.includes(file.name.substring(file.name.lastIndexOf('.')+1)) && file.size < sizeLimit,
    );

    state.files = [...state.files, ...filteredFiles];
  };

  const onClickDeleteAttached = index => {
    state.files.splice(index, 1);
  };

  const { getRootProps, getInputProps, open, isDragActive, ...rest } = useDropzone({
    onDrop,
  });

  const onUpload = async () => {
    const rawFiles = toRaw(state.files);

    rawFiles.forEach((item: any) => {
      formData.value.append('files', item);
    });

    if (fileBzwkDstic.value) formData.value.append('fileBzwkDstic', fileBzwkDstic.value);

    formData.value.append('idnfiNo', idnfiNo.value);

    try {
      const result = await uploadFiles(formData.value);

      if (result) {
        // TODO : toast style
        // showToast({});
        // if (typeof callBackFn === 'function') callBackFn(state.files);
        if (fileBzwkDstic.value && fileBzwkDstic.value === 'HELP') {
          getFilesInfo();
        } else {
          const options = { title: 'Success', contents: 'Upload complete.', param: result, callback: closePopup };

          useAlert(options);
        }
      }
      state.files = [];
      formData.value = new FormData();
    } catch (e) {
      console.warn(e);
    }
  };

  const closePopup = data => {
    emit('closePopup', data);
  };

  const getFilesInfo = async () => {
    // console.log('idnfiNo.value==>>  ', idnfiNo.value);
    const list = await fetchFilesInfo({ idnfiNo: idnfiNo.value, fileBzwkDstic: fileBzwkDstic.value });

    uploadedFiles.value = list;
  };

  const onClickDownLoad = (e, name) => {
    e.preventDefault();

    const filterFile = uploadedFiles.value.filter((file: IUploadedFile) => file.originalFileName === name);

    if (filterFile) {
      const tgtFile = toRaw(filterFile[0]);
      const { filePath, fileName, originalFileName, fileExtension } = tgtFile;

      procDownload('/csm/downloadFile', { filePath, fileName, originalFileName, fileExtension });
    }
  };

  const procDelete = async param => {
    const { fileId } = param;
    const result = await useDefaultFetch('/csm/delFile', {
      method: 'post',
      body: param,
    });

    if (result && result.resultCd === '0000') {
      if (fileBzwkDstic.value) getFilesInfo();
      if (!fileBzwkDstic.value) {
        uploadedFiles.value = uploadedFiles.value.filter(item => param.fileId !== item.fileId);
        useEmitEvent('file', { deleted: true, fileId });
      }
    }
  };

  const onClickDelete = row => {
    const { fileId, fileName, filePath } = row;
    const params = { fileId, fileName, filePath };
    const options = {
      title: 'confirm',
      contents: 'Are you sure you want to delete?',
      callback: procDelete,
      param: params,
    };

    useDialog(options);
  };

  if (props.readOnly) {
    for (const [index, field] of Object.entries(fields)) {
      if (field.key === 'delete') fields.splice(parseInt(index));
    }
  }

  watch(state, (newValue, oldValue) => {
    // console.log('attached files :::: ', newValue);
  });

  watch(isDragActive, () => {
    // console.log('isDragActive', isDragActive.value, rest);
  });

  watch(
    propData,
    (newValue, oldValue) => {
      idnfiNo.value = newValue.idnfiNo; //required setting
      if (newValue.fileBzwkDstic) {
        fileBzwkDstic.value = newValue.fileBzwkDstic;
        getFilesInfo();
      }

      if (newValue.uploaded) {
        uploadedFiles.value = [...uploadedFiles.value, ...newValue.uploaded];
      }
    },
    { deep: true, immediate: true },
  );

  onUnmounted(() => {
    state.files = [];
    formData.value = new FormData();
  });
</script>
<template>
  <div class="files_area">
    <ul class="title_area">
      <li>
        <h2>File Upload</h2>
      </li>
    </ul>
    <template :class="props.readOnly ? 'hidden' : 'shown'">
      <div class="dropzone" v-bind="getRootProps()">
        <div class="border" :class="{ isDragActive }">
          <input v-bind="getInputProps()" />
          <p v-if="isDragActive">Drop the files here ...</p>
          <p v-else>Drag and drop files here, or Click to select files</p>
        </div>
      </div>
      <div class="mt20">
        <h2>Attached Files</h2>
      </div>
      <div class="files">
        <ul class="file-item" v-for="(file, index) in currentAttachedFiles" :key="index">
          <li>{{ file.name }}</li>
          <li class="tar pr20" v-format-bytes>{{ file.size }}</li>
          <li class="delete-file" @click="onClickDeleteAttached(index)">Delete</li>
        </ul>
      </div>
      <div class="mt20">
        <b-button class="btn btn_primary" :disabled="currentAttachedFiles.length === 0 ? true : false" @click="onUpload"
          >Upload</b-button
        >
      </div>
    </template>
    <div class="mt20">
      <div class="boardlist file-table">
        <b-table
          sticky-header
          responsive
          id="file-table"
          :class="props.readOnly ? 'unlocked' : 'locked'"
          :fields="fields"
          :items="uploadedFiles"
        >
          <!-- originalFileName -->
          <template #cell(originalFileName)="row">
            <a href="#" @click="e => onClickDownLoad(e, row.item.originalFileName)">{{ row.item.originalFileName }}</a>
          </template>
          <template #cell(delete)="row">
            <b-button @click="onClickDelete(row.item)">Delete</b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .files_area .hidden {
    display: none;
  }
  .files_area .shown {
    display: block;
  }
  #file-table.unlocked {
    max-height: none;
  }
  #file-table.locked {
    max-height: 200px;
  }
</style>
