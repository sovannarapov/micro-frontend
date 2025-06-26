<script setup>
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useCSM0008M00 } from '@/store/csm/CSM0008M00.js';
import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';

// store 선언
const csm0008m00Store = useCSM0008M00();
const { fetchGridList, detailFetchGridList, fetchExecution } = csm0008m00Store;
const { gridListData, detailGridListData } = storeToRefs(csm0008m00Store);

const tranType = ref('1'); //거래구분
const detailTranType = ref('1'); //거래구분

const tranTypeList = reactive([
  { name: 'Register', value: '1' },
  { name: 'Modify', value: '2' },
  { name: 'Delete', value: '3' },
]);
const changeTranType = param => {
  if (isFirstTabIndex()) {
    tranType.value = param;
  }else{
    detailTranType.value = param;
  }
};

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'bzwkInstncIdnfr', label: 'Business Work Instance Identifier' },
  { key: 'bzwkInstncName', label: 'Business Work Instance Name' },
  { key: 'bzwkInstncDefinCtnt', label: 'Business Work Instance Definition Content' },
  { key: 'bzwkIncdLen', label: 'Business Work Instance Code Length' },
  { key: 'useYn', label: 'Use Yn(Y/N)' },
  { key: 'regEmpId', label: 'Registered Employee Id' },
]);

// 테이블 필드명
const detailFields = reactive([
  'NO',
  { key: 'bzwkInstncIdnfr', label: 'Business Work Instance Identifier' },
  { key: 'bzwkIncd', label: 'Business Work Instance Code' },
  { key: 'langDstcd', label: 'Language Distinction Code' },
  { key: 'bzwkInstncCtnt', label: 'Business Work Instance Definition Content' },
  { key: 'cmpsCdValCtnt', label: 'Compression Code Value Content' },
  { key: 'regEmpId', label: 'Registered Employee Id' },
  { key: 'screnRepsntSeq', label: 'Screen Represent Sequence' },
]);

const tabIndex = ref(0);

const pageCnt = ref('10');
const pageNo = ref(1);
const detailPageCnt = ref('10');
const detailPageNo = ref(1);

const pageCntList = reactive([
  { name: '10', value: '10' },
  { name: '20', value: '20' },
  { name: '30', value: '30' },
  { name: '50', value: '50' },
]);

const responseData = reactive({
  totalCnt: 0,
  list: [],
});

const responseDetailData = reactive({
  totalCnt: 0,
  list: [],
});

const searchParam = computed(() => ({
  bzwkInstncIdnfr: inqParam.bzwkInstncIdnfr,
  bzwkInstncName: inqParam.bzwkInstncName,
  pageCnt: pageCnt.value,
  pageNo: pageNo.value,
  detailPageCnt: detailPageCnt.value,
  detailPageNo: detailPageNo.value,
  pagingUseYn: '1'
}));

const inqParam = reactive({
  bzwkInstncIdnfr: '',
  bzwkInstncName: '',
});

const insParam = reactive({
  bzwkInstncIdnfr: '',
  bzwkInstncName: '',
  bzwkInstncDefinCtnt: '',
  bzwkIncdLen: '',
  regEmpId: '',
  useYn: '',
});

const insDetailParam = reactive({
  bzwkInstncIdnfr: '',
  bzwkIncd: '',
  langDstcd: '',
  bzwkInstncCtnt: '',
  cmpsCdValCtnt: '',
  regEmpId: '',
  screnRepsntSeq: '',
});

const useYns = reactive([
  { name: 'Y', value: '1' },
  { name: 'N', value: '0' },
]);

const insDisabled = reactive({
  pk: false,
  info: false,
});

const insDetailDisabled = reactive({
  pk: false,
  info: false,
});

// 테이블 row 수 변경 시 재조회
watch(
  () => pageCnt.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      pageNo.value = 1;
      pageSearch();
    }
  },
  { deep: true },
);
// 페이지 번호 변경 시 재조회
watch(
  () => pageNo.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      pageSearch();
    }
  },
  { deep: true },
);

watch(
  () => tranType.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      tranTypeChange(newValue);
    }
  },
  { deep: true },
);

// 테이블 row 수 변경 시 재조회
watch(
  () => detailPageCnt.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      detailPageNo.value = 1;
      pageSearch();
    }
  },
  { deep: true },
);
// 페이지 번호 변경 시 재조회
watch(
  () => detailPageNo.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      pageSearch();
    }
  },
  { deep: true },
);

watch(
  () => detailTranType.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      tranTypeChange(newValue);
    }
  },
  { deep: true },
);

const search = () => {
  if (isFirstTabIndex()) {
    pageNo.value == 1 ? fetchGridList(searchParam.value) : (pageNo.value = 1);
  } else {
    detailPageNo.value == 1 ? detailFetchGridList(searchParam.value) : (detailPageNo.value = 1);
  }
};

const isFirstTabIndex = () => {
  if (tabIndex.value === 0) {
    return true;
  } else {
    return false;
  }
};

const pageSearch = () => {
  if (isFirstTabIndex()) {
    fetchGridList(searchParam.value);
  } else {
    detailFetchGridList(searchParam.value);
  }
};

