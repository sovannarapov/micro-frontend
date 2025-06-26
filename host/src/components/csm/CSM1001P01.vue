<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';

const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});

let hiddenPopupYn = props.datas.hiddenPopupYn;
// 레이어팝업 emit event
const emit = defineEmits(['popup-emit', 'popup-emit2']);
onMounted(() => {
  resultData.custInfoList = [];
  inqParam.customerNo = props.datas.customerNo;
  inqParam.customerType = props.datas.customerType;
  console.log(" customerNo :  ", inqParam.customerNo);
  console.log(" customerType :  ", inqParam.customerType);
  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 
  if(hiddenPopupYn==='1' && inqParam.customerNo !== ''){
    console.log(" hiddenPopupYn :  ", hiddenPopupYn);
    pageSearch();
  }
});
onUnmounted(() => {
  resultData.custInfoList = [];
  console.log('components unmounted', resultData);
});

// input form
const searchParam = computed(() => ({
  customerNo: inqParam.customerNo,
  customerName: inqParam.customerName,
  customerType: inqParam.customerType,
  birthDate: inqParam.birthDate,
  customerStatus: inqParam.customerStatus,
  nationalId: inqParam.nationalId,
  passportNo: inqParam.passportNo,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));
// 조회 파라미터
const inqParam = reactive({
  customerNo: '',
  customerName: '',
  customerType: '',
  birthDate: '',
  customerStatus: '',
  nationalId: '',
  passportNo: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'customerNo', label: 'Customer No', class: 'text-center' },
  { key: 'customerName', label: ' Customer Name', },
  { key: 'customerType', label: 'Customer Distinction' },
  { key: 'cifCreationDate', label: 'Cif Creation Date', class: 'text-center' },
  { key: 'birthDate', label: 'Date of Birth/Establishment', class: 'text-center' },
  { key: 'customerStatus', label: 'Customer Status' , thStyle: { width: '200px' } },
  { key: 'authStat', label: 'Authorization Status' , thStyle: { width: '250px' } },
  { key: 'country', label: 'Country' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'nationalId', label: 'National ID' },
  { key: 'passportNo', label: 'Passport No' },
  { key: 'residentStatus', label: 'Resident Status' },
  { key: 'sex', label: 'Sex' },
  { key: 'managementBranch', label: 'Management Branch' },
  { key: 'address', label: 'Address' },
  { key: 'telNo', label: 'Tel No.' },
  { key: 'mobileNo', label: 'Mobile No.' },
  { key: 'email', label: 'E-mail' },
  { key: 'custClassification', label: 'Cust classification' },

]);
// 테이블 row 수
const displayCnt = ref(10);
const pageCntList = reactive([
  { name: '10', value: '10' },
  { name: '20', value: '20' },
  { name: '30', value: '30' },
  { name: '50', value: '50' },
]);
const customerTypeList = reactive([
  { name: 'Individual', value: 'I' },
  { name: 'Corporate', value: 'C' },
  { name: 'Bank', value: 'B' },
]);
const customerStatusList = reactive([
  { name: 'Open', value: 'O' },
  { name: 'Close', value: 'C' },
]);
const authStatList = reactive([
  { name: 'Authorization', value: 'A' },
  { name: 'Unauthorization', value: 'U' },
]);

// 현재 페이지
const page = ref(1);
// 테이블 row 수 변경 시 재조회

// 테이블 조회
const pageSearch = () => {
  page.value = 1;
  resultData.custInfoList={};
  fetchList()
};

const prevSearch = () => {
  page.value = page.value -1;
  if(page.value <0) page.value=0;
  resultData.custInfoList={};
  fetchList();
};

const nextSearch = () => {
  page.value = page.value +1;
  resultData.custInfoList={};
  fetchList();
};

// 테이블 조회
const fetchList = () => {
 // const validate = validateExe();
 // if (validate) {
    apiCommon.callApi(`/csm/selectListCustInfoInq`, 'post', searchParam.value, fetchListCallback);
  //}
};

