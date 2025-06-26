<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { getSessionInfo } from '@/common/util/helpers';
import dayjs from 'dayjs';

const sessionInfo = getSessionInfo();

const tranType = ref('1'); //거래구분
const tranTypeList = reactive([
  { name: 'Register', value: '1' },
  { name: 'Modify', value: '2' },
  { name: 'Delete', value: '3' },
]);
const changeTranType = param => {
  tranType.value = param;
  if (tranType.value === '1') {
    insParam.dtyCd = '';
  }
};

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'dtyCd', label: 'Duty Code' },
  { key: 'dtyName', label: 'Duty Name' },
  { key: 'useYn', label: 'Use?(Y/N)' },
  // { key: 'sysLastPrcssYms', label: 'Resist YMS' },
  // { key: 'sysLastUno', label: 'Resister ID' },
]);

const pageCnt = ref('10');

const pageNo = ref(1);

const pageCntList = reactive([
  { name: '2', value: '2' },
  { name: '10', value: '10' },
  { name: '20', value: '20' },
  { name: '30', value: '30' },
  { name: '50', value: '50' },
]);

const useYns = reactive([
  { name: 'Y', value: '1' },
  { name: 'N', value: '0' },
]);

const responseData = reactive({
  totalCnt: 0,
  list: [],
});

const inqParam = computed(() => ({
  dtyCd: '',
  pageCnt: pageCnt.value,
  pageNo: pageNo.value,
}));

const insParam = reactive({
  dtyCd: '',
  dtyName: '',
  useYn: '',
  applicationType: '',
});

// 테이블 row 수 변경 시 재조회
watch(
  () => pageCnt.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      pageNo.value = 1;
      fetchList();
    }
  },
  { deep: true },
);
// 페이지 번호 변경 시 재조회
watch(
  () => pageNo.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      fetchList();
    }
  },
  { deep: true },
);

const pageSearch = () => {
  pageNo.value == 1 ? fetchList() : (pageNo.value = 1);
};

const fetchList = () => {
  apiCommon.callApi(`/csm/selectListDtyCdMgt`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.list = returnObject.resultData.list;
};

const resultData = reactive({
  totalCnt: 0,
  list: [],
});

// 테이블 클릭
const gridClick = row => {
  Object.assign(insParam, row);
  tranType.value = '2';
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  const { dtyCd, dtyName, useYn } = insParam;

  if (tranType.value !== '1' && dtyCd === '') errorMessage.value = 'Missing equired value (Duty Code)';
  if (dtyName === '') errorMessage.value = 'Missing equired value (Duty Name)';
  if (useYn === '') errorMessage.value = 'Missing equired value (Use)';

  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

// 거래 실행
const execBtn = () => {
  const exeUris = ['insertDtyCdMgt', 'updateDtyCdMgt', 'deleteDtyCdMgt'];
  const uri = exeUris[parseInt(tranType.value) - 1];
  const validate = validateExe();

  if (tranType.value === '1') {
    insParam.applicationType = sessionInfo.applicationName && sessionInfo.applicationName === 'loankbpbonl' ? 'L' : 'I';
  }

  if (validate) {
    apiCommon.callApi('/csm/' + uri, 'post', insParam, execBtnCallback);
  }
};

const execBtnCallback = returnObject => {
  if (returnObject.resultCd === '0000') {
    const options = {
      title: 'Success',
      contents: `${tranType.value === '1' ? 'Registration' : tranType.value === '2' ? 'Modification' : 'deletion'} was successful.`,
      callback: pageSearch,
    };
    useAlert(options);
  }
};
</script>

<template>
  <!-- searchArea Start -->
  <div class="search_area">
    <fieldset>
      <legend></legend>
      <table>
        <caption>
          Search Condition
        </caption>
        <tbody>
          <tr>
            <th>Duty Code</th>
            <td>
              <b-form-input type="text" v-model="inqParam.dtyCd" />
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area oneline">
      <button type="button" class="btn btn_primary" @click="pageSearch()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea End -->
  <div class="con_area">
    <!-- grid Page Count Start -->
    <ul class="boardlist_top">
      <li class="form_box">
        <p class="text">
          Total <span>{{ !resultData.totalCnt ? 0 : resultData.totalCnt }}</span>
        </p>
        <span class="text">show</span>
        <b-form-select v-model="pageCnt" :options="pageCntList" value-field="value" text-field="name"> </b-form-select>
      </li>
    </ul>
    <!-- grid Page Count End -->

    <!-- grid Start -->
    <div class="boardlist over">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="resultData.list"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(useYn)="row">
          <b-form-select
            v-select-mix
            v-model="row.item.useYn"
            :options="useYns"
            value-field="value"
            text-field="name"
            readOnly
          />
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <!-- grid End -->
    <!-- grid Paging Start -->
    <b-pagination
      v-if="resultData.totalCnt > 0"
      v-model="pageNo"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(pageCnt)"
      aria-controls="my-table"
    ></b-pagination>
    <!-- grid Paging End -->
    <!-- 실행 -->
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <!-- end 실행 -->
    <!-- input Start -->
    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Detail Content</h2></li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
        <table>
          <tbody>
            <tr>
              <th class="req">Duty Code</th>
              <td>
                <b-form-input type="text" v-model="insParam.dtyCd" :disabled="true" class="req" />
              </td>
              <th class="req">Duty Name</th>
              <td>
                <b-form-input type="text" v-model="insParam.dtyName" class="req" />
              </td>
              <th class="req">Use?(Y/N)</th>
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
    <!-- input End -->
  </div>
  <!-- //con_area -->
</template>
