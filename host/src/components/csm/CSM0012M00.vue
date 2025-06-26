<script setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common';
  import { useCSM0012M00 } from '@/store/csm/CSM0012M00.js';
  import { formatBytes, getSessionInfo, diffDatesLoan, procDownload } from '@/common/util/helpers';
  import { setCodes, getCodes, getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import
  // const { popup, showToast, attachFiles, uploadFiles, fetchFilesInfo } = commonStore;

  const route = useRoute();
  const { path } = route;
  const sessionInfo = getSessionInfo();
  // const menuTitle = path.substring(path.lastIndexOf('/') + 1);
  // store 선언
  const commonStore = useCommonStore();
  const storeCSM0012M00 = useCSM0012M00();
  const { popup, uploadFiles } = commonStore;
  const { fetchListNotice, fetchExecution } = storeCSM0012M00;
  const { notiListData } = storeToRefs(storeCSM0012M00);
  const idnfiNoValue = path.substring(path.lastIndexOf('/') + 1);
  // 테이블 필드명
  const fields = reactive([
    'NO',
    // { key: 'notiId', label: 'Notice ID' },
    { key: 'title', label: 'Title' },
    { key: 'notiStartYmd', label: 'Start Date' },
    { key: 'notiEndYmd', label: 'End Date' },
    { key: 'notiYn', label: 'Notified' },
    { key: 'sysNotiYn', label: 'System Notified' },
    // { key: 'fixYn', label: 'Fixed' },
    // { key: 'lowrkBrnNotiYn', label: 'Sub Branch Exposure' },
    // { key: 'delYn', label: 'Deleted' },
    // { key: 'delEmpId', label: 'Delete Staff ID' },
    { key: 'brncoBrnCd', label: 'Branch Code' },
    { key: 'sysLastPrcssYms', label: 'Last Modification Date' },
    { key: 'sysLastUno', label: 'Last Modifier Staff ID' },
  ]);

  const bzwkCode = getCodesFromStorage({
    key: 'bzwkInstncIdnfr',
    value: 'CSM000004',
    key: 'cmpsCdValCtnt',
    value: 'CSM0012M00',
  })[0];

  const fileFields = reactive([
    {
      key: 'originalFileName',
      label: 'File Name',
      thStyle: { width: '45%' },
      class: 'text-center',
    },
    {
      key: 'fileDesc',
      label: 'File DESC',
      thStyle: { width: '25%' },
      class: 'text-center',
    },
    {
      key: 'fileSize',
      label: 'File Size',
      thStyle: { width: '20%' },
      class: 'text-center',
      formatter: value => {
        return formatBytes(value);
      },
    },
    // {
    //   key: 'delete',
    //   label: 'Delete',
    //   thStyle: { width: '10%' },
    //   class: 'text-center',
    // },
  ]);
  const selectedRow = ref([]);
  // 테이블 row 수
  const displayCnt = ref(10);
  const pageCntList = reactive([
    { name: '2', value: '2' },
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);
  const bzwkList = reactive([
    { value: 'LNE', name: 'Loan Support' },
    { value: 'COL', name: 'Collection' },
    { value: 'CSM', name: 'System Common' },
  ]);
  const tranType = ref('1');
  const changeTranType = param => {
    tranType.value = param;
  };
  // 현재 페이지
  const page = ref(1);
  // input form
  const inqParam = reactive({
    // const inqParam = computed(() => ({
    notiId: '',
    title: '',
    notiStartYmd: '',
    notiEndYmd: '',
    notiYn: '',
    //brncoBrnCd: '', //sessionInfo.brnCode,
    aplyEndYmd: '',
    delYn: '',
    sysNotiYn: '',
  });
  // 조회 파라미터
  const insParam = computed(() => ({
    // const insParam = reactive({
    title: inqParam.title,
    notiStartYmd: inqParam.notiStartYmd,
    notiEndYmd: inqParam.notiEndYmd,
    //brncoBrnCd: inqParam.brncoBrnCd,
    inquryNoitm: '',
    aplyEndYmd: '',
    sysNotiYn: inqParam.sysNotiYn,
    notiYn: inqParam.notiYn,
    delYn: inqParam.delYn,
    regYms: '',
    content: '',
    displayCnt: displayCnt.value,
    dmndCnt: page.value,
    fileBzwkDstic: bzwkCode.bzwkIncd,
  }));
  // 테이블 row 수 변경 시 재조회
  watch(
    () => displayCnt.value,
    (newValue, oldValue) => {
      if (parseInt(newValue) !== parseInt(oldValue)) {
        pageSearch();
        // page.value = 1;
        // fetchListNotice(insParam.value);
      }
    },
    { deep: true },
  );
  // 페이지 번호 변경 시 재조회
  watch(
    () => page.value,
    (newValue, oldValue) => {
      if (parseInt(newValue) !== parseInt(oldValue)) {
        fetchListNotice(insParam.value);
      }
    },
    { deep: true },
  );
  watch(
    () => tranType.value,
    () => {
      console.log('tranType===>>  ', tranType);
      if (tranType.value === '1') {
        (insData.title = ''),
          (insData.notiStartYmd = ''),
          (insData.notiEndYmd = ''),
          (insData.notiId = ''),
          //(insData.brncoBrnCd = ''),
          //(insData.regEmpId = ''),
          (insData.regYms = ''),
          (insData.notiYn = ''),
          (insData.sysNotiYn = ''),
          (insData.chgEmpId = ''),
          (insData.chgYms = ''),
          (insData.fixYn = ''),
          (insData.lowrkBrnNotiYn = ''),
          (insData.delEmpId = ''),
          (insData.aplyEndYmd = ''),
          (insData.delYn = ''),
          (insData.lastJobUUID = ''),
          (insData.content = '');
        // insData.fileBzwkDstic = '';
        insData.fileId = [];
        insData.fileInfo = [];
        insData.fileDesc = [];
        uploadedFiles.value = [];
      }
    },
    { deep: true },
  );
  // 테이블 조회
  const pageSearch = () => {
    console.log('insParam.value===>>   ', insParam.value, bzwkCode);
    const diffDays = diffDatesLoan(inqParam.notiStartYmd, inqParam.notiEndYmd);
    if (diffDays < 0) {
      useAlert({ title: 'Error', contents: 'Check StartDate!', callback: clearMessage });
      return;
    }

    page.value == 1 ? fetchListNotice(insParam.value) : (page.value = 1);
    // page.value = 1;
    // fetchListNotice(insParam.value);
  };

  // 파일 레이어 팝업에서 삭제 이벤트 전달
  useEmitListen('file', deleted => {
    if (deleted) {
      console.log('파일 삭제 후속 작업 >>>> ', deleted.fileId, ' : : ', deleted, ' : : ', insData);
      //     fileId: [],
      // fileGroup: 'CSM', //공지사항은 csm다른 파일업로드는 업무에 맞는값으로 세팅
      // fileInfo: [],
      // insData.fileId =      insData.fileId.length > 0 ? insData.fileId : insData.fileId.filter(fi => deleted.fileId !== fi.fileId);
      uploadedFiles.value = uploadedFiles.value.filter(fi => deleted.fileId !== fi.fileId);
      console.log('indData==>>  ', insData, ' : : ', uploadedFiles.value);

      insData.fileId = [];
      insData.fileInfo = [];
      uploadedFiles.value.forEach(t => {
        insData.fileId.push(t.fileId);
        insData.fileInfo.push(t);
        console.log('after delete uploaded file t: ', t.fileId);
      });

      notiListData.value.fileList = notiListData.value.fileList.filter(fi => deleted.fileId !== fi.fileId);
    }
  });

  const popupCallback = param => {
    // 닫기 버튼
    if (typeof param === 'string') {
      console.log('popupCallback closed');
    }
    // 업로드 완료
    if (typeof param === 'object') {
      const files = param.map(item => {
        return { ...item, originalFileName: item.originalFileName };
      });

      console.log('param 197===>>  ', param);
      uploadedFiles.value = [...uploadedFiles.value, ...files];
      insData.fileId = [];
      insData.fileInfo = [];
      let rowVal = selectedRow.value;
      console.log('rowVal.notiId===>>  ', rowVal.notiId);
      uploadedFiles.value.forEach(t => {
        console.log('uploaded file t: ', t.fileId);
        insData.fileId.push(t.fileId);
        if (rowVal.notiId) t.idnfiNo = rowVal.notiId; //insert seq id
        insData.fileInfo.push(t);
      });
    }
    // insData.fileId = param.values('fileID'); //param.filter(item => item.fileID);
    // recvFilesFromChild(param);
  };
  const fileUploadModal = () => {
    console.log('uploadedFile?? ', uploadedFiles.value);
    const options = {
      title: 'File upload',
      width: 800,
      height: 500,
      component: 'CSM0017P01',
      datas: { idnfiNo: idnfiNoValue, uploaded: uploadedFiles.value },
      keepAlive: false,
      callback: popupCallback,
    };
    usePopup(options);
  };

  const uploadedFiles = ref([]);

  // 테이블 클릭
  const gridClick = row => {
    console.log(
      'before insData===>>>  ',
      insData,
      ' : : ',
      row,
      ' : ',
      notiListData.value.fileList,
      ' ?? ',
      // row.regYms && row.regYms.length > 8,
      !row.brnCode,
      row.brnCode,
    );
    row.regYms = row.regYms && row.regYms.length > 8 ? row.regYms.substring(0, 8) : row.regYms;
    if (!row.brncoBrnCd) row.brncoBrnCd = sessionInfo.brnCode;
    if (!row.regEmpId) row.regEmpId = sessionInfo.uno;
    Object.assign(insData, row);

    // selectedRow.value.push(row);
    selectedRow.value = row;
    const files = notiListData.value.fileList.filter(item => item.idnfiNo == row.notiId);

    console.log('after insData===>>>  ', insData, ' : ', row, ' : : ', files);
    uploadedFiles.value = files;
    // tags.value = [];
    // files.forEach(item => {
    //   tags.value.push(item.originalFileName);
    // });
    uploadedFiles.value.forEach(t => {
      console.log('uploaded file t: ', t.fileId);
      insData.fileId.push(t.fileId);
      insData.fileInfo.push(t);
    });

    tranType.value = '2';
  };
  const useYns = reactive([
    { value: '1', name: 'Y' },
    { value: '0', name: 'N' },
  ]);
  const systemNotiList = reactive([
    { value: '1', name: 'IT' },
    { value: '0', name: 'Biz' },
  ]);
  // 상세 데이터
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
  console.log('insData===???   ', insData);

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    const { title, notiStartYmd, notiEndYmd, notiYn, content, fileId, sysNotiYn } = insData;
    const diffDays = diffDatesLoan(notiStartYmd, notiEndYmd);

    if (title === '') errorMessage.value = 'Please enter a title.';
    if (notiStartYmd === '') errorMessage.value = 'Please enter a Start Date.';
    if (notiEndYmd === '') errorMessage.value = 'Please enter a  End Date.';
    if (sysNotiYn === '') errorMessage.value = 'Please enter a System Notified.';
    if (content === '') errorMessage.value = 'Please enter a content.';

    if (diffDays < 0) errorMessage.value = 'Check StartDate';
    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 구분
  const tranTypeList = reactive([
    { name: 'Register', value: '1' },
    { name: 'Modify', value: '2' },
    { name: 'Delete', value: '3' },
  ]);

  // 거래 실행
  const execBtn = async () => {
    const exeUris = ['insertNotice', 'updateNotice', 'updateNotice'];
    const uri = exeUris[parseInt(tranType.value) - 1];
    console.log(' execBtn 349 uri: ', uri);
    const validate = validateExe();

    if (validate) {
      console.log(' execBtn 314 insData: ', JSON.stringify(insData), ' : ', sessionInfo);
      if (tranType.value == '3') {
        insData.delYn = '1';
        insData.delEmpId = sessionInfo.uno;
      } else {
        insData.delYn = '0';
      }

      const result = await fetchExecution(uri, JSON.stringify(insData));
      const options = reactive({});
      // 성공
      if (result) {
        console.log('uploadedFiles====>>   ', uploadedFiles.value);
        Object.assign(options, {
          title: 'Success',
          contents: `${tranType.value === '1' ? 'Registration' : tranType.value === '2' ? 'Modification' : 'deletion'} was successful.`,
          callback: pageSearch,
        });
        tranType.value = '1';
        useAlert(options);
      }
    }
  };
  const fileDown = async () => {
    try {
      const result = await useDefaultFetch(
        '/csm/downloadFile?filePath=tmp/26052023/&fileName=KBPBLOANKBPBONweblogic26052023132358000001001_15315573&originalFileName=EXAMPLE_EXCEL7.xlsx',
        {
          method: 'get',
        },
      );

      if (result) {
        const { data, fileName } = result;
        console.log('result==> ', result);
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
    } catch (e) {
      console.warn(e);
    }
  };

  const downloadComplete = () => {
    console.log('downloadComplete');
  };

  const onClickDownLoad = (e, name) => {
    e.preventDefault();

    const filterFile = uploadedFiles.value.filter(file => file.originalFileName === name);

    if (filterFile) {
      const tgtFile = toRaw(filterFile[0]);
      const { filePath, fileName, originalFileName, fileExtension } = tgtFile;

      /*
        @params
        
        url,
        param { filePath, fileName, originalFileName, fileExtension }, 
        callback
      */
      procDownload('/csm/downloadFile', { filePath, fileName, originalFileName, fileExtension }, downloadComplete);
    }
  };
</script>

<template>
  <!-- searchArea -->
  <div class="search_area">
    <fieldset>
      <legend></legend>
      <table>
        <caption>
          Search requirement
        </caption>
        <tbody>
          <tr>
            <th>Title</th>
            <td>
              <b-form-input type="text" v-model="inqParam.title" />
            </td>
            <th>Notified Date</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model="inqParam.notiStartYmd" />
                <!-- <span class="text">~</span>
                <b-date-picker v-model="inqParam.notiEndYmd" :minDate="inqParam.notiStartYmd"/> -->
              </div>
            </td>
            <th>Notification type</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.sysNotiYn"
                :options="systemNotiList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th>Notified?(Y/N)</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.notiYn"
                :options="useYns"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <!-- <th>Deleted?(Y/N)</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.delYn"
                :options="useYns"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td> -->
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area">
      <button type="button" class="btn btn_primary" @click="pageSearch()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea -->

  <div class="con_area">
    <ul class="boardlist_top">
      <li class="form_box">
        <p class="text">
          Total <span>{{ !notiListData.totalCnt ? 0 : notiListData.totalCnt }}</span>
        </p>
        <span class="text">show</span>
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
    </ul>
    <div class="boardlist over">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="notiListData.notiList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(notiStartYmd)="row">
          <b-date-picker v-model="row.item.notiStartYmd" dateFormat="ddMMyyyy" readonly="true" />
        </template>
        <template #cell(notiEndYmd)="row">
          <b-date-picker v-model="row.item.notiEndYmd" dateFormat="ddMMyyyy" readonly />
        </template>
        <template #cell(sysLastPrcssYms)="row">
          <b-date-picker v-model="row.item.sysLastPrcssYms" dateFormat="ddMMyyyy" readonly />
        </template>
        <template #cell(sysNotiYn)="row">
          <b-form-select
            v-model="row.item.sysNotiYn"
            v-select-mix
            :options="systemNotiList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(lowrkBrnNotiYn)="row">
          <b-form-select
            v-model="row.item.lowrkBrnNotiYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(fixYn)="row">
          <b-form-select
            v-model="row.item.fixYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(notiYn)="row">
          <b-form-select
            v-model="row.item.notiYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(delYn)="row">
          <b-form-select
            v-model="row.item.delYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
      </b-table>
    </div>
    <b-pagination
      v-model="page"
      :total-rows="notiListData.totalCnt"
      :per-page="parseInt(displayCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>

    <!-- 실행 -->
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <!-- end 실행 -->

    <div class="boxarea">
      <ul class="title_area sub">
        <li>
          <h2>Detail Contents</h2>
        </li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
        <table>
          <colgroup>
            <col width="170px" />
            <col />
            <col width="170px" />
            <col />
            <col width="170px" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th class="req">Notified?(Y/N)</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.notiYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
              <th class="req">Period Of Notified</th>
              <td colspan="3">
                <div class="form_box">
                  <b-date-picker v-model:modelValue="insData.notiStartYmd" class="dp_req" />
                  <span class="text">~</span>
                  <b-date-picker
                    v-model:modelValue="insData.notiEndYmd"
                    class="dp_req"
                    :minDate="insData.notiStartYmd"
                  />
                </div>
              </td>
              <th class="req">Notification type</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.sysNotiYn"
                  :options="systemNotiList"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr></tr>
            <tr>
              <th class="req">Title</th>
              <td colspan="7"><b-form-input v-model="insData.title" class="req" maxlength="300" /></td>
            </tr>
            <tr>
              <th class="req">Content</th>
              <td colspan="7">
                <textarea style="width: 100%; height: 200px" v-model="insData.content" class="req"></textarea>
              </td>
            </tr>
            <tr>
              <th>Attached File</th>
              <td colspan="7">
                <div class="filebox">
                  <b-button @click="fileUploadModal">fileUpload</b-button>
                </div>
              </td>
            </tr>
            <tr>
              <th>Uploaded File</th>
              <td colspan="7">
                <div class="filebox">
                  <div class="boardlist file-table">
                    <b-table
                      striped
                      hover
                      selectable
                      sticky-header
                      responsive
                      id="my-table"
                      :fields="fileFields"
                      :items="uploadedFiles"
                    >
                      <template #cell(originalFileName)="row">
                        <a href="#" @click="e => onClickDownLoad(e, row.item.originalFileName)">{{
                          row.item.originalFileName
                        }}</a>
                      </template>
                      <template #cell(fileDesc)="row">
                        <b-form-input v-model="row.item.fileDesc" placeholder="Enter file Description"></b-form-input>
                        <span style="visibility: hidden">{{ row.item.fileDesc }}</span>
                      </template>
                    </b-table>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
