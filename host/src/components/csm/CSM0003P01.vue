<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { getComCodes } from '@/common/util/commonCodes';
import { parseDateLoan } from '@/common/util/helpers';
import dayjs from 'dayjs';



const bzwkList = getComCodes('CSM000001');

const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
// 레이어팝업 emit event
const emit = defineEmits(['popup-emit']);
onMounted(() => {
  resultData.totalCnt = 0;
  resultData.list = [];

  //테이블목록 조회
  apiCommon.callApi(`/csm/selectListTableInfo`, 'post', searchParam.value, fetchComboCallback, {});

  console.log('paramtestvalue : ', props.datas.paramtestvalue);
  console.log('bzwkDstcd : ', props.datas.bzwkDstcd);
  console.log('tableName : ', props.datas.tableName);
  inqParam.bzwkDstcd = props.datas.bzwkDstcd;
  inqParam.tableName = props.datas.tableName;
  inqParam.modfiStartYmd = ref(dayjs(new Date()).add(-7, 'day').format('DDMMYYYY'));
  inqParam.modfiEndYmd = ref(dayjs(new Date()).format('DDMMYYYY'));
});

// input form
const searchParam = computed(() => ({
  bzwkDstcd: inqParam.bzwkDstcd, //업무구분
  modfiStartYmd: inqParam.modfiStartYmd, //변경일자
  modfiEndYmd: inqParam.modfiEndYmd, //변경일자
  tableName: inqParam.tableName, //테이블명
  pageCnt: pageCnt.value, // 화면display수
  pageNo: pageNo.value, // 요청쪽수
}));
// 조회 파라미터
const inqParam = reactive({
  bzwkDstcd:'',
  modfiStartYmd:'',
  modfiEndYmd:'',
  tableName: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'modfiYmd', label: 'Modify Date' },
  { key: 'modfiSerno', label: 'Modify Serno' , class: 'text-right'},
  { key: 'TblName', label: 'Table Name' },
  { key: 'colName', label: 'Column Name' },
  { key: 'modfiBfCtnt', label: 'Modify Before Contents' },
  { key: 'modfiAfCtnt', label: 'Modify After Contents' },
  { key: 'modfiWhereCtnt', label: 'Modify Where Contents' },
  { key: 'tranUuid', label: 'Tran UUID' },
  { key: 'tranYms', label: 'Tran YMS' },
  { key: 'tranUno', label: 'Tran User ID' },

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

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

const mkErrorMessage = param => {
  errorMessage.value = param;
  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
  if (errorMessage.value) {
    useAlert(options);
  }
};

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
  if (inqParam.bzwkDstcd === ''){mkErrorMessage('Please enter the Business Distinction Code .'); return false;} 
  if (inqParam.tableName === ''){mkErrorMessage('Please enter the Table Name.'); return false;}

  apiCommon.callApi(`/csm/selectListTableInfoHistory`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.tableInfoHistoryList = returnObject.resultData.tableInfoHistoryList;
};

const fetchComboCallback = returnObject => {
  resultData.tableList = returnObject.resultData.tableList;
  pageSearch();
};

const resultData = reactive({
  totalCnt: 0,
  tableList: [],
  tableInfoHistoryList: [],
});

const tableListFilter = computed(() => {
  let list = [];
  if (!resultData.tableList) return list;
  list = resultData.tableList.filter(item => item.tableName.substring(2, 5) === inqParam.bzwkDstcd);
  return list;
});

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
            <th>Modify Date</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model="inqParam.modfiStartYmd" class="dp_req" /> 
                <span class="text">~</span>  
                <b-date-picker v-model="inqParam.modfiEndYmd" class="dp_req" />
               </div>
            </td>
          </tr>
          <tr>
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th>Table Name</th>
            <td>
                <b-form-select
                  v-select-mix
                  v-model="inqParam.tableName"
                  :options="tableListFilter"
                  value-field="tableName"
                  text-field="tableDesc">
                </b-form-select>
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
        <b-form-select v-model="pageCnt" :options="pageCntList" value-field="value" text-field="name">
        </b-form-select>
      </li>
    </ul>
    <div class="boardlist">
      <b-table striped hover selectable sticky-header responsive :items="resultData.tableInfoHistoryList" :fields="fields" select-mode="single" style="height: 351px">
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
