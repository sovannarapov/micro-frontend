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
  resultData.list = [];

  insParam.uno = props.datas.uno;
  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 
  if(hiddenPopupYn==='1' && inqParam.uno !== ''){
    console.log(" hiddenPopupYn :  ", hiddenPopupYn);
    pageSearch();
  }
});

// input form
const inqParam = computed(() => ({
  uno: insParam.uno, //사용자ID 
  pageCnt: pageCnt.value, // 화면display수
  pageNo: pageNo.value, // 요청쪽수
}));
// 조회 파라미터
const insParam = reactive({
  uno: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'uno', label: 'User ID' },
  { key: 'userName', label: 'User Name' },
  { key: 'brnCode', label: 'Branch Code' },
  { key: 'brnName', label: 'Branch Name' },
]);
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
const pageSearch = () => {
  pageNo.value == 1 ? fetchList() : (pageNo.value = 1);
};

const fetchList = () => {
  apiCommon.callApi(`/csm/selectListUserMgt`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.list = returnObject.resultData.list;

  //히든팝업 여부가 '1'이면 화면로드시 바로 조회호출 및 조회결과 1건이면 결과 리턴
  if(hiddenPopupYn==='1' && resultData.list!== undefined && resultData.list.length===1){
    gridClick(resultData.list[0]);
  }
    //최초 1회만 처리하기 위해 hiddenPopupYn 변수를 초기화 시킴.
  hiddenPopupYn = '0';
  console.log("fetchListCallback-hiddenPopupYn", hiddenPopupYn);
};

const resultData = reactive({
  totalCnt: 0,
  list: [],
});

// 테이블 클릭
const gridClick = items => {
  console.log('gridClick--->> ', items, ' : ', items.userName);

  let sendData = {
    uno: items.uno == null ? '' : items.uno,
    userName: items.userName == null ? '' : items.emnm,
    brnCode: items.brnCode == null ? '' : items.brnCode,
    brnName: items.brnName == null ? '' : items.brnName,
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
            <th>User ID</th>
            <td><b-form-input v-model="insParam.uno" maxlength="20" /></td>
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
        <b-form-select v-model="pageCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
    </ul>
    <div class="boardlist">
      <b-table striped hover selectable sticky-header responsive :items="resultData.list" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 351px">
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <b-pagination
      class="paginate"
      v-model="pageNo"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(pageCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>
  </div>
  <!-- //con_area -->
</template>
