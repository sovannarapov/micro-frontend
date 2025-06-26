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


// 레이어팝업 emit event
const emit = defineEmits(['popup-emit', 'popup-emit2']);
onMounted(() => {
  resultData.totalCnt = 0;
  resultData.facilityInfoList = [];

  inqParam.customerNo = props.datas.customerNo;
});
onUnmounted(() => {
  resultData.totalCnt = 0;
  resultData.facilityInfoList = [];
});

// input form
const searchParam = computed(() => ({
  customerNo: inqParam.customerNo,
  facilityID: inqParam.facilityID,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));
// 조회 파라미터
const inqParam = reactive({
  customerNo: '',
  facilityID: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'customerNo', label: 'Customer No', class: 'text-center'  },
  { key: 'customerName', label: 'Customer Name'},
  { key: 'liabilityNo', label: 'Liability No', class: 'text-center'},
  { key: 'customerType', label: 'Customer Type', class: 'text-center'  },
  { key: 'facilityID', label: 'Facility ID' },
  { key: 'liabilityID', label: 'Liability ID' },
  { key: 'limitAmt', label: 'Limit Amount', class: 'text-right', formatter: value => { return typeof value !== 'undefined' ? numberWithCommas(value) : '';}},
  { key: 'availableAmt', label: 'Available Amount', class: 'text-right', formatter: value => { return typeof value !== 'undefined' ? numberWithCommas(value) : '';}},
  { key: 'branchCode', label: 'Branch Code', class: 'text-center' },
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
  apiCommon.callApi(`/csm/selectListFacilityInfoInq`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.facilityInfoList = returnObject.resultData.facilityInfoList;
};

const resultData = reactive({
  totalCnt: 0,
  facilityInfoList: [],
});

// 테이블 클릭
const gridClick = items => {
  let sendData = {
    customerNo: items.customerNo,
    customerName: items.customerName,
    liabilityNo: items.liabilityNo,
    customerType: items.customerType,
    facilityID: items.facilityID,
    liabilityID: items.liabilityID,
    limitAmt: items.limitAmt,
    availableAmt: items.availableAmt,
    branchCode: items.branchCode,
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
  if (layerType.value === 'cust') {
    inqParam.customerNo = param.customerNo;
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
            <th>Customer No</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="inqParam.customerNo" />
                <button type="button" class="btn ico ico_search" @click="openPopup('cust')" />
              </div>
            </td>
            <th>Facility ID</th>
            <td>
              <b-form-input v-model="inqParam.facilityID" />
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
      <b-table striped hover selectable sticky-header responsive :items="resultData.facilityInfoList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 367px">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
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
