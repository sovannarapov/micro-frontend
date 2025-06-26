<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { trimObject, initObject, numberWithCommas, clearCommas } from '@/common/util/helpers';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';
// 조회 파라미터
const searchParam = computed(() => ({
  bzwkDstcd: inqParam.bzwkDstcd,
  nbringIdnfiNo: inqParam.nbringIdnfiNo,
  nbringIdnfiCtnt: inqParam.nbringIdnfiCtnt,
  brnUnitNbringYn: inqParam.brnUnitNbringYn,
  pageCnt: displayCnt.value,
  pageNo: page.value,
}));
const inqParam = reactive({
  bzwkDstcd: '',
  nbringIdnfiNo: '',
  nbringIdnfiCtnt: '',
  brnUnitNbringYn: '',
});
// 입력 파라미터
const insParam = reactive({
  bzwkDstcd: '',
  nbringIdnfiNo: '',
  nbringIdnfiCtnt: '',
  brnUnitNbringYn: '',
  ymdUnitNbringDstcd: '',
  ymdPrcssBaseDstcd: '',
  maxNbringSerno: '',
  noCnfgCtnt: '',
  noCnfgSysCtnt: '',
  // pageCnt: '',
  // pageNo: '',
});

//테이블 필드명
const fields = reactive([
  'NO',
  { key: 'bzwkDstcd', label: 'Business Distinction Code' },
  { key: 'nbringIdnfiNo', label: 'Numbering Identification No' },
  { key: 'nbringIdnfiCtnt', label: 'Numbering Identification Content' },
  { key: 'brnUnitNbringYn', label: 'Branch Unit Numbering YN' },
  { key: 'ymdUnitNbringDstcd', label: 'YMD Unit Numbering Distinction Code' },
  { key: 'ymdPrcssBaseDstcd', label: 'YMD Process Base Distinction Code' },
  { key: 'maxNbringSerno', label: 'Max Number' },
  { key: 'noCnfgCtnt', label: 'Number Configuration Content' },
  { key: 'noCnfgSysCtnt', label: 'Number Configuration Detail' },
  { key: 'sysLastPrcssYms', label: 'Last Update' },
  { key: 'sysLastUno', label: 'UNO' },
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
      pageSearch();
    }
  },
  { deep: true },
);
//페이지 번호 변경 시 재조회
watch(
  () => page.value,
  (newValue, oldValue) => {
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
  console.log('inqParam.value===>>>  ', searchParam.value);
  apiCommon.callApi(`/csm/selectNbringRuleMgtList`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.list = returnObject.resultData.list;
};

const resultData = reactive({
  totalCnt: 0,
  list: [],
});

//테이블 클릭ㅣㅣ
const gridClick = row => {
  console.log('row : ' + row);
  Object.assign(insParam, row);
  tranType.value = '2';
};

const bzwkList = getComCodes('CSM000001');

const brnUnitNbringYnList = reactive([
  { value: '1', name: 'Y' },
  { value: '0', name: 'N' },
]);
const ymdUnitNbringDstcdList = reactive([
  { value: 'Y', name: 'Year' },
  { value: 'M', name: 'Month' },
  { value: 'D', name: 'Day' },
  { value: 'N', name: 'None' },
]);
//(시스템년월일 1,영업년월일 2)
const ymdPrcssBaseDstcdList = reactive([
  { value: '1', name: '시스템년월일' },
  { value: '2', name: '영업년월일' },
]);

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  console.log('insParam.nbringIdnfiNo.length===>>  ', insParam.nbringIdnfiNo.length);
  if (insParam.bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
  if (insParam.nbringIdnfiNo === '') errorMessage.value = 'Please enter the Numbering Identification No.';
  if (insParam.nbringIdnfiNo.length < 3) errorMessage.value = 'Numbering Identification No value must be 3 Digit.';
  if (insParam.nbringIdnfiCtnt === '') errorMessage.value = 'Please enter the Numbering Identification Content.';
  if (insParam.brnUnitNbringYn === '') errorMessage.value = 'Please enter the Branch Unit Numbering YN.';
  if (insParam.ymdUnitNbringDstcd === '') errorMessage.value = 'Please enter the YMD Unit Numbering Distinction Code.';
  if (insParam.ymdPrcssBaseDstcd === '') errorMessage.value = 'Please enter the YMD Process Base Distinction Code.';
  if (insParam.maxNbringSerno === '') errorMessage.value = 'Please enter the Max Number.';
  if (insParam.noCnfgCtnt === '') errorMessage.value = 'Please enter the Number Configuration Content.';
  if (insParam.noCnfgSysCtnt === '') errorMessage.value = 'Please enter the Number Configuration Detail.';

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
  // { value: '3', name: 'Delete' },
]);
const changeTranType = param => {
  if (param == '1') initObject(insParam);
  tranType.value = param;
};

// 거래 실행
const execBtn = () => {
  const exeUris = ['insertNbringRuleMgt', 'updateNbringRuleMgt'];
  const uri = exeUris[parseInt(tranType.value) - 1];
  const validate = validateExe();

  if (validate) {
    if (typeof insParam.maxNbringSerno !== 'number') insParam.maxNbringSerno = clearCommas(insParam.maxNbringSerno);
    console.log('insParam----->>>>   ', insParam);
    apiCommon.callApi('/csm/' + uri, 'post', insParam, execBtnCallback);
  }
};

const execBtnCallback = returnObject => {
  // 성공
  if (returnObject.resultCd === '0000') {
    const options = {
      title: 'Success',
      contents: `${tranType.value === '1' ? 'Registration' : 'Modification'} was successful.`,
      callback: pageSearch,
    };
    useAlert(options);
  }
};
const onNumberOnly = e => {
  const regex = /[^0-9]/g;
  if (regex.test(e.target.value)) {
    e.target.value = e.target.value.replace(regex, '');
    return e.target.value;
  }
};
const onlyNumberNine = e => {
  const regex = /[^9]/g;
  if (regex.test(e.target.value)) {
    e.target.value = e.target.value.replace(regex, '');
    return e.target.value;
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
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-select-all
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
              />
            </td>
            <th>Numbering Identification No</th>
            <td>
              <b-form-input v-model="inqParam.nbringIdnfiNo" maxlength="3" @keyup="onNumberOnly($event)" />
            </td>
            <th>Numbering Identification Content</th>
            <td>
              <b-form-input v-model="inqParam.nbringIdnfiCtnt" maxlength="15" />
            </td>
            <th>Branch Unit Numbering YN</th>
            <td>
              <b-form-select
                v-select-mix
                v-select-all
                v-model="inqParam.brnUnitNbringYn"
                :options="brnUnitNbringYnList"
                value-field="value"
                text-field="name"
              />
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
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name" />
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
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(maxNbringSerno)="row">
          <div style="width: 160px">
            <b-form-input
              v-model="row.item.maxNbringSerno"
              v-input-add-comma
              readonly="true"
              style="width: 100%"
            ></b-form-input>
          </div>
        </template>
        <template #cell(brnUnitNbringYn)="row">
          <b-form-select
            v-model="row.item.brnUnitNbringYn"
            v-select-mix
            :options="brnUnitNbringYnList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(ymdUnitNbringDstcd)="row">
          <b-form-select
            v-model="row.item.ymdUnitNbringDstcd"
            v-select-mix
            :options="ymdUnitNbringDstcdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(ymdPrcssBaseDstcd)="row">
          <b-form-select
            v-model="row.item.ymdPrcssBaseDstcd"
            v-select-mix
            :options="ymdPrcssBaseDstcdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(sysLastPrcssYms)="row">
          <b-date-picker v-model="row.item.sysLastPrcssYms" dateFormat="ddMMyyyy" readonly />
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
              <th class="req">Business Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDstcd"
                  :disabled="tranType !== '1'"
                  :options="bzwkList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
              <th class="req">Numbering Identification No</th>
              <td>
                <b-form-input
                  v-model="insParam.nbringIdnfiNo"
                  class="req"
                  maxlength="3"
                  :disabled="tranType !== '1'"
                  @keyup="onNumberOnly($event)"
                />
              </td>
              <th class="req">Numbering Identification Content</th>
              <td>
                <b-form-input v-model="insParam.nbringIdnfiCtnt" class="req" maxlength="200" />
              </td>
            </tr>
            <tr>
              <th class="req">Branch Unit Numbering YN</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.brnUnitNbringYn"
                  :options="brnUnitNbringYnList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
                <!-- <b-form-input v-model="insParam.brnUnitNbringYn" maxlength="3" class="req" /> -->
                <!-- <b-form-input
                  v-model="insParam.brnUnitNbringYn"
                  maxlength="3"
                  :disabled="tranType !== '1'"
                  class="req"
                /> -->
              </td>
              <th class="req">YMD Unit Numbering Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.ymdUnitNbringDstcd"
                  :options="ymdUnitNbringDstcdList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
                <!-- <b-form-input v-model="insParam.ymdUnitNbringDstcd" class="req" /> -->
              </td>
              <th class="req">YMD Process Base Distinction Code</th>
              <td>
                <!-- <b-form-input v-model="insParam.ymdPrcssBaseDstcd" class="req" /> -->
                <b-form-select
                  v-select-mix
                  v-model="insParam.ymdPrcssBaseDstcd"
                  :options="ymdPrcssBaseDstcdList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
            </tr>
            <tr>
              <th class="req">Max Number</th>
              <td>
                <div class="form_box">
                  <b-form-input
                    v-model="insParam.maxNbringSerno"
                    v-input-add-comma
                    maxLength="15"
                    class="req"
                    @keyup="onlyNumberNine($event)"
                  />
                </div>
              </td>
              <th class="req">Number Configuration Content</th>
              <td>
                <div class="form_box">
                  <b-form-input v-model="insParam.noCnfgCtnt" class="req" maxlength="100" />
                  <!-- <textarea
                    class="req"
                    style="width: 100%; height: 100px"
                    v-model="insParam.noCnfgCtnt"
                    readonly
                  ></textarea> -->
                </div>
              </td>
              <th class="req">Number Configuration Detail</th>
              <td>
                <b-form-input v-model="insParam.noCnfgSysCtnt" class="req" maxlength="100" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
