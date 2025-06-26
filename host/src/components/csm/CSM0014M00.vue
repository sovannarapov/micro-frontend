<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { parseDateLoan, getSessionInfo, diffDatesInfo, isEmpty } from '@/common/util/helpers';
import dayjs from 'dayjs';

const sessionInfo = getSessionInfo();
const tranBaseYmd = sessionInfo.tranBaseYmd;
const thisMonth = dayjs(parseDateLoan(tranBaseYmd)).format('MMYYYY');
const monthStart = ref(thisMonth);
const calMonth = ref()

// const calMonth =new Date("01"+monthStart.value).format('DDMMYYYY');
onMounted(() => {
  fetchList();
});
// 조회 파라미터
const inqParam = computed(() => ({
  sysymd: monthStart.value,
  //date: monthStart.value,
}));
// 입력 파라미터
const insParam = reactive({
  adedInfoIdnfiNo: '',
  bzwkDstcd: '',
  bzwkIdnfiNo: '',
  adedInfoNo: '',
  adedInfoName: '',
  dataDstcd: '',
  adedInfoCtnt1: '',
  adedInfoCtnt2: '',
  memo: '',
  displayCnt: '',
  dmndCnt: '',
});

//테이블 필드명
const fields = reactive(['NO', { key: 'sysymd', label: 'Date' }, { key: 'holdyDstcd', label: 'Holiday Code' }]);
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
//테이블 row 수 변경 시 재조회
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
//페이지 번호 변경 시 재조회
watch(
  () => page.value,
  (newValue, oldValue) => {
    if (parseInt(newValue) !== parseInt(oldValue)) {
      fetchList();
    }
  },
  { deep: true },
);

watch(() => monthStart.value, selectedMonth => {
  if (selectedMonth) {
    const month = selectedMonth.slice(0, 2)
    const year = selectedMonth.slice(2, 6)

    calMonth.value = new Date(`${year}-${month}-1`)
  }

}, {deep:true, immediate:true})

// 테이블 조회
const pageSearch = () => {
  page.value == 1 ? fetchList() : (page.value = 1);
};

