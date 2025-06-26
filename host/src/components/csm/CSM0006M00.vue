<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo, generateOZparam, getCurrentApprYN } from '@/common/util/helpers';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';

  // 현재 페이지의 approvalYn
  const currentAppr = getCurrentApprYN();
  console.log('currentAppr', currentAppr)
  // input form
  const searchParam = computed(() => ({
    apiPath: inqParam.apiPath,
    tranName: inqParam.tranName,
    bzwkDstcd: inqParam.bzwkDstcd,
    bzwkDtailDstcd: inqParam.bzwkDtailDstcd,
    useYn: inqParam.useYn,
    displayCnt: displayCnt.value,
    dmndCnt: page.value,
  }));

  const inqParam = reactive({
    apiPath: '',
    tranName: '',
    bzwkDstcd: '',
    bzwkDtailDstcd: '',
    useYn: '',
  });
  // 조회 파라미터
  const insParam = reactive({
    apiPath: '',
    tranName: '',
    chnlDstcd: '',
    bzwkDstcd: '',
    bzwkDtailDstcd: '',
    screnNo: '',
    aplyStartYmd: '',
    aplyEndYmd: '',
    tranCtrlYn: '',
    useYn: '',
    logStorgYn: '',
    rmark: '',
    displayCnt: '',
    dmndCnt: '',
  });

  //테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'isActive', label: '' },
    { key: 'status', label: 'Status', class: 'text-center' },
    { key: 'apiPath', label: 'API Path', class: 'text-left' },
    { key: 'tranName', label: 'Transaction Name', class: 'text-left' },
    { key: 'chnlDstcd', label: 'Channel Distinction Code' },
    { key: 'bzwkDstcd', label: 'Business Distinction Code' },
    { key: 'bzwkDtailDstcd', label: 'Business Detail Distinction Code' },
    { key: 'screnNo', label: 'Screen No' },
    { key: 'aplyStartYmd', label: 'Apply Start Date', thStyle: { width: '200px' } },
    { key: 'aplyEndYmd', label: 'Apply End Date', thStyle: { width: '200px' } },
    { key: 'tranCtrlYn', label: 'Trasaction Control Yn' },
    { key: 'useYn', label: 'Use Yn' },
    { key: 'logStorgYn', label: 'Log Store Yn' },
    { key: 'holdyTranYn', label: 'Holiday Transaction Yn' },
    { key: 'rmark', label: 'Remark' },
  ]);
  // 테이블 row 수
  const displayCnt = ref(10);
  const pageCntList = reactive([
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
    apiCommon.callApi(`/csm/selectListTranMgt`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.tranList = returnObject.resultData.tranList;
    resultData.tranListOrign = JSON.stringify(returnObject.resultData.tranList);

    console.log('tranList', resultData.tranListOrign);
  };

  const resultData = reactive({
    totalCnt: 0,
    tranList: [],
    tranListOrign: '',
  });

  //테이블 클릭ㅣㅣ
  const gridClick = row => {
    Object.assign(insParam, row);
    tranType.value = '2';
  };

  const bzwkList = getComCodes('CSM000001');
  const bzwkDtailList = getComCodes('CSM000002');
  const chnlList = getComCodes('CSM000006');
  const useYns = getComCodes('CSM000007');

  const inqBzwkDtailList = computed(() => {
    let list = [];
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === inqParam.bzwkDstcd);
    //for(let i=0; i < list.length; i++ ){
    //  list[i].value = list[i].value.replace(inqParam.bzwkDstcd,"").replace("-","");
    //}
    return list;
  });

  const insBzwkDtailList = computed(() => {
    let list = [];
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === insParam.bzwkDstcd);
    //for(let i=0; i < list.length; i++ ){
    //  list[i].value = list[i].value.replace(insParam.bzwkDstcd,"").replace("-","");
    //}
    return list;
  });

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    if (insParam.apiPath === '') errorMessage.value = 'Please enter the API path.';
    if (insParam.chnlDstcd === '') errorMessage.value = 'Please enter the Channel Distinction Code.';
    if (insParam.tranName === '') errorMessage.value = 'Please enter the Transaction Name.';
    if (insParam.bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
    if (insParam.bzwkDtailDstcd === '') errorMessage.value = 'Please enter the Business Detail Distinction Code.';
    if (insParam.screnNo === '') errorMessage.value = 'Please enter the Screen No.';
    if (insParam.aplyStartYmd === '') errorMessage.value = 'Please enter the Apply Start Date.';
    if (insParam.aplyEndYmd === '') errorMessage.value = 'Please enter the Apply End Date.';
    if (insParam.tranCtrlYn === '') errorMessage.value = 'Please enter the Transaction Control YN.';
    if (insParam.useYn === '') errorMessage.value = 'Please enter the Use Yn';
    if (insParam.logStorgYn === '') errorMessage.value = 'Please enter the Log Store Yn';
    if (insParam.holdyTranYn === '') errorMessage.value = 'Please enter the Holiday Transaction Yn';

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
    tranType.value = param;
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertTranMgt', 'updateTranMgt', 'deleteTranMgt'];
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

  const ozReport = () => {
    const filter = {
      //amountInput: 'numberWithCommas',
      // selectbox 의 경우 해당 selectbox의 key 값과 key: value 표시 여부를 option에 명시 (true 일 경우 표시)
      bzwkDstcd: { target: bzwkList, option: true },
      aplyStartYmd: 'dateToDDMMMYYYY',
    };

    let formattedData = generateOZparam(filter, resultData.tranList);

    apiCommon.callOzReport('/csm/test', formattedData, 'EXE', 'loan', 'preview');
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
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                id="cboBzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th>Business Detail Distinction Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.bzwkDtailDstcd"
                :options="inqBzwkDtailList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <td>API Path</td>
            <td>
              <b-form-input input type="text" v-model="inqParam.apiPath" />
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
      <button type="button" class="btn btn_primary" @click="ozReport()"><span>Report</span></button>
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
        :items="resultData.tranList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(NO)="row">
          {{ row.index + 1 + (page - 1) * displayCnt }}
        </template>
        <template #cell(isActive)="row">
          <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
        </template>
        <template #cell(chnlDstcd)="row">
          <b-form-select
            v-model="row.item.chnlDstcd"
            v-select-mix
            :options="chnlList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(bzwkDstcd)="row">
          <b-form-select
            v-model="row.item.bzwkDstcd"
            v-select-mix
            :options="bzwkList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(bzwkDtailDstcd)="row">
          <b-form-select
            v-model="row.item.bzwkDtailDstcd"
            v-select-mix
            :options="bzwkDtailList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(aplyStartYmd)="row">
          <b-date-picker v-model="row.item.aplyStartYmd" readonly />
        </template>
        <template #cell(aplyEndYmd)="row">
          <b-date-picker v-model="row.item.aplyEndYmd" readonly />
        </template>
        <template #cell(tranCtrlYn)="row">
          <b-form-select
            v-model="row.item.tranCtrlYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
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
        <template #cell(logStorgYn)="row">
          <b-form-select
            v-model="row.item.logStorgYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(holdyTranYn)="row">
          <b-form-select
            v-model="row.item.holdyTranYn"
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
              <th class="req">API Path</th>
              <td><b-form-input v-model="insParam.apiPath" :disabled="tranType !== '1'" class="req" /></td>
              <th class="req">Transaction Name</th>
              <td><b-form-input v-model="insParam.tranName" class="req" /></td>
              <th class="req">Screen No</th>
              <td><b-form-input v-model="insParam.screnNo" class="req" /></td>
            </tr>
            <tr>
              <th class="req">Business Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDstcd"
                  :options="bzwkList"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
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
                >
                </b-form-select>
              </td>
              <th class="req">Channel Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.chnlDstcd"
                  :options="chnlList"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr>
              <th class="req">Apply Start Date</th>
              <td>
                <div class="form_box">
                  <b-date-picker v-model:modelValue="insParam.aplyStartYmd" class="dp_req" />
                </div>
              </td>
              <th class="req">Apply End Date</th>
              <td>
                <div class="form_box">
                  <b-date-picker v-model:modelValue="insParam.aplyEndYmd" class="dp_req" />
                </div>
              </td>
              <th class="req">Transaction Control YN</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.tranCtrlYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
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
              <th class="req">Log Store Yn</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.logStorgYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
              <th class="req">Holiday Transaction Yn</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.holdyTranYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr>
              <th class="req">Remark</th>
              <td><b-form-input type="text" v-model="insParam.rmark" class="req" /></td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
