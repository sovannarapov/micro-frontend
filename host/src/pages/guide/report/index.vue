<script setup>
import dayjs from 'dayjs';
import { getSessionInfo } from '@/common/util/helpers';
import { allowNumberOnly, numberWithCommas, dateToDDMMMYYYY, generateOZparam } from '@/common/util/helpers';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const nuxtApp = useNuxtApp();
const sessionInfo = getSessionInfo();
const ozUrl = 'http://10.68.33.27:8000'

onMounted(() => {
  inqParam.viewer = 'ozexeviewer.jsp';
});

const ozViewer = reactive([
  { name: 'HTML5 ver', value: 'ozhviewer.jsp' },
  { name: 'EXE ver', value: 'ozexeviewer.jsp' },
]);

const testJsonParam = reactive([
  { amountInput: 'kim', startDate: 'hyunchol', age: '40' },
  { amountInput: 'jung', startDate: 'dukyoung', age: '43' },
  { amountInput: 'lim', startDate: 'minsun', age: '29' },
]);

const inqParam = reactive({
  viewer: '',
});

const param = ref('Calendar');
const delimiter = '^';
const sysdate = dayjs(new Date()).format('DD/MM/YYYY HH:MM:ss');

const ozParam = computed(() => ({
  url: ozUrl, // + inqParam.viewer,
  params: {
    report: param.value,
    jsondata: testJsonParam,
    delimiter: '^',
    taildata:
      sessionInfo.brnCode +
      delimiter +
      sessionInfo.uno +
      delimiter +
      sessionInfo.operGroupCd +
      delimiter +
      sessionInfo.brnName +
      delimiter +
      sessionInfo.langDstcd +
      delimiter +
      sysdate +
      delimiter +
      sysdate,
    //taildata: 'dotcode^operater^opergrpcd^dotname^langcd^opergrpdate^opergrppatdate',
  },
}));

const testJsonParamDataLoan = reactive([]);
const testJsonParamDataInfo = reactive({});
// 여신
const ozParamDataLoan = computed(() => ({
  url: ozUrl, //+ inqParam.viewer,
  service: 'loan',
  params: {
    report: param.value,
    jsondata: testJsonParamDataLoan,
    delimiter: '^',
    taildata:
      sessionInfo.brnCode +
      delimiter +
      sessionInfo.uno +
      delimiter +
      sessionInfo.operGroupCd +
      delimiter +
      sessionInfo.brnName +
      delimiter +
      sessionInfo.langDstcd +
      delimiter +
      sysdate +
      delimiter +
      sysdate,
    //taildata: 'dotcode^operater^opergrpcd^dotname^langcd^opergrpdate^opergrppatdate',
  },
}));
// 정보
const ozParamDataInfo = computed(() => ({
  url: ozUrl, //+ inqParam.viewer,
  service: 'info',
  params: {
    report: param.value,
    jsondata: testJsonParamDataInfo,
  },
}));

const fields = reactive([
  {
    key: 'amountInput',
    label: 'Amount Input',
    class: 'text-left',
  },
  { key: 'startDate', label: 'Start Date', class: 'text-left' },
  { key: 'addedInfoName', label: 'Added Info Name' },
  { key: 'age', label: 'Age' },
  { key: 'job', label: 'Job' },
]);
const addedInfoNameOptions = [
  { name: '11name 1', value: '1' },
  { name: '22name 2', value: '2' },
  { name: '33name 3', value: '3' },
  { name: '44name 4', value: '4' },
];
const items = reactive([
  {
    addedInfoName: '1',
    amountInput: '11111569896',
    startDate: '01122022',
    age: 11,
    job: 'job 1',
  },
  {
    addedInfoName: '2',
    amountInput: '22221569896',
    startDate: '02122022',
    age: 22,
    job: 'job 2',
  },
  {
    addedInfoName: '3',
    amountInput: '33331569896',
    startDate: '03122022',
    age: 33,
    job: 'job 3',
  },
  {
    addedInfoName: '4',
    amountInput: '44441569896',
    startDate: '04122022',
    age: 44,
    job: 'job 4',
  },
]);
const tableau = ref(null);
const onClickPopupParam = () => {
  const options = {
    title: 'OZ Report',
    width: 1300,
    height: 800,
    component: 'Report',
    datas: ozParam.value,
    callback: null,
  };
  console.log('url', ozUrl);
  usePopup(options);
};

