<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';
import { setCodes, getCodes } from '@/common/util/commonCodes';

// input form
const searchParam = computed(() => ({
  isoNatnlCd: inqParam.isoNatnlCd,
  natnlName: inqParam.natnlName,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));

// 조회 파라미터
const inqParam = reactive({
  isoNatnlCd: '',
  natnlName: '',
});

//입력 파라미터
const insParam = reactive({
  isoNatnlCd: '',
  natnlCd: '',
  isoNatnlNoCd: '',
  isoEngCd: '',
  natnlName: '',
  cntntDstcd: '',
  primNatnlYn: '',
  primUseCncycd: '',
  updatYmd: '',
});

//테이블 필드명
const fields = reactive([
  'NO',
  { key: 'isoNatnlCd', label: 'ISO Country Code', class: 'text-left' },
  { key: 'natnlCd', label: 'Country Code(kor)', class: 'text-left' },
  { key: 'isoNatnlNoCd', label: 'ISO Country No. Code' },
  { key: 'isoEngCd', label: 'ISO Code(eng)' },
  { key: 'natnlName', label: 'Country Name' },
  { key: 'cntntDstcd', label: 'Continent Distinction Code' },
  { key: 'primNatnlYn', label: 'Major Country?(Y/N)' },
  { key: 'primUseCncycd', label: 'Mainly Used Currency' },
  { key: 'updatYmd', label: 'Renewal Date' },
]);
// 테이블 row 수
const displayCnt = ref(10);
const pageCntList = reactive([
  { name: '10', value: '10' },
  { name: '20', value: '20' },
  { name: '30', value: '30' },
  { name: '50', value: '50' },
]);
const useYns = reactive([
  { value: '1', name: 'Y' },
  { value: '0', name: 'N' },
]);

const cntntDstcdList = await getCodes({ key: 'bzwkInstncIdnfr', value: 'CSM000003' });

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

const fetchList = () => {
  apiCommon.callApi(`/csm/selectListNatnlCdMgt`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.natnlCdList = returnObject.resultData.natnlCdList;
};

const resultData = reactive({
  totalCnt: 0,
  natnlCdList: [],
});

//테이블 클릭ㅣㅣ
const gridClick = row => {
  Object.assign(insParam, row);
  tranType.value = '2';
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  if (insParam.isoNatnlCd === '') errorMessage.value = 'Please enter the ISO Country Code.';
  if (insParam.natnlCd === '') errorMessage.value = 'Please enter the Country Code(kor).';
  if (insParam.isoNatnlNoCd === '') errorMessage.value = 'Please enter the ISO Country No. Code.';
  if (insParam.isoEngCd === '') errorMessage.value = 'Please enter the ISO Code(eng).';
  if (insParam.natnlName === '') errorMessage.value = 'Please enter the Country Name.';
  if (insParam.cntntDstcd === '') errorMessage.value = 'Please enter the Continent Distinction Code.';
  if (insParam.primNatnlYn === '') errorMessage.value = 'Please enter the Major Country?(Y/N).';
  if (insParam.primUseCncycd === '') errorMessage.value = 'Please enter the Mainly Used Currency.';
  if (insParam.updatYmd === '') errorMessage.value = 'Please enter the Renewal Date.';

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
  const exeUris = ['insertNatnlCdMgt', 'updateNatnlCdMgt', 'deleteNatnlCdMgt'];
  const uri = exeUris[parseInt(tranType.value) - 1];
  const validate = validateExe();
  if (validate) {
    apiCommon.callApi('/csm/' + uri, 'post', insParam, execBtnCallback);
  }
};

const execBtnCallback = returnObject => {
  if (returnObject.resultCd === '0000') {
    const options = {
      title: 'Success',
      contents: `${tranType.value === '1' ? 'Registration' : 'Modification'} was successful.`,
      callback: pageSearch,
    };
    useAlert(options);
  }
};

const popupCallback = param => {
  console.log('popupCallback', param);
  recvEvtFromChild(param);
};

const onClickPopup = () => {
  const options = {
    title: 'Search Country Code',
    component: 'CSM0021P01',
    height: 620,
    datas: [{ test: 'test' }],
    callback: popupCallback,
  };
  usePopup(options);
};

const recvEvtFromChild = param => {
  console.log('recvEvtFromChild......');
  if (!param) {
    return;
  }
  let recvObj = param;

  if (recvObj.isoNatnlCd) {
    inqParam.isoNatnlCd = recvObj.isoNatnlCd;
    inqParam.natnlName = recvObj.natnlName;
  }
};
const keyUp = gbn => {
  if (gbn === '1') {
    if (inqParam.isoNatnlCd.length < 1) {
      inqParam.natnlName = '';
    }
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
          Search requirement
        </caption>
        <tbody>
          <tr>
            <th>ISO Country Code</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="inqParam.isoNatnlCd" @keyup="keyUp('1')"/>
                <button type="button" class="btn ico ico_search" @click="onClickPopup()" />
              </div>
            </td>
            <th>Country Name</th>
            <td>
              <b-form-input input type="text" v-model="inqParam.natnlName" />
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
    <div class="boardlist" >
      <b-table striped hover selectable sticky-header responsive :items="resultData.natnlCdList" :fields="fields" select-mode="single" @row-clicked="gridClick" style="height: 351px" >
        <template #cell(NO)="row">
          {{ row.index + 1 + (page - 1) * displayCnt }}
        </template>
        <template #cell(cntntDstcd)="row">
          <b-form-select
            v-model="row.item.cntntDstcd"
            v-select-mix
            :options="cntntDstcdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(primNatnlYn)="row">
          <b-form-select
            v-model="row.item.primNatnlYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(updatYmd)="row">
          <b-date-picker v-model="row.item.updatYmd" disabled/>
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
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <!-- end 실행 -->

    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Detail Contents</h2></li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
        <table>
          <tbody>
            <tr>
              <th class="req">ISO Country Code</th>
              <td><b-form-input v-model="insParam.isoNatnlCd" :disabled="tranType !== '1'" class="req"/></td>
              <th class="req">Country No(kor)</th>
              <td><b-form-input v-model="insParam.natnlCd" class="req"/></td>
              <th class="req">ISO Country No</th>
              <td><b-form-input v-model="insParam.isoNatnlNoCd" class="req"/></td>
            </tr>
            <tr>
              <th class="req">ISO Code(eng)</th>
              <td><b-form-input v-model="insParam.isoEngCd" class="req"/></td>
              <th class="req">Country Name</th>
              <td colspan="3"><b-form-input v-model="insParam.natnlName" class="req"/></td>
            </tr>
            <tr>
              <th class="req">Continent Distinction Code</th>
              <td>
                  <b-form-select v-select-mix v-model="insParam.cntntDstcd" :options="cntntDstcdList" value-field="value" text-field="name" class="req"/>
              </td>
              <th class="req">Major Country?(Y/N)</th>
              <td>
                  <b-form-select v-select-mix v-model="insParam.primNatnlYn" :options="useYns" value-field="value" text-field="name" class="req"/>
              </td>
              <th class="req">Mainly Used Currency</th>
              <td>
                <b-form-input v-model="insParam.primUseCncycd" class="req"/>
              </td>
            </tr>
            <tr>
              <th class="req">Renewal Date</th>
              <td><b-date-picker v-model:modelValue="insParam.updatYmd" class="dp_req" /></td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
