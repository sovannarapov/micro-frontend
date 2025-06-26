<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { numberWithCommas } from '@/common/util/helpers';

const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
const layerType = ref('1');
const layerComp = ref('');
const layerTitle = ref('');
const layerData = ref('');

let multiSelectYn = props.datas.multiSelectYn;

// 레이어팝업 emit event
const emit = defineEmits(['popup-emit', 'popup-emit2']);
onMounted(() => {
  console.log('parent data: ', props.datas);
  if(multiSelectYn==='1'){
    fields.unshift({ key: 'isActive', label: '' , class: 'text-center'});
  }

  resultData.totalCnt = 0;
  resultData.acnoInfoList = [];

  inqParam.customerNo = props.datas.customerNo;
  inqParam.brncd = props.datas.brncd;
  inqParam.custacno = props.datas.custacno;
  inqParam.accountType = props.datas.accountType;
  inqParam.accountTypeSU = props.datas.accountTypeSU; //수신계좌조회용. 승인에서필요
  
});
onUnmounted(() => {
  resultData.totalCnt = 0;
  resultData.acnoInfoList = [];
});

// input form
const searchParam = computed(() => ({
  customerNo: inqParam.customerNo,
  brncd : inqParam.brncd,
  custacno: inqParam.custacno,
  accountType: inqParam.accountType,
  accountTypeSU: inqParam.accountTypeSU,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));
// 조회 파라미터
const inqParam = reactive({
  customerNo: '',
  custacno: '',
  accountType: '',
  accountTypeSU:'',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'currentBalance', label: 'Current Balance', class: 'text-right', formatter: value => { return typeof value !== 'undefined' ? numberWithCommas(value) : '';}},
  { key: 'custacno', label: 'Account Number'},
  { key: 'accountdescription', label: 'Account Description' },
  { key: 'accountClass', label: 'Account Class', class: 'text-center' },
  { key: 'acclassdesc', label: 'Account Class Description'},
  { key: 'branchCode', label: 'Branch Code', class: 'text-center' },
  { key: 'ccy', label: 'Currency', class: 'text-center' },
  { key: 'accountType', label: 'Account Type', class: 'text-center'  },
  { key: 'customerNo', label: 'Customer No', class: 'text-center'  },
  { key: 'customerName', label: 'Customer Name' },
  //{ key: 'maturityDate', label: 'Maturity Date' },
  //{ key: 'repaymentMode', label: 'Repayment Mode' },
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
const accountTypeList = reactive([
  { name: 'CL', value: 'CL' },
  { name: 'S', value: 'S' },
  { name: 'N', value: 'N' },
  { name: 'Y', value: 'Y' },
  { name: 'U', value: 'U' },
]);

// 현재 페이지
const page = ref(1);
// 테이블 row 수 변경 시 재조회
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
// 페이지 번호 변경 시 재조회
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

// 테이블 조회
const fetchList = () => {
  const validate = validateExe();
  if (validate) {
    apiCommon.callApi(`/csm/selectListAcnoInfoInq`, 'post', searchParam.value, fetchListCallback);
  }
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.acnoInfoList = returnObject.resultData.acnoInfoList;
};

const resultData = reactive({
  totalCnt: 0,
  acnoInfoList: [],
});

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};
// 거래 실행 전 유효성 검사
const validateExe = () => {
  if (inqParam.customerNo === undefined || inqParam.customerNo.length < 5) errorMessage.value = 'Please enter 5 digits for customer number.';
  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

const onConfirm = () => {
  let sendData = resultData.acnoInfoList.filter(v => v.isActive);
  if(sendData.length===0){
    const options = {
      title: 'Error',
      contents: 'There are no rows selected.',
    };
    useAlert(options);
  }else{
    console.log('grid onConfirm --->> ', sendData);
    emit('popup-emit', sendData);
  }
}

// 테이블 클릭
const gridClick = items => {
  let sendData = {
    custacno: items.custacno,
    accountdescription: items.accountdescription,
    accountClass: items.accountClass,
    acclassdesc: items.acclassdesc,
    branchCode: items.branchCode,
    customerName: items.customerName,
    accountType: items.accountType,
    ccy: items.ccy,
    customerNo: items.customerNo,
    maturityDate: items.maturityDate,
    repaymentMode: items.repaymentMode,
  };
  // 부모창에 데이터 전달
  console.log(" sendData >>> : " , sendData);
  emit('popup-emit', sendData);
};

const openPopup = gbn => {
  layerType.value = gbn;
  if (gbn === 'cust') {//고객정보조회
    layerComp.value = 'CSM1001P01';
    layerTitle.value = 'Inquire Customer Identifier';
    layerData.value = { customerNo: inqParam.customerNo, hiddenPopupYn: '0' };
  }else if (gbn === 'brn') {
      //부점정보조회
      layerComp.value = 'CSM0031P01';
      layerTitle.value = 'Search Branch';
      layerData.value = { brncd: inqParam.brncd, hiddenPopupYn: '0' };
  }
  onClickPopup();
};

const onClickPopup = () => {
  const options = {
    title: layerTitle,
    width: 1100,
    height: 700,
    component: layerComp,
    datas: layerData,
    callback: popupCallback,
  };
  usePopup(options);
};

const popupCallback = param => {
  console.log('popupCallback',param)
  if (layerType.value === 'cust') {//고객정보조회
    inqParam.customerNo = param.customerNo;
  }else if(layerType.value === 'brn'){//부점정보조회
    inqParam.brncd = param.brncd;
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
          Inquire Account Number Identifier
        </caption>
        <tbody>
          <tr>
            <th class="req">Customer No</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="inqParam.customerNo" class="req"/>
                <button type="button" class="btn ico ico_search" @click="openPopup('cust')" />
              </div>
            </td>
            <th>Branch Code</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="inqParam.brncd" @keyup="keyUp('brn')" maxLength="3" />
                <button type="button" class="btn ico ico_search" @click="openPopup('brn')" />
              </div>
            </td>
            <th>Account Number</th>
            <td>
              <b-form-input v-model="inqParam.custacno" />
            </td>
          </tr>
          <tr>
            <th>Account Type</th>
            <td>
              <b-form-select v-select-all v-select-mix v-model="inqParam.accountType" :options="accountTypeList" value-field="value" text-field="name" />
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
      <li class="form_box">
        <b-button v-if="multiSelectYn==='1'" class="btn btn_line" @click="onConfirm()">Confirm</b-button>
      </li>
    </ul>
    <div class="boardlist">
      <b-table striped hover selectable sticky-header responsive :items="resultData.acnoInfoList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 367px">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(isActive)="row">
          <b-form-checkbox v-if="multiSelectYn==='1'" v-model="row.item.isActive" class="only-ch">&nbsp;</b-form-checkbox>
        </template>
      </b-table>
    </div>
    <b-pagination
      class="paginate"
      v-if="resultData.totalCnt > 0"
      v-model="page"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(displayCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>
  </div>
  <!-- //con_area -->
</template>