// 데이터 변환 전송
const onClickPopupParamWithDataLoan = () => {
  /*
   * 추출 대상 필드와 적용 메서드
   * 적용시킬 메서드들은 helpers.ts 참고
   */
  const filter = {
    amountInput: 'numberWithCommas',
    // selectbox 의 경우 해당 selectbox의 key 값과 key: value 표시 여부를 option에 명시 (true 일 경우 표시)
    addedInfoName: { target: addedInfoNameOptions, option: true },
    startDate: 'dateToDDMMMYYYY',
  };
  const formattedData = generateOZparam(filter, items);

  Object.assign(testJsonParamDataLoan, formattedData);

  const options = {
    title: 'OZ Report',
    width: 1300,
    height: 800,
    component: 'Report',
    datas: ozParamDataLoan.value,
    callback: null,
  };

  usePopup(options);
};

// 데이터 변환 전송
const onClickPopupParamWithDataInfo = () => {
  /*
   * 추출 대상 필드와 적용 메서드
   * 적용시킬 메서드들은 helpers.ts 참고
   */
  const filter = {
    amountInput: 'numberWithCommas',
    // selectbox 의 경우 해당 selectbox의 key 값과 key: value 표시 여부를 option에 명시 (true 일 경우 표시)
    addedInfoName: { target: addedInfoNameOptions, option: true },
    startDate: 'dateToDDMMMYYYY',
  };
  const formattedData = generateOZparam(filter, items);

  testJsonParamDataInfo.fmtData = formattedData;
  testJsonParamDataInfo.arrData = [{ a: 'aaaa 1' }, { b: 'bbbb 1' }, { c: 'cccc 1' }, { d: 'dddd 1' }];
  testJsonParamDataInfo.objData = { a: 'aaaa 1', b: 'bbbb 1', c: 'cccc 1', d: 'dddd 1' };
  testJsonParamDataInfo.obj2Data = { a: 'aaaa 1', b: 'bbbb 1', c: 'cccc 1', d: 'dddd 1' };
  testJsonParamDataInfo.obj3Data = { a: 'aaaa 1', b: 'bbbb 1', c: 'cccc 1', d: 'dddd 1' };

  const options = {
    title: 'OZ Report',
    width: 1300,
    height: 800,
    component: 'Report',
    datas: ozParamDataInfo.value,
    callback: null,
  };

  console.log('testJsonParamDataInfo', testJsonParamDataInfo);
  usePopup(options);
};
</script>

<template>
  <h1>OZ Report popup</h1>

  <br /><br />
  <div>
    OZ report url 및 parameter 입력<br /><br />
    <!-- OZ Site : <b-form-input v-model="sessionInfo.ozServerUrl" /><br /><br /> -->
    Viewer :
    <b-form-select v-model="inqParam.viewer" :options="ozViewer" value-field="value" text-field="name" /><br /><br />
    OZ File(ozr name) : <b-form-input v-model="param" />
  </div>
  <br />
  <div>
    <b-button variant="outline-primary" @click="onClickPopupParam">Open OZ report popup with parameter</b-button>
  </div>
  <br /><br />
  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(amountInput)="row">
        <div style="width: 150px">
          <b-form-input v-model="row.item.amountInput" v-input-add-comma class="text-right"></b-form-input>
        </div>
      </template>
      <template #cell(startDate)="row">
        <div style="width: 140px"><b-date-picker v-model="row.item.startDate" /></div>
      </template>
      <template #cell(addedInfoName)="row">
        <b-form-select
          v-model="row.item.addedInfoName"
          v-select-mix
          :options="addedInfoNameOptions"
          value-field="value"
          text-field="name"
        >
        </b-form-select>
      </template>
    </b-table>
  </div>
  <br /><br />
  <div>
    <b-button variant="outline-primary" @click="onClickPopupParamWithDataLoan"
      >Open OZ report popup with data - LOAN</b-button
    >
    <b-button variant="outline-primary" @click="onClickPopupParamWithDataInfo"
      >Open OZ report popup with data - INFO</b-button
    >
  </div>
  <br />
</template>
