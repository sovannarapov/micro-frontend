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
const emit = defineEmits(['popup-emit']);
onMounted(() => {
  resultData.totalCnt = 0;
  resultData.empInfoInqList = [];

  insParam.empid = props.datas.empid;
  insParam.emnm = props.datas.emnm;
  insParam.brncd = props.datas.brncd;
  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 
  if(hiddenPopupYn==='1' && inqParam.empid !== ''){
    console.log(" hiddenPopupYn :  ", hiddenPopupYn);
    pageSearch();
  }
});

// input form
const inqParam = computed(() => ({
  brncd: insParam.brncd,
  empid: insParam.empid, //사용자ID 
  emnm: insParam.emnm, //직원명
  employeeID: insParam.employeeID, //직원번호
  displayCnt: displayCnt.value, // 화면display수
  dmndCnt: page.value, // 요청쪽수
}));
// 조회 파라미터
const insParam = reactive({
  brncd: '',
  empid: '',
  emnm: '',
  employeeID: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'empid', label: 'User ID' },
  { key: 'employeeID', label: 'Employee ID' },
  { key: 'emnm', label: 'Employee NAME' },
  { key: 'brncd', label: 'Branch Code' },
  { key: 'brnName', label: 'Branch Name' },
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

const fetchList = () => {
  apiCommon.callApi(`/csm/selectListEmpInfoInq`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.empInfoInqList = returnObject.resultData.empInfoInqList;

  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 및 조회결과 1건이면 결과 리턴
  if(hiddenPopupYn==='1' && resultData.empInfoInqList!== undefined && resultData.empInfoInqList.length===1){
    gridClick(resultData.empInfoInqList[0]);
  }
    //최초 1회만 처리하기 위해 hiddenPopupYn 변수를 초기화 시킴.
  hiddenPopupYn = '0';
  console.log("fetchListCallback-hiddenPopupYn", hiddenPopupYn);
};

const resultData = reactive({
  totalCnt: 0,
  empInfoInqList: [],
});

// 테이블 클릭
const gridClick = items => {
  console.log('gridClick--->> ', items, ' : ', items.emnm);

  let sendData = {
    empid: items.empid == null ? '' : items.empid,
    emnm: items.emnm == null ? '' : items.emnm,
    brncd: items.brncd == null ? '' : items.brncd,
    brnName: items.brnName == null ? '' : items.brnName,
    employeeID: items.employeeID == null ? '' : items.employeeID,
    totalCnt: items.totalCnt == null ? '' : items.totalCnt,
  };
  console.log('gridClick222--->> ', sendData);
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
              <b-form-input v-model="insParam.brncd" maxlength="3" />
            </td>
            <th>User ID</th>
            <td><b-form-input v-model="insParam.empid" maxlength="20" /></td>
            <th>Employee ID</th>
            <td><b-form-input v-model="insParam.employeeID" maxlength="5" /></td>
          </tr>
          <tr>
            <th>Employee Name</th>
            <td><b-form-input v-model="insParam.emnm" maxlength="40" /></td>
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
      <b-table striped hover selectable sticky-header responsive :items="resultData.empInfoInqList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 351px">
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
