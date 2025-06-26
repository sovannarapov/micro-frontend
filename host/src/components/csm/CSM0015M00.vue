<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';
  import { numberWithCommas, trimObject, initObject, isEmpty } from '@/common/util/helpers';
  //테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'adedInfoIdnfiNo', label: 'Additional Information Identification No' },
    { key: 'bzwkDstcd', label: 'Business Distinction Code' },
    { key: 'bzwkIdnfiNo', label: 'Business Identification No' },
    { key: 'adedInfoNo', label: 'Additional Information No' },
    { key: 'adedInfoName', label: 'Additional Information Name' },
    { key: 'dataDstcd', label: 'Data Classification' },
    { key: 'adedInfoCtnt1', label: 'Additional Information Content1' },
    { key: 'adedInfoCtnt2', label: 'Additional Information Content2' },
    { key: 'memo', label: 'Memo' },
  ]);
  // 테이블 row 수
  const displayCnt = ref('10');
  const pageCntList = reactive([
    { name: '2', value: '2' },
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);
  // 현재 페이지
  const page = ref(1);
  // input form
  const searchParam = computed(() => ({
    adedInfoIdnfiNo: inqParam.adedInfoIdnfiNo, //입력부점코드 v
    bzwkDstcd: inqParam.bzwkDstcd, //입력부점명 v
    displayCnt: displayCnt.value, // 화면display수
    dmndCnt: page.value, // 요청쪽수
  }));

  // 조회 파라미터
  const inqParam = reactive({
    adedInfoIdnfiNo: '',
    bzwkDstcd: '',
  });
  // const inqParam = computed(() => ({
  //   adedInfoIdnfiNo: '',
  //   bzwkDstcd: '',
  //   displayCnt: displayCnt.value,
  //   dmndCnt: page.value,
  // }));
  // 입력 파라미터
  const insParam = reactive({
    adedInfoIdnfiNo: '',
    bzwkDstcd: '',
    bzwkIdnfiNo: '',
    adedInfoNo: '',
    adedInfoName: '',
    dataDstcd: '',
    adedInfoCtnt1: '',
    adedInfoCtnt2: '',
    memo: '',
    displayCnt: '',
    dmndCnt: '',
  });
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
      if (parseInt(newValue) !== parseInt(oldValue)) {
        console.log('inqParam??==>>  ', searchParam.value);
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
    console.log('inqParam==>>  ', searchParam.value);
    apiCommon.callApi(`/csm/selectListAdedInfoMgt`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.adedInfoList = returnObject.resultData.adedInfoList;
  };

  const resultData = reactive({
    totalCnt: 0,
    adedInfoList: [],
  });

  //테이블 클릭ㅣㅣ
  const gridClick = row => {
    console.log('row : ' + row.adedInfoIdnfiNo);
    Object.assign(insParam, row);
    tranType.value = '2';
  };

  const bzwkList = getComCodes('CSM000001');

  const dataDstcdList = reactive([
    { value: 'BLN', name: 'Boolean' },
    { value: 'DBL', name: 'Double' },
    { value: 'FLT', name: 'Float' },
    { value: 'INT', name: 'Integer' },
    { value: 'LNG', name: 'Long' },
    { value: 'STR', name: 'String' },
  ]);

  const useYns = reactive([
    { value: '1', name: 'Y' },
    { value: '0', name: 'N' },
  ]);

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    if (insParam.bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
    if (insParam.bzwkIdnfiNo === '') errorMessage.value = 'Please enter the Business Identification No.';
    if (insParam.adedInfoNo === '') errorMessage.value = 'Please enter the Additional Information No.';
    if (insParam.adedInfoName === '') errorMessage.value = 'Please enter the Additional Information Name.';
    if (insParam.dataDstcd === '') errorMessage.value = 'Please enter the Data Classification.';
    if (insParam.adedInfoCtnt1 === '') errorMessage.value = 'Please enter the Additional Information Content1.';
    if (insParam.adedInfoCtnt2 === '') errorMessage.value = 'Please enter the Additional Information Content2.';
    if (insParam.memo === '') errorMessage.value = 'Please enter the Memo.';

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
    if (param === '1') {
      //insParam.adedInfoIdnfiNo = '';
      initObject(insParam);
    }
    tranType.value = param;
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertAdedInfoMgt', 'updateAdedInfoMgt', 'deleteAdedInfoMgt'];
    const uri = exeUris[parseInt(tranType.value) - 1];
    const validate = validateExe();

    if (validate) {
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
            <th>Additional Information Identification No</th>
            <td>
              <b-form-input v-model="inqParam.adedInfoIdnfiNo" maxlength="10" />
            </td>
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
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
        :items="resultData.adedInfoList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
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
              <th class="req">Additional Information Identification No</th>
              <td><b-form-input v-model="insParam.adedInfoIdnfiNo" disabled class="req" /></td>
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
              <th class="req">Business Identification No</th>
              <td>
                <b-form-input v-model="insParam.bzwkIdnfiNo" maxlength="3" :disabled="tranType !== '1'" class="req" />
              </td>
            </tr>
            <tr>
              <th class="req">Additional Information No</th>
              <td>
                <b-form-input v-model="insParam.adedInfoNo" maxlength="3" :disabled="tranType !== '1'" class="req" />
              </td>
              <th class="req">Additional Information Name</th>
              <td>
                <b-form-input v-model="insParam.adedInfoName" class="req" />
              </td>
              <th class="req">Data Classification</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.dataDstcd"
                  :options="dataDstcdList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
            </tr>
            <tr>
              <th class="req">Additional Information Content1</th>
              <td>
                <div class="form_box">
                  <b-form-input v-model="insParam.adedInfoCtnt1" class="req" />
                </div>
              </td>
              <th class="req">Additional Information Content2</th>
              <td>
                <div class="form_box">
                  <b-form-input v-model="insParam.adedInfoCtnt2" class="req" />
                </div>
              </td>
              <th class="req">Memo</th>
              <td>
                <b-form-input v-model="insParam.memo" class="req" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
