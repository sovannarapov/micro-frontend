<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { parseDateLoan, getSessionInfo, numberWithCommas } from '@/common/util/helpers';
import { setCodes, getCodes, getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import
import dayjs from 'dayjs';

const sessionInfo = getSessionInfo();
const tranBaseYmd = sessionInfo.tranBaseYmd;
const today = dayjs(parseDateLoan(tranBaseYmd)).format('DDMMYYYY');
const route = useRoute();
const { path } = route;
const idnfiNo = path.substring(path.lastIndexOf('/') + 1);

const exeStusDstcdList = getCodesFromStorage({
  key: 'bzwkInstncIdnfr',
  value: 'CSM000005',
});
const searchParam = computed(() => ({
  btchExeYmd: inqParam.btchExeYmd,
  exeStusDstcd: inqParam.exeStusDstcd,
  btchJobId: inqParam.btchJobId,
  pageCnt: displayCnt.value,
  pageNo: page.value,
}));
// input form
const inqParam = reactive({
  btchJobId: '',
  btchExeYmd: today,
  exeStusDstcd: '',
});
// detail
const insParam = reactive({
  btchJobId: '',
  btchExeYmd: '',
  btchJobName: '',
  prcssNth: '',
  btchBaseYmd: '',
  startYms: '',
  endYms: '',
  exeStusDstcd: '',
  prcssNoitm: '',
  inptParmCtnt: '',
  btchJobShellName: '',
  errCtnt: '',
});

// 테이블 필드명
const fields = reactive([
  { key:'NO'}, 
  { key: 'btchJobId', label: 'BATCH JOB ID', class: 'text-center'},
  { key: 'btchExeYmd', label: 'BATCH EXE YMD', class: 'text-center' },
  { key: 'btchJobName', label: 'BATCH JOB Name' },
  {key: 'prcssNth', label: 'PROCESS NTH', class: 'text-right', formatter: value => {return numberWithCommas(value)} },
  { key: 'btchBaseYmd', label: 'BTCH BASE YMD', class: 'text-center' },
  { key: 'startYms', label: 'START YMS' },
  { key: 'endYms', label: 'END YMS' },
  { key: 'exeStusDstcd', label: 'EXE STATUS CD' },
  { key: 'prcssNoitm', label: 'PROCESS NOITM', class: 'text-right', formatter: value => {return numberWithCommas(value)} },
  { key: 'inptParmCtnt', label: 'INPUT PARM CONTENT' },
  { key: 'btchJobShellName', label: 'BTCH JOB SHELL NAME'},
  { key: 'errCtnt', label: 'ERROR CONTENT' },
]);
// 테이블 row 수
const displayCnt = ref(10);
const changeDisplayCnt = param => {
  displayCnt.value = param;
};
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
    console.log('displayCnt - watch');
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
    console.log('page - watch');
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
  apiCommon.callApi(`/csm/btchLogList`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.batchLogList = returnObject.resultData.batchLogList;
};

// 테이블 클릭
const gridClick = row => {
  Object.assign(insParam, row);
  // insParam.menu1Lev = row.menuId.substring(0, 3);
  // insParam.menu2Lev = row.menuId.substring(0, 5);
  // tranType.value = '2';
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

onMounted(() => {
  //메뉴콤보 조회
  //apiCommon.callApi(`/csm/selectListMenuCombo`, 'post', searchParam.value, fetchComboCallback);
});
const resultData = reactive({
  totalCnt: 0,
  batchLogList: [],
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
            <th>Batch Job Id</th>
            <td>
              <b-form-input v-model="inqParam.btchJobId" />
            </td>
            <th class="req">Batch Exe Ymd</th>
            <td>
              <b-date-picker v-model:modelValue="inqParam.btchExeYmd" class="dp_req"/>
            </td>
            <th>Exe Status Code</th>
            <td>
              <div class="form_box">
                <b-form-select
                  v-select-all
                  v-select-mix
                  v-model="inqParam.exeStusDstcd"
                  :options="exeStusDstcdList"
                  value-field="value"
                  text-field="name"
                  style="width: 250px"
                ></b-form-select>
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
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="resultData.batchLogList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(exeStusDstcd)="row">
          <b-form-select
            v-model="row.item.exeStusDstcd"
            v-select-mix
            :options="exeStusDstcdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(inptParmCtnt)="row">
          <p :title="row.item.inptParmCtnt" v-trim-text="'20'">
            {{ row.item.inptParmCtnt }}
          </p>
        </template>
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
    <!-- <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    /> -->
    <!-- end 실행 -->

    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Detail Contents</h2></li>
      </ul>
      <div class="boardwrite">
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
              <th>BATCH JOB ID</th>
              <td><b-form-input v-model="insParam.btchJobId" disabled /></td>
              <th>BATCH EXE YMD</th>
              <td>
                <b-form-input v-model="insParam.btchExeYmd" readonly/>
              </td>
              <th>PROCESS NTH</th>
              <td>
                <b-form-input v-model="insParam.prcssNth" v-input-add-comma class="text-right" readonly/>
              </td>
            </tr>
            <tr>
              <th>BATCH JOB NAME</th>
              <td><b-form-input v-model="insParam.btchJobName" readonly/></td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <th>BTCH BASE YMD</th>
              <td>
                <b-form-input v-model="insParam.btchBaseYmd" readonly/>
              </td>
              <th>START YMS</th>
              <td>
                <b-form-input v-model="insParam.startYms" readonly/>
              </td>
              <th>END YMS</th>
              <td>
                <b-form-input v-model="insParam.endYms" readonly/>
              </td>
            </tr>
            <tr>
              <th>EXE STATUS CD</th>
              <td>
                <b-form-select
                  v-model="insParam.exeStusDstcd"
                  v-select-mix
                  :options="exeStusDstcdList"
                  readonly
                  value-field="value"
                  text-field="name"
                />
              </td>
              <th>PROCESS NOITM</th>
              <td><b-form-input v-model="insParam.prcssNoitm" v-input-add-comma class="text-right" readonly/></td>
              <th>BTCH JOB SHELL NAME</th>
              <td>
                <b-form-input v-model="insParam.btchJobShellName" readonly/>
              </td>
            </tr>
            <tr>
              <th>INPUT PARM CONTENT</th>
              <td><textarea style="width: 100%; height: 100px" v-model="insParam.inptParmCtnt" readonly></textarea></td>

              <th>ERROR CONTENT</th>
              <td colspan="3">
                <textarea style="width: 100%; height: 100px" v-model="insParam.errCtnt" readonly></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
