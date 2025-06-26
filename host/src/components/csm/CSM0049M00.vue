<script setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common';
  import { useCSM0049M00 } from '@/store/csm/CSM0049M00.js';
  import {
    formatBytes,
    getSessionInfo,
    diffDatesLoan,
    procDownload,
    isEmpty,
    dateToDDMMMYYYY,
  } from '@/common/util/helpers';
  import { setCodes, getCodes, getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import
  import dayjs from 'dayjs';
  // const { popup, showToast, attachFiles, uploadFiles, fetchFilesInfo } = commonStore;

  const route = useRoute();
  const { path } = route;
  const sessionInfo = getSessionInfo();
  const today = dayjs(new Date()).format('DDMMYYYY');
  // const menuTitle = path.substring(path.lastIndexOf('/') + 1);
  // store 선언
  const commonStore = useCommonStore();
  const storeCSM0049M00 = useCSM0049M00();
  const { popup, uploadFiles } = commonStore;
  const { fetchListIssue, fetchExecution } = storeCSM0049M00;
  const { issueListData } = storeToRefs(storeCSM0049M00);
  const idnfiNoValue = path.substring(path.lastIndexOf('/') + 1);

  const tableTitle = ref();

  // 테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'regiDate', label: 'Registered Date', class: 'text-center', readonly: true },
    //{ key: 'assignTeam', label: 'System(Team)' },
    //{ key: 'issueStatus', label: 'Status' },
    { key: 'title', label: 'Title', readonly: true },
    { key: 'errorContent', label: 'Contents', readonly: true },
    { key: 'respContent', label: 'Response Content', readonly: true },
    //{ key: 'issueAssignee', label: 'Assignee' },
    { key: 'issueReporter', label: 'Reporter', class: 'text-center' },
    { key: 'brncoBrnCd', label: 'Branch Code', class: 'text-center' },
    //{ key: 'issueId', label: 'Issue ID' },
  ]);

  const bzwkCode = getCodesFromStorage({
    key: 'bzwkInstncIdnfr',
    value: 'CSM000004',
    key: 'cmpsCdValCtnt',
    value: 'CSM0049M00',
    key: 'bzwkIncd',
    value: '0001',
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
  //const bzwkList = reactive([
  //{ value: 'LNE', name: 'Loan Support' },
  //{ value: 'COL', name: 'Collection' },
  //{ value: 'CSM', name: 'System Common' },
  //]);
  const tranType = ref('1');
  const changeTranType = param => {
    tranType.value = param;
  };

  const isDisabled = (row, isdis) => {
    let isDisStr = String(isdis);
    let a = isDisStr.split(',');
    if (a.length >= 2) {
      if (row.item[a[0]] === a[1]) {
        return true;
      } else {
        return false;
      }
    }

    return isdis;
  };

  // 현재 페이지
  const page = ref(1);
  // input form
  const inqParam = reactive({
    // const inqParam = computed(() => ({
    regiDate: today,
    assignTeam: '',
    issueStatus: '',
    title: '',
    errorContent: '',
    respContent: '',
    issueAssignee: '',
    issueReporter: '',
    affcMgtPrcssTagetDstcd: '',
    inquryDstcd: '',
    brncoBrnCd: sessionInfo.brnCode,
    mgtBrncdName: sessionInfo.brnName,
  });

  // 조회 파라미터
  const insParam = computed(() => ({
    // const insParam = reactive({
    title: inqParam.title,
    assignTeam: inqParam.assignTeam,
    regiDate: inqParam.regiDate,
    brncoBrnCd: inqParam.brncoBrnCd,
    mgtBrncdName: inqParam.mgtBrncdName,
    affcMgtPrcssTagetDstcd: inqParam.affcMgtPrcssTagetDstcd,
    inquryDstcd: inqParam.inquryDstcd,
    inquryIsuitm: '',
    aplyEndYmd: '',
    errorContent: inqParam.errorContent,
    respContent: inqParam.respContent,
    issueAssignee: inqParam.issueAssignee,
    issueReporter: inqParam.issueReporter,
    regYms: '',
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
      }
    },
    { deep: true },
  );
  // 페이지 번호 변경 시 재조회
  watch(
    () => page.value,
    (newValue, oldValue) => {
      if (parseInt(newValue) !== parseInt(oldValue)) {
        fetchListIssue(insParam.value);
      }
    },
    { deep: true },
  );

  watch(
    () => tranType.value,
    () => {
      console.log('tranType===>>  ', tranType);
      if (tranType.value === '1') {
        (insData.regiDate = ''),
          (insData.assignTeam = ''),
          (insData.issueStatus = ''),
          (insData.title = ''),
          //(insData.brncoBrnCd = ''),
          //(insData.regEmpId = ''),
          (insData.errorContent = ''),
          (insData.respContent = ''),
          (insData.issueAssignee = ''),
          (insData.issueReporter = ''),
          (insData.brncoBrnCd = ''),
          (insData.issueId = ''),
          //(insData.lowrkBrnNotiYn = ''),
          (insData.aplyEndYmd = ''),
          (insData.lastJobUUID = ''),
          // insData.fileBzwkDstic = '';
          (insData.fileId = []);
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

    page.value == 1 ? fetchListIssue(insParam.value) : (page.value = 1);
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
      console.log('insData==>>  ', insData, ' : : ', uploadedFiles.value);

      insData.fileId = [];
      insData.fileInfo = [];
      uploadedFiles.value.forEach(t => {
        insData.fileId.push(t.fileId);
        insData.fileInfo.push(t);
        console.log('after delete uploaded file t: ', t.fileId);
      });

      issueListData.value.fileList = issueListData.value.fileList.filter(fi => deleted.fileId !== fi.fileId);
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
      console.log('rowVal.issueId===>>  ', rowVal.issueId);
      uploadedFiles.value.forEach(t => {
        console.log('uploaded file t: ', t.fileId);
        insData.fileId.push(t.fileId);
        if (rowVal.issueId) t.idnfiNo = rowVal.issueId; //insert seq id
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
      issueListData.value.fileList,
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
    const files = issueListData.value.fileList.filter(item => item.idnfiNo == row.issueId);

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
  /// ----------------------------수정
  const issueStatusList = reactive([
    { value: '0', name: 'Register' },
    { value: '1', name: 'In Progress' },
    { value: '2', name: 'Complete' },
  ]);
  const assignTeamList = reactive([
    { value: '0', name: 'Flexcube' },
    { value: '1', name: 'Loan Support System' },
    { value: '2', name: 'AML' },
    { value: '3', name: 'Card' },
    { value: '4', name: 'Collection' },
    { value: '5', name: 'Data WareHouse' },
    { value: '6', name: 'MIS' },
    { value: '7', name: 'Internal Control' },
    { value: '8', name: 'Digital Mobile Banking' },
    { value: '9', name: 'Merchant App' },
    { value: '10', name: 'Corporate Internet Banking' },
    { value: '11', name: 'WSO' },
    { value: '12', name: 'Interface' },
    { value: '13', name: 'ISO' },
    { value: '14', name: 'Data Migration' },
  ]);
  // 상세 데이터------------------------------수정

  const insData = reactive({
    title: '',
    regiDate: '',
    assignTeam: (assignTeamList.value = '0'),
    issueId: '',
    brncoBrnCd: sessionInfo.brnCode,
    regEmpId: sessionInfo.uno,
    regYms: '',
    errorContent: '',
    respContent: '',
    chgEmpId: '',
    chgYms: '',
    fixYn: '',
    //lowrkBrnNotiYn: '',
    aplyEndYmd: '',
    lastJobUUID: '',
    issueStatus: (issueStatusList.value = '0'),
    issueAssignee: 'admin1',
    issueReporter: '',
    fileId: [],
    fileBzwkDstic: bzwkCode.bzwkIncd ? bzwkCode.bzwkIncd : '0009', // 업무에 맞는값으로 세팅
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
    const { title, fileId, errorContent, issueReporter } = insData;

    if (title === '') errorMessage.value = 'Please enter a title.';
    //if (issueReporter.length > 200) errorMessage.value = 'Please enter Contents.';
    if (errorContent === '') errorMessage.value = 'Please enter Contents.';

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

  /// 거래 실행
  const execBtn = async () => {
    const exeUris = ['insertDefects', 'updateDefects', 'deleteDefects'];
    const uri = exeUris[parseInt(tranType.value) - 1];
    console.log(' execBtn 349 uri: ', uri);
    const validate = validateExe();

    if (validate) {
      console.log(' execBtn 314 insData: ', JSON.stringify(insData), ' : ', sessionInfo);

      //if (tranType.value == '3') {
      //insData.delYn = '1';
      //insData.delEmpId = sessionInfo.uno;
      //} else {
      //insData.delYn = '0';
      //}

      const result = await fetchExecution(uri, JSON.stringify(insData));
      const options = reactive({});
      // 성공
      if (result) {
        console.log('uploadedFiles====>>   ', uploadedFiles.value);
        Object.assign(options, {
          title: 'Success',
          contents: `${
            tranType.value === '1' ? 'Registration' : tranType.value === '2' ? 'Modification' : 'Deletion'
          } was successful.`,
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

  // Branch Code
  onMounted(() => {
    inqParam.affcMgtPrcssTagetDstcd = '1';
    inqParam.inquryDstcd = '1';
    inqParam.brncoBrnCd = sessionInfo.brnCode;
    inqParam.mgtBrncdName = sessionInfo.brnName;

    page.value = 1;
    // fetchList();
  });
  onUnmounted(() => {
    console.log('components unmounted', inqParam);
  });

  // branch code search pop up
  const onClickPopupCSM0031P01 = () => {
    const options = {
      title: 'Search Branch',
      component: 'CSM0031P01',
      width: 1100,
      height: 700,
      datas: {
        brncd: inqParam.brncoBrnCd,
      },
      callback: popupCSM0031P01Callback,
    };
    usePopup(options);
  };

  const popupCSM0031P01Callback = param => {
    if (!param) return;

    let recvObj = param;
    if (recvObj.brncd) inqParam.brncoBrnCd = recvObj.brncd;
    if (recvObj.brnName) inqParam.mgtBrncdName = recvObj.brnName;
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
            <th>Registered Date</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model="inqParam.regiDate" />
              </div>
            </td>
            <!--<th>System(Team)</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.assignTeam"
                :options="assignTeamList"
                text-field="name"
                style="width: 100%"
              >
              </b-form-select>
            </td>
            <th>Status</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                value-field="value"
                v-model="inqParam.issueStatus"
                :options="issueStatusList"
                text-field="name"
                style="width: 100%"
              >
              </b-form-select>
            </td>
          </tr>-->
            <th>Branch Code</th>
            <td>
              <div class="form_box">
                <b-form-input
                  placeholder=""
                  v-model="inqParam.brncoBrnCd"
                  style="width: 130px"
                  maxlength="3"
                ></b-form-input>
                <b-button class="ico ico_search" @click="onClickPopupCSM0031P01()">search</b-button>
                <b-form-input input type="text" v-model="inqParam.mgtBrncdName" style="width: 100%" disabled />
              </div>
            </td>
            <th>Reporter</th>
            <td>
              <b-form-input class="khmer" type="text" v-model="inqParam.issueReporter" />
            </td>
            <!--<th>Assignee</th>
            <td>
              <b-form-input type="text" v-model="inqParam.issueAssignee" />
            </td>-->
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
    <ul class="title_area sub">
      <li><h2>Inquiry Result</h2></li>
    </ul>
    <!-- vue script 작성 후 수정 -->
    <ul class="boardlist_top">
      <li class="form_box">
        <p class="text">
          Total <span>{{ !issueListData.totalCnt ? 0 : issueListData.totalCnt }}</span>
        </p>
        <span class="text">show</span>
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
      <li class="form_box">
        <b-excel-util
          mode="export"
          :targetTable="tableTitle"
          name="BulletinBoardList"
          button-name="Download"
          :isDisabled="issueListData.totalCnt > 0 ? false : true"
        />
      </li>
    </ul>

    <div ref="tableTitle" class="boardlist over">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="issueListData.issueList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <!--<template #cell(errorContent)="row">
          <b-form-select
            v-model="row.item.assignTeam"
            v-select-mix
            :options="assignTeamList"
            value-field="value"
            text-field="name"
            readonly
          />
        </template>
        <template #cell(issueStatus)="row">
          <b-form-select
            v-model="row.item.issueStatus"
            v-select-mix
            :options="issueStatusList"
            value-field="value"
            text-field="name"
            readonly
          />
        </template>-->

        <template #cell(regiDate)="row"
          ><b-date-picker v-model="row.item.regiDate" readonly />
          <div style="width: 80px"></div>
          <span class="print-area">{{ !isEmpty(row.item.regiDate) ? dateToDDMMMYYYY(row.item.regiDate) : '' }}</span>
        </template>
        <template #cell(title)="row"
          ><b-form-input v-model="row.item.title" readonly />
          <span class="print-area" style="width: 250px">{{ row.item.title }}</span>
        </template>
        <template #cell(errorContent)="row"
          ><b-form-input v-model="row.item.errorContent" readonly />
          <span class="print-area" style="width: 350px">{{ row.item.errorContent }}</span>
        </template>
        <template #cell(respContent)="row"
          ><b-form-input v-model="row.item.respContent" readonly />
          <span class="print-area" style="width: 350px">{{ row.item.respContent }}</span>
        </template>
        <template #cell(NO)="row"
          ><div class="text-center">{{ row.index + 1 + (page - 1) * displayCnt }}</div></template
        >
      </b-table>
    </div>

    <b-pagination
      v-model="page"
      :total-rows="issueListData.totalCnt"
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
              <!--<th class="req">System(Team)</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.assignTeam"
                  :options="assignTeamList"
                  value-field="value"
                  text-field="name"
                  class="req"
                  style="width: 100%"
                >
                </b-form-select>
              </td>
              <th :class="{ req: tranType == 2 }">Status</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.issueStatus"
                  :options="issueStatusList"
                  :disabled="tranType === '1'"
                  :class="{ req: tranType == 2 }"
                  value-field="value"
                  text-field="name"
                  style="width: 100%"
                >
                </b-form-select>
              </td>-->
              <th class="req">Reporter</th>
              <!--max length-->
              <td>
                <b-form-input v-model="insData.issueReporter" class="req khmer" maxlength="200" />
              </td>
              <!--<th :class="{ req: tranType == 2 }">Assignee</th>
              <td>
                <b-form-input v-model="insData.issueAssignee" :class="{ req: tranType == 2 }" maxlength="300" />
              </td>-->

              <th class="req">Title</th>
              <td colspan="5">
                <b-form-input v-model="insData.title" class="req khmer" maxlength="300" />
              </td>
            </tr>
            <tr>
              <th class="req">Contents</th>
              <td colspan="7">
                <textarea
                  style="width: 100%; height: 200px"
                  v-model="insData.errorContent"
                  class="req khmer"
                  maxlength="4000"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>Response Content</th>
              <td colspan="7">
                <textarea
                  style="width: 100%; height: 200px"
                  v-model="insData.respContent"
                  :disabled="tranType === '1'"
                  class="khmer"
                  maxlength="4000"
                ></textarea>
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
