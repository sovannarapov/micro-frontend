<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';

  // input form
  const searchParam = computed(() => ({
    btchJobId: inqParam.btchJobId,
    btchJobName: inqParam.btchJobName,
    useYn: inqParam.useYn,
    displayCnt: displayCnt.value,
    dmndCnt: page.value,
  }));

  const inqParam = reactive({
    btchJobId: '',
    btchJobName: '',
    useYn: '',
  });
  // 조회 파라미터
  const insParam = reactive({
    bzwkDstcd: '',
    bzwkDtailDstcd: '',
    btchJobId: '',
    btchJobName: '',
    btchJobCtnt: '',
    btchPgmClssName: '',
    inputFileName: '',
    outputFileName: '',
    useYn: '',
  });

  //테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'btchJobId', label: 'Batch Job ID', class: 'text-left' },
    { key: 'btchJobName', label: 'Batch Job Name', class: 'text-left' },
    { key: 'btchJobCtnt', label: 'Batch Job Content' },
    { key: 'btchPgmClssName', label: 'Batch Program Class Name' },
    { key: 'inputFileName', label: 'Input File Name' },
    { key: 'outputFileName', label: 'Output File Name' },
    { key: 'useYn', label: 'Use Yn' },
  ]);
  // 테이블 row 수
  const displayCnt = ref(10);
  const pageCntList = reactive([
    { name: '2', value: '2' },
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);
  // 현재 페이지
  const page = ref(1);
  //테이블 row 수 변경 시 재조회
  watch(
    () => displayCnt.value,
    (newValue, oldValue) => {
      if (parseInt(newValue) !== parseInt(oldValue)) {
        page.value = 1;
        fetchList();
      }
    },
    { deep: true },
  );
  //페이지 번호 변경 시 재조회
  watch(
    () => page.value,
    (newValue, oldValue) => {
      console.log('page - watch');
      if (parseInt(newValue) !== parseInt(oldValue)) {
        fetchList();
      }
    },
    { deep: true },
  );

  // 테이블 조회
  const pageSearch = () => {
    page.value == 1 ? fetchList() : (page.value = 1);
  };

  const fetchList = () => {
    apiCommon.callApi(`/csm/selectListBtchPgmMgt`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.btchPgmList = returnObject.resultData.btchPgmList;
  };

  const resultData = reactive({
    totalCnt: 0,
    btchPgmList: [],
  });

  //테이블 클릭
  const gridClick = row => {
    Object.assign(row, { bzwkDstcd: row.btchJobId.substring(0, 3) });
    Object.assign(row, { bzwkDtailDstcd: row.btchJobId.substring(0, 3) + '-' + row.btchJobId.substring(3, 4) });
    Object.assign(insParam, row);
    tranType.value = '2';
  };

  const bzwkList = getComCodes('CSM000001');
  const bzwkDtailList = getComCodes('CSM000002');
  const useYns = getComCodes('CSM000007');

  const insBzwkDtailList = computed(() => {
    let list = [];
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === insParam.bzwkDstcd);
    return list;
  });

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    if (insParam.bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
    if (insParam.bzwkDtailDstcd === '') errorMessage.value = 'Please enter the Business Detail Distinction Code.';
    if (insParam.btchJobName === '') errorMessage.value = 'Please enter the Batch Job Name.';
    if (insParam.btchJobCtnt === '') errorMessage.value = 'Please enter the Batch Job Content.';
    if (insParam.btchPgmClssName === '') errorMessage.value = 'Please enter the Batch Program Class Name.';
    if (insParam.useYn === '') errorMessage.value = 'Please enter the Use Yn';

    if ((tranType.value == '2' || tranType.value == '3') && insParam.btchJobId === '')
      errorMessage.value = 'The Batch Job ID is empty!!';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 구분
  const tranType = ref('1');
  const tranTypeList = reactive([
    { value: '1', name: 'Register' },
    { value: '2', name: 'Modify' },
    { value: '3', name: 'Delete' },
  ]);
  const changeTranType = param => {
    if (param === '1' && insParam.btchJobId != '') {
      insParam.btchJobId = '';
    }
    tranType.value = param;
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertBtchPgmMgt', 'updateBtchPgmMgt', 'deleteBtchPgmMgt'];
    const uri = exeUris[parseInt(tranType.value) - 1];
    const validate = validateExe();
    if (validate) {
      apiCommon.callApi('/csm/' + uri, 'post', insParam, execBtnCallback);
    }
  };

  const execBtnCallback = returnObject => {
    if (returnObject.resultCd === '0000') {
      const options = {
        title: 'Success',
        contents: `${tranType.value === '1' ? 'Registration' : 'Modification'} was successful.`,
        callback: pageSearch,
      };
      useAlert(options);
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
            <th>Batch Job ID</th>
            <td>
              <b-form-input input type="text" v-model="inqParam.btchJobId" />
            </td>
            <th>Batch Job Name</th>
            <td>
              <b-form-input input type="text" v-model="inqParam.btchJobName" />
            </td>
            <th>Use Yn</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.useYn"
                :options="useYns"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
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
          Total <span>{{ !resultData.totalCnt ? 0 : resultData.totalCnt }}</span>
        </p>
        <span class="text">show</span>
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
    </ul>
    <div class="boardlist">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="resultData.btchPgmList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(NO)="row">
          {{ row.index + 1 + (page - 1) * displayCnt }}
        </template>
        <template #cell(useYn)="row">
          <b-form-select
            v-model="row.item.useYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
      </b-table>
    </div>
    <b-pagination
      v-model="page"
      :total-rows="resultData.totalCnt"
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
        <li><h2>Detail Contents</h2></li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
        <table>
          <tbody>
            <tr>
              <th class="req">Batch Job ID</th>
              <td><b-form-input type="text" v-model="insParam.btchJobId" disabled class="req" /></td>
              <th class="req">Business Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDstcd"
                  :options="bzwkList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
              <th class="req">Business Detail Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDtailDstcd"
                  :options="insBzwkDtailList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
            </tr>
            <tr>
              <th class="req">Batch Job Name</th>
              <td><b-form-input type="text" v-model="insParam.btchJobName" class="req" /></td>
              <th class="req">Batch Job Content</th>
              <td colspan="3"><b-form-input type="text" v-model="insParam.btchJobCtnt" class="req" /></td>
            </tr>
            <tr>
              <th class="req">Batch Program Class Name</th>
              <td><b-form-input type="text" v-model="insParam.btchPgmClssName" class="req" /></td>
              <th>Input File Name</th>
              <td><b-form-input type="text" v-model="insParam.inputFileName" class="req" /></td>
              <th>Output File Name</th>
              <td><b-form-input type="text" v-model="insParam.outputFileName" class="req" /></td>
            </tr>
            <tr>
              <th class="req">Used(Y/N)</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.useYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
