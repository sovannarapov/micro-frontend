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
  resultData.totalCnt = 0;
  resultData.brnInfoInqList = [];

  insParam.brncd = props.datas.brncd;
  insParam.brnName = props.datas.brnName;
  console.log('components mounted', props.datas);
  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 
  if(hiddenPopupYn==='1' && inqParam.brncd !== ''){
    console.log(" hiddenPopupYn :  ", hiddenPopupYn);
    pageSearch();
  }
});
onUnmounted(() => {
  resultData.totalCnt = 0;
  resultData.brnInfoInqList = [];
  console.log('components unmounted', resultData);
});
//부점조회

// input form
const inqParam = computed(() => ({
  brnName: insParam.brnName,
  brncd: insParam.brncd,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
  clsrYmd: '31129999'
}));
// 조회 파라미터
const insParam = reactive({
  brnName: '',
  brncd: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'brncd', label: 'Branch Code' },
  { key: 'brnName', label: 'Branch Name' },
  { key: 'parentBranch', label: 'Parent Branch' },
  { key: 'regionalOffice', label: 'Regional Office' },
  { key: 'bnkCd', label: 'Bank Code' },
  { key: 'bic', label: 'Bic' },
  { key: 'dtailAddr', label: 'Branch Address' },
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
  apiCommon.callApi(`/csm/selectBrnInfoInq`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.brnInfoInqList = returnObject.resultData.brnInfoInqList;

  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 및 조회결과 1건이면 결과 리턴
  if(hiddenPopupYn==='1' && resultData.brnInfoInqList!== undefined && resultData.brnInfoInqList.length===1){
    gridClick(resultData.brnInfoInqList[0]);
  }
    //최초 1회만 처리하기 위해 hiddenPopupYn 변수를 초기화 시킴.
  hiddenPopupYn = '0';
  console.log("fetchListCallback-hiddenPopupYn", hiddenPopupYn);
};

const resultData = reactive({
  totalCnt: 0,
  brnInfoInqList: [],
});

// 테이블 클릭
const gridClick = items => {
  let sendData = {
    brncd: items.brncd,
    brnName: items.brnName,
    parentBarnch : items.parentBarnch,
    regionalOffice : items.regionalOffice,
    bnkCd: items.bnkCd,
    dtailAddr: items.dtailAddr,
    bic: items.bic,
    pilotBrnYn: items.pilotBrnYn,
    brnMgrExstYn: items.brnMgrExstYn,
    regionType: items.regionType,
    regionCode: items.regionCode,
    inPhnompenhYn: items.inPhnompenhYn,
    totalCnt: items.totalCnt,
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
          Search requirement
        </caption>
        <tbody>
          <tr>
            <th>Branch Code</th>
            <td>
              <b-form-input type="text" v-model="insParam.brncd" maxlength="3"/>
            </td>
            <th>Branch Name</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="insParam.brnName" style="width: 200px" />
              </div>
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
      <b-table striped hover selectable sticky-header responsive :items="resultData.brnInfoInqList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 351px">
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
      </b-table>
    </div>
    <b-pagination
      class="paginate"
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