const fetchList = () => {
  //console.log(inqParam.value, ' : : ', inqParam.value.sysymd);
  //  dayjs(new Date()).format('MMYYYY');
  // date = new Date(inqParam.value.sysymd);
  // console.log('date====>>  ', dateFormatter2(inqParam.value.sysymd, 'yyyyMM'));
  // const dd = inqParam.value.sysymd.slice(2) + '-' + inqParam.value.sysymd.slice(0, 2);
  // console.log('date====>>  ', dd);
  // calMonth = new Date(dd);
  //date = monthStart.value;
  apiCommon.callApi(`/csm/holidayInqList`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.list = returnObject.resultData.list;
};
// const dateFormatter2 = (value, format) => {
//   format = isEmpty(format) ? 'MMYYYY' : format;
//   return isEmpty(value) ? '-' : dayjs(value);
// };
const resultData = reactive({
  totalCnt: 0,
  list: [],
});

//테이블 클릭ㅣㅣ
const gridClick = row => {
  console.log('row : ' + row.adedInfoIdnfiNo);
  Object.assign(insParam, row);
  tranType.value = '2';
};

const bzwkList = reactive([
  { value: 'LNE', name: 'Loan Support' },
  { value: 'COL', name: 'Collection' },
  { value: 'CSM', name: 'System Common' },
]);

const dataDstcdList = reactive([
  { value: 'BLN', name: 'Boolean' },
  { value: 'DBL', name: 'Double' },
  { value: 'FLT', name: 'Float' },
  { value: 'INT', name: 'Integer' },
  { value: 'LNG', name: 'Long' },
  { value: 'STR', name: 'String' },
]);

const useYns = reactive([
  { value: '1', name: 'Y' },
  { value: '0', name: 'N' },
]);

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  if (insParam.bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
  if (insParam.bzwkIdnfiNo === '') errorMessage.value = 'Please enter the Business Identification No.';
  if (insParam.adedInfoNo === '') errorMessage.value = 'Please enter the Additional Information No.';
  if (insParam.adedInfoName === '') errorMessage.value = 'Please enter the Additional Information Name.';
  if (insParam.dataDstcd === '') errorMessage.value = 'Please enter the Data Classification.';
  if (insParam.adedInfoCtnt1 === '') errorMessage.value = 'Please enter the Additional Information Content1.';
  if (insParam.adedInfoCtnt2 === '') errorMessage.value = 'Please enter the Additional Information Content2.';
  if (insParam.memo === '') errorMessage.value = 'Please enter the Memo.';

  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

// 거래 구분
const tranType = ref('1');
const tranTypeList = reactive([
  { value: '1', name: 'Register' },
  { value: '2', name: 'Modify' },
  { value: '3', name: 'Delete' },
]);
const changeTranType = param => {
  tranType.value = param;
};

// 거래 실행
const execBtn = () => {
  const exeUris = ['insertAdedInfoMgt', 'updateAdedInfoMgt', 'deleteAdedInfoMgt'];
  const uri = 'holidayInqList'; //exeUris[parseInt(tranType.value) - 1];
  const validate = validateExe();

  if (validate) {
    apiCommon.callApi('/csm/' + uri, 'post', insParam, execBtnCallback);
  }
};

const execBtnCallback = returnObject => {
  // 성공
  if (returnObject.resultCd === '0000') {
    const options = {
      title: 'Success',
      contents: `${tranType.value === '1' ? 'Registration' : 'Modification'} was successful.`,
      callback: pageSearch,
    };
    useAlert(options);
  }
};
const calendarFn = weeks => {
  return weeks.map(week => ({
    ...week,
    days: week.days.map(day => {
      const filtedDate =
        resultData.list && resultData.list.filter(dd => dayjs(new Date(day.value)).format('DDMMYYYY') == dd.sysymd);
      if (
        new Date(day.value).getDay() === 6 ||
        new Date(day.value).getDay() === 0 ||
        (filtedDate && filtedDate[0] && filtedDate[0].holdyDstcd == 'H')
      )
        day.classData['fc_red'] = true;
      return day;
    }),
  }));
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
            <th>month</th>
            <td>
              <b-month-picker v-model="monthStart" />
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
        <!-- <span class="text">show</span>
        <b-form-select v-model="displayCnt" :options="pageCntList" value-field="value" text-field="name" /> -->
      </li>
    </ul>

    <div class="con_area">
      <div class="flex_row" style="height: 650px">
        <div class="col">
          <div class="boardlist">
            <b-table
              striped
              hover
              selectable
              sticky-header
              responsive
              :items="resultData.list"
              :fields="fields"
              select-mode="single"
              @row-clicked="gridClick"
              style="height: 646px"
            >
              <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
              <template #cell(sysymd)="row">
                <b-date-picker v-model="row.item.sysymd" dateFormat="ddMMyyyy" readonly />
              </template>
            </b-table>
          </div>
        </div>
        <div class="col">
          <div class="calendar">
            <vue-date-picker
              v-model="calMonth"
              inline
              auto-apply
              :calendar="calendarFn"
              :format-locale="enUS"
              :enable-time-picker="false"
              :month-change-on-scroll="false"
              :dateFormat="MMyyyy"
              :week-start="0"
              disable-month-year-select
            />
            <!-- prevent-min-max-navigation  
              -->
          </div>
        </div>
      </div>
    </div>
    <!-- //con_area -->

    <!--//contWrap -->

    <!-- <b-pagination
      v-if="resultData.totalCnt > 0"
      v-model="page"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(displayCnt)"
      aria-controls="my-table"
    ></b-pagination> -->

    <!-- 실행 -->
    <!-- <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    /> -->
    <!-- end 실행 -->

    <div class="boxarea" style="display: none">
      <ul class="title_area sub">
        <li><h2>Detail Contents</h2></li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
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
              <th class="req">Additional Information Identification No</th>
              <td><b-form-input v-model="insParam.adedInfoIdnfiNo" disabled class="req" /></td>
              <th class="req">Business Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.bzwkDstcd"
                  :disabled="tranType !== '1'"
                  :options="bzwkList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
              <th class="req">Business Identification No</th>
              <td>
                <b-form-input v-model="insParam.bzwkIdnfiNo" maxlength="3" :disabled="tranType !== '1'" class="req" />
              </td>
            </tr>
            <tr>
              <th class="req">Additional Information No</th>
              <td>
                <b-form-input v-model="insParam.adedInfoNo" maxlength="3" :disabled="tranType !== '1'" class="req" />
              </td>
              <th class="req">Additional Information Name</th>
              <td>
                <b-form-input v-model="insParam.adedInfoName" class="req" />
              </td>
              <th class="req">Data Classification</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.dataDstcd"
                  :options="dataDstcdList"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
            </tr>
            <tr>
              <th class="req">Additional Information Content1</th>
              <td>
                <div class="form_box">
                  <b-form-input v-model="insParam.adedInfoCtnt1" class="req" />
                </div>
              </td>
              <th class="req">Additional Information Content2</th>
              <td>
                <div class="form_box">
                  <b-form-input v-model="insParam.adedInfoCtnt2" class="req" />
                </div>
              </td>
              <th class="req">Memo</th>
              <td>
                <b-form-input v-model="insParam.memo" class="req" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
