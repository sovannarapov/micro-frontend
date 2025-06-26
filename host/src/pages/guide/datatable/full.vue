<script setup>
import { allowNumberOnly, numberWithCommas, clearCommas } from '@/common/util/helpers';

definePageMeta({
  layout: 'guide',
});

/*
 * 테이블 field 선언
 * field key 제거 시 해당 column이 hidden 처리 (header를 수동으로 설정했을 경우 header도 수정 필요)
 */
const fields = reactive([
  { key: 'isChecked', label: '', class: 'text-center' },
  { key: 'branch', label: 'Branch' },
  { key: 'status', label: 'Status', class: 'text-center' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'adedInfoCtnt1', label: 'Additional Information Content1', class: 'text-center' },
  { key: 'adedInfoCtnt2', label: 'Additional Information Content2' },
  { key: 'adedInfoCtnt3', label: 'Additional Information Content3' },
  {
    key: 'amountInput',
    label: 'Amount Input',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  {
    key: 'amountFormat',
    label: 'Amount Format',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  {
    key: 'amountDecimalFormat',
    label: 'Amount Decimal Format',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  { key: 'level1', label: 'Level 1' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
  { key: 'addedInfoName', label: 'Additional Information Name' },
  { key: 'memo', label: 'Memo' },
]);

const fieldsBelow = reactive([
  { key: 'isChecked', label: '', class: 'text-center' },
  { key: 'branch', label: 'Branch' },
  { key: 'status', label: 'Status', class: 'text-center' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'adedInfoCtnt1', label: 'Additional Information Content1', class: 'text-center' },
  { key: 'adedInfoCtnt2', label: 'Additional Information Content2' },
  { key: 'adedInfoCtnt3', label: 'Additional Information Content3' },
  {
    key: 'amountInput',
    label: 'Amount Input',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  {
    key: 'amountFormat',
    label: 'Amount Format',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  {
    key: 'amountDecimalFormat',
    label: 'Amount Decimal Format',
    formatter: value => {
      return value ? numberWithCommas(value) : '';
    },
  },
  { key: 'level1', label: 'Level 1' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
  { key: 'addedInfoName', label: 'Additional Information Name' },
  { key: 'memo', label: 'Memo' },
]);

/*
 * 서버에서 전송받은 데이터
 */
const itemsfromServer = [
  {
    isChecked: false,
    branch: 'branch1',
    // status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '-1569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 1,
    level2: 11,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
  {
    isChecked: false,
    branch: 'branch2',
    // status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '2569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 2,
    level2: 21,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
  {
    isChecked: false,
    branch: 'branch3',
    // status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '3569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 3,
    level2: 33,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
];

const itemsfromServerBelow = [
  {
    isChecked: false,
    branch: 'branch1',
    status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '1569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 1,
    level2: 11,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
  {
    isChecked: false,
    branch: 'branch2',
    status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '2569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 2,
    level2: 21,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
  {
    isChecked: false,
    branch: 'branch3',
    status: 'R',
    startDate: '01122022',
    endDate: '02122022',
    adedInfoCtnt1: 'adedInfoCtnt1',
    adedInfoCtnt2: 'adedInfoCtnt2',
    adedInfoCtnt3: 'adedInfoCtnt3',
    amountInput: '3569896',
    amountFormat: '1569896',
    amountDecimalFormat: '22165622.022',
    level1: 3,
    level2: 33,
    level3: '3035633',
    hiddenField: 'hiddenField',
    addedInfoName: '1',
    addedInfoNames: [
      { name: 'addedInfoName 1', value: '1' },
      { name: 'addedInfoName 2', value: '2' },
      { name: 'addedInfoName 3', value: '3' },
      { name: 'addedInfoName 4', value: '4' },
    ],
    memo: 'memo',
  },
];

/*
 * bootstrap table 에 매핑될 데이터
 * useUpdateEvents 호출 후 useUpdatedData 에서 업데이트되어 변경된 데이터 수신
 */
const updatedItems = useUpdatedData('full-table');
const updatedItemsBelow = useUpdatedData('full-table-bellow');

/*
 * 체크박스 전체 토글 기능을 위해 _rowVariant disabled row 제거
 */
const enabledItems = computed(() => updatedItems.filter(v => !v._rowVariant && v._rowVariant !== 'disabled'));
const enabledItemsBelow = computed(() => updatedItemsBelow.filter(v => !v._rowVariant && v._rowVariant !== 'disabled'));

/*
 * 체크박스 전체 토글
 */
const checkAll = computed({
  get() {
    if (enabledItems.value.length === 0) return false;

    for (const item of enabledItems.value) {
      if (!item.isChecked) return false;
    }
    return true;
  },
  set(value) {
    for (const item of enabledItems.value) {
      item.isChecked = value;
    }
  },
});

const checkAllBelow = computed({
  get() {
    if (enabledItemsBelow.value.length === 0) return false;

    for (const item of enabledItemsBelow.value) {
      if (!item.isChecked) return false;
    }
    return true;
  },
  set(value) {
    for (const item of enabledItemsBelow.value) {
      item.isChecked = value;
    }
  },
});

/*
 * checked 된 rows 갯수
 */
const checkedRows = computed(() => updatedItems.filter(item => item.isChecked));
const checkedRowsBelow = computed(() => updatedItemsBelow.filter(item => item.isChecked));

/*
 * 선택된 row 및 row 선택 method
 */
const selected = ref([]);
const onRowSelected = item => {
  selected.value = item;
};

/*
 * Add row시 사용할 데이터를 field key값 기준으로 생성
 */
const initRow = fields.reduce((init, acc) => {
  init[acc.key] = '';
  init.status = 'N';
  init.isChecked = true;

  return init;
}, {});

/*
 * row 추가
 * 추가 시 JSON.parse(JSON.stringify로 참조 제거
 */
const addRow = () => {
  updatedItems.push(JSON.parse(JSON.stringify(initRow)));
};
const addRowBelow = () => {
  updatedItemsBelow.push(JSON.parse(JSON.stringify(initRow)));
};

/*
 * 선택된 row 제거
 * 1. checked 해제, status를 D로 변경 및 disabled 클래스 설정
 * 2. status 가 N인 경우 제거
 */
const removeRows = () => {
  const removed = updatedItems
    .map(item =>
      item.isChecked && item.status !== 'N'
        ? { ...item, isChecked: false, status: 'D', _rowVariant: 'disabled' }
        : item,
    )
    .filter(item => (!item.isChecked && item.status !== 'N') || (!item.isChecked && item.status === 'N'));

  updatedItems.splice(0);
  Object.assign(updatedItems, removed);
};

const restoreRows = () => {
  const restore = updatedItems
    .map(item => (item.status !== 'N' ? { ...item, status: 'R', _rowVariant: '' } : item))
    .filter(item => item.status !== 'N' || item.status === 'N');

  updatedItems.splice(0);
  Object.assign(updatedItems, restore);
};

const removeRowsBelow = () => {
  const removed = updatedItemsBelow
    .map(item =>
      item.isChecked && item.status !== 'N'
        ? { ...item, isChecked: false, status: 'D', _rowVariant: 'disabled' }
        : item,
    )
    .filter(item => (!item.isChecked && item.status !== 'N') || (!item.isChecked && item.status === 'N'));

  updatedItemsBelow.splice(0);
  Object.assign(updatedItemsBelow, removed);
};

/*
 * row 전체 제거
 */
const clearRows = () => {
  updatedItems.splice(0);
};
const clearRowsBelow = () => {
  updatedItemsBelow.splice(0);
};

/*
 * row, column 별 cell 속성 설정 메서드
 * 업무별로 필요에 따라 수동 설정
 */
const updateTableProperties = () => {
  for (const [index, item] of updatedItems.entries()) {
    // level1 값이 5 이상일 경우 warning, 이하일 경우 info class 적용
    item.level1 < 5
      ? (item._cellVariants = { ...item._cellVariants, level1: 'info' })
      : (item._cellVariants = { ...item._cellVariants, level1: 'warning' });
    // level2 값이 6 이상일 경우 danger class 적용
    item.level2 > 6 ? (item._cellVariants = { ...item._cellVariants, level2: 'danger' }) : item;
    // amountInput값이 minus인 경우 red class 적용
    parseInt(item.amountInput) < 0
      ? (item._cellVariants = { ...item._cellVariants, amountInput: 'red' })
      : (item._cellVariants = { ...item._cellVariants, amountInput: 'blue' });
    // addedInfoName전체에 disabled class 적용
    item._cellVariants = { ...item._cellVariants, addedInfoName: 'disabled' };
    // 특정 row 전체 disabled 처리
    if (index === 2) Object.assign(item, { _rowVariant: 'disabled' });
  }
};

/*
 * branch 선택 callback 메서드
 * callback 실행 시 마지막에 useDispatchEvent 호출 하여 input 변경 event 발생 시켜야함 (중요)
 */
const onSetBranch = param => {
  const { rowIndex, name } = param;
  const newBranch = updatedItems.map((item, index) => (index === rowIndex ? { ...item, branch: name } : item));

  Object.assign(updatedItems, newBranch);

  useDispatchEvent();
};

const onSetBranchBelow = param => {
  const { rowIndex, name } = param;
  const newBranch = updatedItemsBelow.map((item, index) => (index === rowIndex ? { ...item, branch: name } : item));

  Object.assign(updatedItemsBelow, newBranch);

  useDispatchEvent();
};

/*
 * branch 선택 팝업
 * 선택된 row index를 전달하거나 저장하여 callback시 사용
 */
const onClickBranch = idx => {
  const options = {
    title: 'Branch',
    width: 500,
    height: 300,
    component: 'Branch',
    datas: { rowIndex: idx },
    callback: onSetBranch,
  };

  usePopup(options);
};

const onClickBranchBelow = idx => {
  const options = {
    title: 'Branch',
    width: 500,
    height: 300,
    component: 'Branch',
    datas: { rowIndex: idx },
    callback: onSetBranchBelow,
  };

  usePopup(options);
};

/*
 * 데이터 조회
 * 데이터 조회 시 useUpdateEvents 호출 필요
 */
const pageSearch = () => {
  // 서버에서 전송받은 데이터에 status : 'R'이 없는 경우 삽입
  const temp = itemsfromServer.map(_ => ({ ..._, status: 'R' }));
  Object.assign(itemsfromServer, temp);

  // 테이블 id와 서버에서 전송받은 데이터 파라미터로 전달
  useUpdateEvents({ table: '#full-table', data: itemsfromServer });
};

const pageSearchBelow = () => {
  // 테이블 id와 서버에서 전송받은 데이터 파라미터로 전달
  useUpdateEvents({ table: '#full-table-bellow', data: itemsfromServerBelow });
};

const validateItems = () => {
  const flag = ref(true);

  for (const [key, item] of Object.entries(itemsfromServer)) {
    for (const cell in item) {
      // adedInfoCtnt1의 값이 invalid일 경우 유효성 통과 실패
      if (cell === 'adedInfoCtnt1') {
        if (item[cell] === 'invalid') {
          flag.value = false;
        }
      }
      // 첫번째줄 amountInput 값이 0일 경우 유효성 통과 실패
      if (parseInt(key) === 0 && cell === 'amountInput') {
        if (parseInt(item[cell]) === 0) {
          flag.value = false;
        }
      }
    }
  }

  return flag.value;
};

const insParam = reactive({ customerId: '1234' });

// 수정 저장된 테이블 데이터 전체 전송
const saveAll = () => {
  const validate = validateItems();

  if (validate) {
    Object.assign(insParam, { grid1: itemsfromServer, grid2: itemsfromServerBelow });

    console.log('insParam', insParam);
  }
};
</script>

<template>
  <h1>Datatable</h1>
  <br />
  <div>
    <h2>!!!! status field가 없는 테이블에선 useUpdateEvents, useUpdatedData, useDispatchEvent 사용할 필요 없습니다.</h2>
  </div>
  <br />
  <div>
    <h2>!!!! Update 2023.06.19 - 동일 페이지 내 status field를 가진 table이 여러개인 경우를 위해 변경</h2>
    <p>기존 : const updatedItems = useUpdatedData()</p>
    <p>변경 : const updatedItems = useUpdatedData(<strong>'full-table'</strong>)</p>
  </div>
  <br />
  <div class="mt50">
    <button type="button" class="btn btn_primary" @click="pageSearch()"><span>Inquiry</span></button>

    <b-button :disabled="!updatedItems.length" @click="updateTableProperties()">Update Table Properties</b-button>
    <b-button @click="addRow">Add</b-button>
    <b-button :disabled="!checkedRows.length" @click="removeRows">Remove</b-button>
    <b-button @click="restoreRows">Restore</b-button>
    <b-button :disabled="!updatedItems.length" @click="clearRows">Clear</b-button>
    <b-button @click="saveAll" style="float: right">전체 저장</b-button>
  </div>

  <br />
  <div class="boardlist sticky-head complex-head">
    <b-table
      id="full-table"
      :fields="fields"
      :items="updatedItems"
      sticky-header
      responsive
      selectable
      @row-selected="onRowSelected"
    >
      <template #thead-top>
        <b-tr>
          <b-th rowspan="3"><b-form-checkbox v-model="checkAll">&nbsp;</b-form-checkbox></b-th>
          <b-th rowspan="3">Branch</b-th>
          <b-th rowspan="3">Status</b-th>
          <b-th rowspan="3">Start Date</b-th>
          <b-th rowspan="3">End Date</b-th>
          <b-th rowspan="3" class="text-left">Additional<br />Information<br />Content1</b-th>
          <b-th rowspan="3" class="text-center">Additional<br />Information<br />Content2</b-th>
          <b-th rowspan="3" class="text-right">Additional<br />Information<br />Content3</b-th>
          <b-th rowspan="3">Amount Input</b-th>
          <b-th rowspan="3">Amount Format</b-th>
          <b-th rowspan="3">Amount<br />Decimal Format</b-th>
          <b-th colspan="3">Level 1</b-th>
          <b-th rowspan="3">Additional<br />Information Name</b-th>
          <b-th rowspan="3">Memo</b-th>
        </b-tr>
        <b-tr>
          <b-th colspan="2">Level 2</b-th>
          <b-th rowspan="2">Level 3</b-th>
        </b-tr>
        <b-tr>
          <b-th>Level 3</b-th>
          <b-th>Level 3</b-th>
        </b-tr>
      </template>
      <template #cell(isChecked)="row">
        <div class="text-center"><b-form-checkbox v-model="row.item.isChecked"> &nbsp;</b-form-checkbox></div>
      </template>
      <template #cell(branch)="row">
        <div class="form_box" style="width: 150px">
          <b-form-input v-model="row.item.branch"></b-form-input
          ><b-button class="ico ico_search" @click="onClickBranch(row.index)">search</b-button>
        </div>
      </template>
      <template #cell(startDate)="row">
        <div style="width: 140px"><b-date-picker v-model="row.item.startDate" /></div>
      </template>
      <template #cell(endDate)="row">
        <div style="width: 140px"><b-date-picker v-model="row.item.endDate" /></div>
      </template>
      <template #cell(adedInfoCtnt1)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt1"></b-form-input>
        </div>
      </template>
      <template #cell(adedInfoCtnt2)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt2"></b-form-input>
        </div>
      </template>
      <template #cell(adedInfoCtnt3)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt3"></b-form-input>
        </div>
      </template>
      <template #cell(amountInput)="row">
        <div style="width: 150px">
          <b-form-input v-model="row.item.amountInput" v-input-add-comma class="text-right"></b-form-input>
        </div>
      </template>
      <template #cell(level3)="row">
        <div style="width: 100px">
          {{ row.item.level3 }}
        </div>
      </template>
      <template #cell(addedInfoName)="row">
        <b-form-select
          v-model="row.item.addedInfoName"
          v-select-mix
          :options="row.item.addedInfoNames"
          value-field="value"
          text-field="name"
        >
        </b-form-select>
      </template>
    </b-table>
  </div>

  <br /><br />
  <div class="mt50">
    <button type="button" class="btn btn_primary" @click="pageSearchBelow()"><span>Inquiry</span></button>
    <b-button @click="addRowBelow">Add</b-button>
    <b-button :disabled="!checkedRowsBelow.length" @click="removeRowsBelow">Remove</b-button>
    <b-button :disabled="!updatedItemsBelow.length" @click="clearRowsBelow">Clear</b-button>
  </div>
  <br /><br />
  <div class="boardlist sticky-head complex-head">
    <b-table id="full-table-bellow" :fields="fieldsBelow" :items="updatedItemsBelow" sticky-header responsive>
      <template #thead-top>
        <b-tr>
          <b-th rowspan="3"><b-form-checkbox v-model="checkAllBelow">&nbsp;</b-form-checkbox></b-th>
          <b-th rowspan="3">Branch</b-th>
          <b-th rowspan="3">Status</b-th>
          <b-th rowspan="3">Start Date</b-th>
          <b-th rowspan="3">End Date</b-th>
          <b-th rowspan="3" class="text-left">Additional<br />Information<br />Content1</b-th>
          <b-th rowspan="3" class="text-center">Additional<br />Information<br />Content2</b-th>
          <b-th rowspan="3" class="text-right">Additional<br />Information<br />Content3</b-th>
          <b-th rowspan="3">Amount Input</b-th>
          <b-th rowspan="3">Amount Format</b-th>
          <b-th rowspan="3">Amount<br />Decimal Format</b-th>
          <b-th colspan="3">Level 1</b-th>
          <b-th rowspan="3">Additional<br />Information Name</b-th>
          <b-th rowspan="3">Memo</b-th>
        </b-tr>
        <b-tr>
          <b-th colspan="2">Level 2</b-th>
          <b-th rowspan="2">Level 3</b-th>
        </b-tr>
        <b-tr>
          <b-th>Level 3</b-th>
          <b-th>Level 3</b-th>
        </b-tr>
      </template>
      <template #cell(isChecked)="row">
        <div class="text-center"><b-form-checkbox v-model="row.item.isChecked"> &nbsp;</b-form-checkbox></div>
      </template>
      <template #cell(branch)="row">
        <div class="form_box" style="width: 150px">
          <b-form-input v-model="row.item.branch"></b-form-input
          ><b-button class="ico ico_search" @click="onClickBranchBelow(row.index)">search</b-button>
        </div>
      </template>
      <template #cell(startDate)="row">
        <div style="width: 140px"><b-date-picker v-model="row.item.startDate" /></div>
      </template>
      <template #cell(endDate)="row">
        <div style="width: 140px"><b-date-picker v-model="row.item.endDate" /></div>
      </template>
      <template #cell(adedInfoCtnt1)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt1"></b-form-input>
        </div>
      </template>
      <template #cell(adedInfoCtnt2)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt2"></b-form-input>
        </div>
      </template>
      <template #cell(adedInfoCtnt3)="row">
        <div style="width: 100px">
          <b-form-input v-model="row.item.adedInfoCtnt3"></b-form-input>
        </div>
      </template>
      <template #cell(amountInput)="row">
        <div style="width: 150px">
          <b-form-input v-model="row.item.amountInput" v-input-add-comma class="text-right"></b-form-input>
        </div>
      </template>
      <template #cell(level3)="row">
        <div style="width: 100px">
          {{ row.item.level3 }}
        </div>
      </template>
      <template #cell(addedInfoName)="row">
        <b-form-select
          v-model="row.item.addedInfoName"
          v-select-mix
          :options="row.item.addedInfoNames"
          value-field="value"
          text-field="name"
        >
        </b-form-select>
      </template>
    </b-table>
  </div>
</template>
<style scoped>
#full-table {
  max-height: 250px;
}
.table-red input {
  color: red;
}
</style>
