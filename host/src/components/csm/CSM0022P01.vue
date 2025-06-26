<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { setCodes, getCodes, getComCodes, getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import
const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
// 레이어팝업 emit event
const emit = defineEmits(['popup-emit', 'popup-emit2']);
onMounted(() => {
  
  inqParam.prdctCd = props.datas.prdctCd;
  inqParam.fndsUsagCd = props.datas.fndsUsagCd;
  inqParam.housBusDscd = props.datas.housBusDscd;
  inqParam.resiDscd = props.datas.resiDscd;

  resultData.totalCnt = 0;
  resultData.prdctCndnInqList = [];
  console.log('components mounted', props.datas);
});
onUnmounted(() => {
  resultData.totalCnt = 0;
  resultData.prdctCndnInqList = [];
  console.log('components unmounted', resultData);
});
const fndsUsagCdList = getCodesFromStorage({ key: 'bzwkInstncIdnfr', value: '138343033' }); //자금용도코드
const ledgrStusCdList = getCodesFromStorage({ key: 'bzwkInstncIdnfr', value: '114570000' }); //원장상태
// console.log('ledgrStusCdList==> ', ledgrStusCdList);
// input form
const searchParam = computed(() => ({
  prdctCd: inqParam.prdctCd,
  prdctName: inqParam.prdctName,
  fndsUsagCd: inqParam.fndsUsagCd,
  ledgrStusCd: inqParam.ledgrStusCd,
  housBusDscd: inqParam.housBusDscd, /* 1:가계/2:기업 */
  resiDscd: inqParam.resiDscd, /*거주자 */
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));
// 조회 파라미터
const inqParam = reactive({
  prdctCd: '',
  prdctName: '',
  fndsUsagCd: '',
  ledgrStusCd: '',
  housBusDscd:'', /* 1:가계/2:기업 */
  resiDscd:'', /*거주자 1:거주자/2:비거주자 */
});
//
const comboHousBusList = reactive([
  { name: 'Individual', value: '1' },
  { name: 'Corporate', value: '2' },
]);

const comboResiList = reactive([
  { name: 'Resident', value: '1' },
  { name: 'Non Resident' , value: '2' },
]);
//기업선택하면 
const housBusDscd_click=()=>{
  if(inqParam.housBusDscd ==='2')
    inqParam.resiDscd=''
};

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'prdctCd', label: 'Product Code', class: 'text-center' },
  { key: 'loanPurpCd', label: 'Loan purpose code' },
  { key: 'loanPurpEngnm', label: 'Loan purpose Name' },
  { key: 'startYmd', label: 'Start Ymd', class: 'text-center' },
  { key: 'endYmd', label: 'End Ymd', class: 'text-center' },
  { key: 'prdctName', label: 'Product Name', },
  { key: 'fndsUsagCd', label: 'Fund Usage Code', },
  { key: 'rpayWayCd', label: 'Retrurn Pay Code' },
  { key: 'intLevyWayCd', label: 'Interest Code' },
  { key: 'intCyclNomn', label: 'Interest Cycle Month' },
  { key: 'prcplRpayCyclNomn', label: 'Principal repayment cycle number of months', class: 'text-center' },
  { key: 'minHndlnAbilTrm', label: 'Min Handling Available Terms' },
  { key: 'maxHndlnAbilTrm', label: 'Max Handling Available Terms' },
  { key: 'hndlnAbilCrncy', label: 'Handling Available for Currency', class: 'text-center' },
  { key: 'hndlnAblamtUnitUsd', label: 'Handling Available for USD unit', thStyle: { width: '300px' } },
  { key: 'hndlnAblamtUnitKhr', label: 'Handling Available for KHR unit' },
  { key: 'intCalcWayUnit', label: 'Interest Calc Way Unit' },
  { key: 'onsdBsdeYn', label: 'One Side Both Side Yn' },
  { key: 'hndlnExpirIntDstic', label: 'Handling Expried' },
  { key: 'crdtValuaDsticBsamt', label: 'One Side Both Side Yn' },
  { key: 'crdtValuaDstcd', label: 'One Side Both Side Yn' },
  { key: 'corpHecoDstcd', label: 'Corporate household classification code' },
  { key: 'hndlnAbilCustDstcd', label: 'Handling Available Customer Code' },
  { key: 'valdTrm', label: 'Valid Terms' },
  { key: 'aplyTrm', label: 'Apply Terms' },
  { key: 'ledgrStusCd', label: 'Ledger Status Code' },
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
  apiCommon.callApi(`/csm/selectListPrdctCndnInq`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.prdctCndnInqList = returnObject.resultData.prdctCndnInqList;
};



const resultData = reactive({
  totalCnt: 0,
  prdctCndnInqList: []
});

// 테이블 클릭
const gridClick = items => {
  let sendData = {
     prdctCd: items.prdctCd                          , /* 상품코드 */
     loanPurpCd: items.loanPurpCd                       , /* 대출목적코드 */
     startYmd: items.startYmd                         , /* 시작년월일 */
     endYmd: items.endYmd                           , /* 종료년월일 */
     prdctName: items.prdctName                        , /* 상품명 */
     prdctDtalsName: items.prdctDtalsName                   , /* 상품세부명 */
     fndsUsagCd:items.fndsUsagCd                      , /* 자금용도코드 */
     rpayWayCd: items.rpayWayCd                        , /* 상환방법코드-1:일시상환2.원금균등 3:원리균등 */
     intLevyWayCd: items.intLevyWayCd                     , /* 1:월단위   2:일단위 */
     intCyclNomn: items.intCyclNomn                      , /* 월수 */
     prcplRpayCyclNomn: items.prcplRpayCyclNomn                , /* 월수 */
     minHndlnAbilTrm: items.minHndlnAbilTrm                  , /* 월수 */
     maxHndlnAbilTrm: items.maxHndlnAbilTrm                  , /* 월수 */
     hndlnAbilCrncy: items.hndlnAbilCrncy                   , /* 1: USD 2:KHR   3:ALL */
     hndlnAblamtUnitUsd: items.hndlnAblamtUnitUsd               , /*  */
     hndlnAblamtUnitKhr: items.hndlnAblamtUnitKhr               , /*  */
     intCalcWayUnit: items.intCalcWayUnit                   , /* 1:360   2:365 */
     onsdBsdeYn: items.onsdBsdeYn                       , /* 1:한편  2:양편 */
     hndlnExpirIntDstic: items.hndlnExpirIntDstic               , /* 1:취급일  2:만기일 */
     crdtValuaDsticBsamt: items.crdtValuaDsticBsamt              , /*  */
     crdtValuaDstcd: items.crdtValuaDstcd                   , /* 신용평가구분코드 */
     corpHecoDstcd: items.corpHecoDstcd                    , /* 기업가계구분코드 */
     hndlnAbilCustDstcd: items.hndlnAbilCustDstcd               , /* 취급가가능고객구분코드 */
     longShortDscd: items.longShortDscd                    , /* 장단기구분 1:단기 2:장기 3:기타 */
     resiDscd: items.resiDscd                         , /*  */
     housBusDscd: items.housBusDscd                      , /*  */
     custHandDscd: items.custHandDscd                     , /* 취급가능고객구분코드 01 : Individual   02 :  Staff  03 : Individual */
     minIntRt: items.minIntRt                         , /*  */
     maxIntRt: items.maxIntRt                         , /*  */
     level1MaxLimit: items.level1MaxLimit                   , /*  */
     levelaMaxLimit: items.levelaMaxLimit                   , /*  */
     reqFundLimitRt1: items.reqFundLimitRt1                  , /*  */
     reqFundLimitRt2: items.reqFundLimitRt2                  , /*  */
     appAuthAreaClasCd: items.appAuthAreaClasCd                , /* 기업 */
     appAuthTypeCd: items.appAuthTypeCd                    , /*  */
     loanPrdDes: items.loanPrdDes                       , /*  */
     loanPurpEngnm: items.loanPurpEngnm                    , /*  */
     valdTrm: items.valdTrm                          , /* 유효기간-월수 */
     aplyTrm: items.aplyTrm                          , /* 적용기간-월수 */
  };
  // 부모창에 데이터 전달
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
          Inquire Product Condition
        </caption>
        <tbody>
          <tr>
            <th>Product Code</th>
            <td>
              <b-form-input v-model="inqParam.prdctCd" style="width: 100px" />
            </td>
            <th>Product Name</th>
            <td>
              <b-form-input v-model="inqParam.prdctName" style="width: 100px" />
            </td>
            <th>Fund Usage Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.fndsUsagCd"
                :options="fndsUsagCdList"
                value-field="value"
                text-field="name"
              />
            </td>
          </tr>
          <tr>
            <th>Ledger Status Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.ledgrStusCd"
                :options="ledgrStusCdList"
                value-field="value"
                text-field="name"
              />
            </td>
            <th>Client Status</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.housBusDscd"
                :options="comboHousBusList"
                value-field="value"
                text-field="name"
                @click="housBusDscd_click"
              />
            </td>
            <th v-if="inqParam.housBusDscd !== '2'"> Residence Status</th>
            <td>
              <b-form-select
                v-if="inqParam.housBusDscd !== '2'"
                v-select-all
                v-select-mix
                v-model="inqParam.resiDscd"
                :options="comboResiList"
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
        :items="resultData.prdctCndnInqList"
        :fields="fields"
        select-mode="single"
        @row-dbl-clicked="gridClick"
        style="height: 367px"
      >
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(startYmd)="row">
          <b-date-picker v-model="row.item.startYmd" dateFormat="ddMMyyyy" readonly style="width: 120px" />
        </template>
        <template #cell(endYmd)="row">
          <b-date-picker v-model="row.item.endYmd" dateFormat="ddMMyyyy" readonly style="width: 120px" />
        </template>
        <!-- <template #cell(customerType)="row">
          <b-form-select
            v-select-mix
            v-model="row.item.customerType"
            :options="customerTypeList"
            value-field="value"
            text-field="name"
            readonly
          />
        </template>
        <template #cell(customerStatus)="row">
          <b-form-select
            v-select-mix
            v-model="row.item.customerStatus"
            :options="customerStatusList"
            value-field="value"
            text-field="name"
            readonly
          />
        </template> -->
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
