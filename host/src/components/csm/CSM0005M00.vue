<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';

// input form
const searchParam = computed(() => ({
  errMsgcd: inqParam.errMsgcd,
  outptCtnt1: inqParam.outptCtnt1,
  langDstcd: inqParam.langDstcd,
  msgKndCdNo: inqParam.msgKndCdNo,
  bzwkDstcd: inqParam.bzwkDstcd,
  pageCnt: pageCnt.value,
  pageNo: pageNo.value,
}));

const inqParam = reactive({
  errMsgcd: '',
  outptCtnt1: '',
  langDstcd: '',
  msgKndCdNo: '',
  bzwkDstcd: '',
});

// 조회 파라미터
const insParam = reactive({
  errMsgcd: '',
  langDstcd: '',
  outptCtnt1: '',
  msgKndCdNo: '',
  bzwkDstcd: '',
  pageCnt: '',
  pageNo: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'errMsgcd', label: 'Error Code' },
  { key: 'outptCtnt1', label: 'Output Error Message' },
  { key: 'langDstcd', label: 'Language Code' },
  { key: 'chnlDstcd', label: 'Channel Code' },
  { key: 'msgKndCdNo', label: 'Action Code' },
]);
const tranType = ref('1');
const changeTranType = param => {
  tranType.value = param;
};
// 테이블 row 수
const pageCnt = ref(10);
const pageCntList = reactive([
  { name: '2', value: '2' },
  { name: '10', value: '10' },
  { name: '20', value: '20' },
  { name: '30', value: '30' },
  { name: '50', value: '50' },
]);

// 현재 페이지
const pageNo = ref(1);
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

// 테이블 조회
const pageSearch = param => {
  pageNo.value = 1;
  fetchList();
};

const fetchList = () => {
  apiCommon.callApi(`/csm/selectListMsgMgt`, 'post', searchParam.value, fetchListCallback);
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
  Object.assign(row, { bzwkDstcd: row.errMsgcd.substring(0, 3) });
  Object.assign(insParam, row);
  tranType.value = '2';
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  if (insParam.outptCtnt1 === '') errorMessage.value = 'Please enter Output Content.';
  if (insParam.langDstcd === '') errorMessage.value = 'Please select a language code.';
  if (insParam.bzwkDstcd === '') errorMessage.value = 'Please select a Business Distinct Code.';
  if (insParam.msgKndCdNo === '') errorMessage.value = 'Please select Action Classification Code.';
  if (insParam.chnlDstcd === '') errorMessage.value = 'Please select a channel category.';

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

const msgKndList = reactive([
  { value: 'A', name: 'action' },
  { value: 'S', name: 'select' },
  { value: 'I', name: 'insert' },
  { value: 'U', name: 'update' },
  { value: 'D', name: 'delete' },
  { value: 'T', name: 'treat' },
]);

const chnlList = getComCodes('CSM000006');
const bzwkList = getComCodes('CSM000001');
const langDstcdList = getComCodes('CSM000008');

// 거래 실행
const execBtn = () => {
  const exeUris = ['insertMsgMgt', 'updateMsgMgt', 'deleteMsgMgt'];
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
            <th>Error Code</th>
            <td>
              <b-form-input type="text" v-model="inqParam.errMsgcd" />
            </td>
            <th>Output Error Message</th>
            <td>
              <b-form-input input type="text" v-model="inqParam.outptCtnt1" />
            </td>
            <th>Language Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.langDstcd"
                :options="langDstcdList"
                value-field="value"
                text-field="name"
              ></b-form-select>
            </td>
          </tr>
          <tr>
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th>Action Classification Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.msgKndCdNo"
                :options="msgKndList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area tar oneline">
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
        <b-form-select v-model="pageCnt" :options="pageCntList" text-field="name"> </b-form-select>
      </li>
    </ul>
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
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
        <template #cell(chnlDstcd)="row">
          <b-form-select v-model="row.item.chnlDstcd" v-select-mix :options="chnlList" readonly value-field="value" text-field="name"/>
        </template>
        <template #cell(langDstcd)="row">
          <b-form-select v-model="row.item.langDstcd" v-select-mix :options="langDstcdList" readonly value-field="value" text-field="name"/>
        </template>
        <template #cell(msgKndCdNo)="row">
          <b-form-select v-model="row.item.msgKndCdNo" v-select-mix :options="msgKndList" readonly value-field="value" text-field="name"/>
        </template>
      </b-table>
    </div>
    <b-pagination
      v-model="pageNo"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(pageCnt)"
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
              <th class="req">Error Code</th>
              <td>
                <b-form-input v-model="insParam.errMsgcd" disabled class="req" />
              </td>
              <th class="req">Business Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDstcd"
                  :options="bzwkList"
                  :disabled="tranType === '2'"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
              <th class="req">Action Classification Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.msgKndCdNo"
                  :options="msgKndList"
                  :disabled="tranType === '2'"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr>
              <th class="req">Language Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.langDstcd"
                  :options="langDstcdList"
                  :disabled="tranType === '2'"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>

              <th class="req">Output Error Message</th>
              <td colspan="4">
                <b-form-input v-model="insParam.outptCtnt1" class="req" />
              </td>
            </tr>
            <tr>
              <th class="req">Channel Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.chnlDstcd"
                  :options="chnlList"
                  :disabled="tranType === '2'"
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