// 테이블 클릭
const gridClick = row => {
  if (isFirstTabIndex()) {
    tranType.value = '2';
    Object.assign(insParam, row);
  } else {
    detailTranType.value = '2';
    Object.assign(insDetailParam, row);
  }
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행
const execBtn = async () => {
  const exeUris = ['insertComCodeMgt', 'updateComCodeMgt', 'deleteComCodeMgt'];
  const detailExeUris = ['insertComCodeDtailMgt', 'updateComCodeDtailMgt', 'deleteComCodeDtailMgt'];

  let uri = '';
  let validate = false;
  let result = false;

  if (isFirstTabIndex()) {
    console.log("tab1")
    console.log("tranType : " + tranType.value)
    uri = exeUris[parseInt(tranType.value) - 1];
    validate = validateExe();
  } else {
    console.log("tab2")
    console.log("detailTranType : " + detailTranType.value)
    uri = detailExeUris[parseInt(detailTranType.value) - 1];
    validate = detailValidateExe();
  }

  const options = reactive({});

  if (validate) {
    if (isFirstTabIndex()) {
      result = await fetchExecution(uri, insParam);
    } else {
      result = await fetchExecution(uri, insDetailParam);
      //로컬 스토리지 사용 X
      //로컬 스토리지 - common code reloading
      //setCodes(true);
    }

    // 성공
    if (result) {
      Object.assign(options, {
        title: 'Success',
        contents: `Success`,
        callback: pageSearch,
      });
      useAlert(options);
    }
  }
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  const { bzwkInstncIdnfr, bzwkInstncName, bzwkInstncDefinCtnt, bzwkIncdLen, useYn } = insParam;

  if (bzwkInstncIdnfr === '') errorMessage.value = 'Missing equired value (Business Work Instance Identifier)';
  if (bzwkInstncName === '') errorMessage.value = 'Missing equired value (Business Work Instance Name)';
  if (bzwkInstncDefinCtnt === '')
    errorMessage.value = 'Missing equired value (Business Work Instance Definition Content)';
  if (bzwkIncdLen === '') errorMessage.value = 'Missing equired value (Business Work Instance Code Length)';
  if (useYn === '') errorMessage.value = 'Missing equired value (Use YES Or No)';

  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

// 거래 실행 전 유효성 검사
const detailValidateExe = () => {
  const { bzwkInstncIdnfr, bzwkIncd, langDstcd, bzwkInstncCtnt, cmpsCdValCtnt, screnRepsntSeq } = insDetailParam;

  if (bzwkInstncIdnfr === '') errorMessage.value = 'Missing equired value (Business Work Instance Identifier)';
  if (bzwkIncd === '') errorMessage.value = 'Missing equired value (Business Work Instance Code)';
  if (langDstcd === '') errorMessage.value = 'Missing equired value (Language Distinction Code)';
  if (bzwkInstncCtnt === '') errorMessage.value = 'Missing equired value (Business Work Instance Definition Content)';
  if (cmpsCdValCtnt === '') errorMessage.value = 'Missing equired value (Compression Code Value Content)';
  if (screnRepsntSeq === '') errorMessage.value = 'Missing equired value (Screen Represent Sequence)';

  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

const tranTypeChange = newValue => {
  switch (newValue) {
    case '1': // Insert
      if (isFirstTabIndex()) {
        insDisabled.pk = false;
      } else {
        insDetailDisabled.pk = false;
      }
      break;
    case '2': // Modify
      if (isFirstTabIndex()) {
        insDisabled.pk = true;
      } else {
        insDetailDisabled.pk = true;
      }
      break;
  }
};
const langDstcdList = getComCodes('CSM000008');

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
            <th>Business Work Instance Identifier</th>
            <td>
              <b-form-input type="text" v-model="inqParam.bzwkInstncIdnfr" />
            </td>
            <th>Business Work Instance Name</th>
            <td>
              <b-form-input type="text" v-model="inqParam.bzwkInstncName" />
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area tar oneline">
      <button type="button" class="btn btn_primary" title="Search" @click="search()">
        <span>Inquiry</span>
      </button>
    </div>
  </div>
  <!-- //searchArea -->
  <div class="con_area">
    <b-tabs v-model="tabIndex" content-class="tabarea">
      <b-tab title="Common Code" active="active">
        <!-- grid Page Count Start -->
        <ul class="boardlist_top">
          <li class="form_box">
            <p class="text">
              Total
              <span>{{ !gridListData.totalCnt ? 0 : gridListData.totalCnt }}</span>
            </p>
            <span class="text">show</span>
            <b-form-select
              v-model="pageCnt"
              :options="pageCntList"
              value-field="value"
              text-field="name"
            ></b-form-select>
          </li>
        </ul>
        <!-- grid Page Count End -->

        <!-- grid Start -->
        <div class="boardlist over">
          <b-table striped hover selectable sticky-header responsive :items="gridListData.list" :fields="fields" select-mode="single" @row-clicked="gridClick" style="height: 351px">
            <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
            <template #cell(useYn)="row">
              <b-form-select v-model="row.item.useYn" v-select-mix :options="useYns" readonly value-field="value" text-field="name" />
            </template>
          </b-table>
        </div>
        <!-- grid End -->

        <!-- grid Paging Start -->
        <b-pagination
          v-model="pageNo"
          :total-rows="gridListData.totalCnt"
          :per-page="parseInt(pageCnt)"
          aria-controls="my-table"
          first-text="<<"
          prev-text="<"
          next-text=">"
          last-text=">>"
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
            <li>
              <h2>Detail Content</h2>
            </li>
          </ul>
          <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
            <table>
              <colgroup>
                <col width="270" />
                <col width="" />
                <col width="200" />
                <col width="" />
                <col width="200" />
                <col width="" />
              </colgroup>
              <thead></thead>
              <tbody>
                <tr>
                  <th class="req">Business Work Instance Identifier</th>
                  <td>
                    <b-form-input type="text" v-model="insParam.bzwkInstncIdnfr" :disabled="insDisabled.pk == 1" class="req"/>
                  </td>
                  <th class="req">Business Work Instance Name</th>
                  <td>
                    <b-form-input type="text" v-model="insParam.bzwkInstncName" class="req"/>
                  </td>
                  <th class="req">Business Work Instance Definition Content</th>
                  <td>
                    <b-form-input type="text" v-model="insParam.bzwkInstncDefinCtnt" class="req"/>
                  </td>
                </tr>
                <tr>
                  <th class="req">Business Work Instance Code Length</th>
                  <td>
                    <b-form-input type="text" v-model="insParam.bzwkIncdLen" class="req"/>
                  </td>
                  <th class="req">Use Yn(Y/N)</th>
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
      </b-tab>
      <b-tab title="Common Code Detail">
        <!-- grid Page Count Start -->
        <ul class="boardlist_top">
          <li class="form_box">
            <p class="text">
              Total
              <span>{{ !detailGridListData.totalCnt ? 0 : detailGridListData.totalCnt }}</span>
            </p>
            <span class="text">show</span>
            <b-form-select
              v-model="detailPageCnt"
              :options="pageCntList"
              value-field="value"
              text-field="name"
            ></b-form-select>
          </li>
        </ul>
        <!-- grid Page Count End -->

        <!-- grid Start -->
        <div class="boardlist over">
          <b-table striped hover selectable sticky-header responsive 
            :items="detailGridListData.list"
            :fields="detailFields"
            select-mode="single"
            @row-clicked="gridClick"
            style="height: 351px"
          >
            <template #cell(NO)="row">{{ row.index + 1 + (detailPageNo - 1) * detailPageCnt }}</template>
          </b-table>
        </div>
        <!-- grid End -->

        <!-- grid Paging Start -->
        <b-pagination
          v-model="detailPageNo"
          :total-rows="detailGridListData.totalCnt"
          :per-page="parseInt(detailPageCnt)"
          aria-controls="my-table"
          first-text="<<"
          prev-text="<"
          next-text=">"
          last-text=">>"
        ></b-pagination>
        <!-- grid Paging End -->

        <!-- 실행 -->
        <business-exec 
        :tranType="detailTranType"
        :tranTypeList="tranTypeList" 
        @change-tran-type="changeTranType" 
        @execBtn="execBtn" />
        <!-- end 실행 -->

        <!-- input Start -->
        <div class="boxarea">
          <ul class="title_area sub">
            <li>
              <h2>Detail Content</h2>
            </li>
          </ul>
          <div v-bind:class="[{ boardwrite: true }, { disabled: detailTranType === '3' }]">
            <table>
              <colgroup>
                <col width="270" />
                <col width="" />
                <col width="200" />
                <col width="" />
                <col width="200" />
                <col width="" />
              </colgroup>
              <thead></thead>
              <tbody>
                <tr>
                  <th class="req">Business Work Instance Identifier</th>
                  <td>
                    <b-form-input v-model="insDetailParam.bzwkInstncIdnfr" :disabled="insDetailDisabled.pk == 1" class="req"
                    />
                  </td>
                  <th class="req">Business Work Instance Code</th>
                  <td>
                    <b-form-input v-model="insDetailParam.bzwkIncd" class="req"/>
                  </td>
                  <th class="req">Language Distinction Code</th>
                  <td>
                    <b-form-select
                      v-select-mix
                      v-model="insDetailParam.langDstcd"
                      :options="langDstcdList"
                      value-field="value"
                      text-field="name"
                      class="req"
                    >
                    </b-form-select>
                  </td>
                </tr>
                <tr>
                  <th class="req">Business Work Instance Definition Content</th>
                  <td>
                    <b-form-input v-model="insDetailParam.bzwkInstncCtnt" class="req"/>
                  </td>
                  <th class="req">Compression Code Value Content</th>
                  <td>
                    <b-form-input v-model="insDetailParam.cmpsCdValCtnt" class="req"/>
                  </td>
                  <th class="req">Screen Represent Sequence</th>
                  <td>
                    <b-form-input v-model="insDetailParam.screnRepsntSeq" class="req"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- input End -->
      </b-tab>
    </b-tabs>
  </div>
</template>