const fetchListCallback = returnObject => {
  resultData.custInfoList = returnObject.resultData.custInfoList;

  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 및 조회결과 1건이면 결과 리턴
  if(hiddenPopupYn==='1' && resultData.custInfoList!== undefined && resultData.custInfoList.length===1){
    gridClick(resultData.custInfoList[0]);
  }
    //최초 1회만 처리하기 위해 hiddenPopupYn 변수를 초기화 시킴.
  hiddenPopupYn = '0';
  console.log("fetchListCallback-hiddenPopupYn", hiddenPopupYn);
};

const resultData = reactive({
  custInfoList: [],
});

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};
// 거래 실행 전 유효성 검사
const validateExe = () => {
  if (inqParam.customerNo === undefined || inqParam.customerNo.length < 5) errorMessage.value = 'Please enter at least 5 digits for customer number.';
  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

// 테이블 클릭
const gridClick = items => {
  let sendData = {
    customerNo : items.customerNo,
    customerName : items.customerName,
    customerType : items.customerType,
    cifCreationDate : items.cifCreationDate,
    birthDate : items.birthDate,
    customerStatus : items.customerStatus,
    authStat : items.authStat,
    country : items.country,
    nationality : items.nationality,
    nationalId : items.nationalId,
    passportNo : items.passportNo,
    residentStatus : items.residentStatus,
    sex : items.sex,
    managementBranch : items.managementBranch,
    address : items.address,
    telNo : items.telNo,
    mobileNo : items.mobileNo,
    email : items.email,
    custClassification: items.custClassification,
  };
  // 부모창에 데이터 전달
  console.log(" sendData >>> : " , sendData);
  emit('popup-emit', sendData);
};
</script>
<template>
  <!-- searchArea -->
  <div class="search_area">
    <fieldset>
      <legend></legend>
      <table>
        <caption>
          Inquire Customer Identifier
        </caption>
        <tbody>
          <tr>
            <th >Customer No</th>
            <td>
              <b-form-input v-model="inqParam.customerNo" />
            </td>
            <th>Customer Distinction</th>
            <td>
                <b-form-select v-select-all v-select-mix v-model="inqParam.customerType" :options="customerTypeList" value-field="value" text-field="name" />
            </td>
            <th>Date of Birth/Establishment</th>
            <td>
              <b-date-picker v-model:modelValue="inqParam.birthDate" />
            </td>
          </tr>
          <tr>
            <th>Customer Name</th>
            <td colspan="3">
              <b-form-input  v-model="inqParam.customerName" />
            </td>
            <th>Customer Status</th>
            <td>
              <b-form-select v-select-all v-select-mix v-model="inqParam.customerStatus" :options="customerStatusList" value-field="value" text-field="name" />
            </td>
          </tr>
          <tr>
            <th>National ID</th>
            <td>
               <b-form-input v-model="inqParam.nationalId" />
            </td>
            <th>Passport No</th>
            <td>
               <b-form-input v-model="inqParam.passportNo" />
            </td>
            <th></th>
            <td></td>
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
        <span class="text">show</span>
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
      <li class="form_box">
        <button type="button" class="btn btn_primary" @click="prevSearch()"><span>Prev Page</span></button>
        <button type="button" class="btn btn_primary" @click="nextSearch()"><span>Next Page</span></button>
      </li>
    </ul>
    <div class="boardlist">
      <b-table striped hover selectable sticky-header responsive :items="resultData.custInfoList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 367px">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(customerType)="row">
          <b-form-select v-select-mix v-model="row.item.customerType" :options="customerTypeList" value-field="value" text-field="name" readonly/>
        </template>
        <template #cell(customerStatus)="row">
          <b-form-select v-select-mix v-model="row.item.customerStatus" :options="customerStatusList" value-field="value" text-field="name" readonly/>
        </template>
        <template #cell(authStat)="row">
          <b-form-select v-select-mix v-model="row.item.authStat" :options="authStatList" value-field="value" text-field="name" readonly/>
        </template>
        <template #cell(birthDate)="row">
          <b-date-picker v-model="row.item.birthDate" dateFormat="ddMMyyyy" readonly />
        </template>
        <template #cell(cifCreationDate)="row">
          <b-date-picker v-model="row.item.cifCreationDate" dateFormat="ddMMyyyy" readonly />
        </template>
      </b-table>
    </div>
  </div>
  <!-- //con_area -->
</template>
