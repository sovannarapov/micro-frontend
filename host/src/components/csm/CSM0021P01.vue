<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';

const props = defineProps({
  datas: {
    type: Object,
    default: () => {},
  },
});
// 레이어팝업 emit event
const emit = defineEmits(['popup-emit', 'popup-emit2']);
onMounted(() => {
  resultData.totalCnt = 0;
  resultData.natnlCdList = [];
  console.log('components mounted', props.datas);
});
onUnmounted(() => {
  resultData.totalCnt = 0;
  resultData.natnlCdList = [];
  console.log('components unmounted', resultData);
});
//부점조회

// input form
const inqParam = computed(() => ({
  isoNatnlCd: insParam.isoNatnlCd,
  isoNatnlNoCd: insParam.isoNatnlNoCd,
  natnlName: insParam.natnlName,
  displayCnt: displayCnt.value,
  dmndCnt: page.value,
}));
// 조회 파라미터
const insParam = reactive({
  isoNatnlCd: '',
  isoNatnlNoCd: '',
  natnlName: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'isoNatnlCd', label: 'ISO Country Code', class: 'text-left' },
  { key: 'natnlCd', label: 'Country Code', class: 'text-left' },
  { key: 'isoNatnlNoCd', label: 'ISO Country No. Code' },
  { key: 'isoEngCd', label: 'ISO Code(eng)' },
  { key: 'natnlName', label: 'Country Name' },
  { key: 'cntntDstcd', label: 'Continent Distinction Code' },
  { key: 'primUseCncycd', label: 'Mainly Used Currency' },
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
  apiCommon.callApi(`/csm/selectListNatnlCdMgt`, 'post', inqParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.natnlCdList = returnObject.resultData.natnlCdList;
};

const resultData = reactive({
  totalCnt: 0,
  natnlCdList: [],
});

// 테이블 클릭
const gridClick = items => {
  let sendData = {
    isoNatnlCd: items.isoNatnlCd,
    natnlCd: items.natnlCd,
    natnlName: items.natnlName,
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
            <th>ISO Country Code</th>
            <td>
              <b-form-input type="text" v-model="insParam.isoNatnlCd" style="width: 100px"/>
            </td>
            <th>ISO Code(eng)</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="insParam.isoEngCd" style="width: 100px" />
              </div>
            </td>
            <th>Country Name</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="insParam.natnlName" style="width: 100px" />
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
      <b-table striped hover selectable sticky-header responsive :items="resultData.natnlCdList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 351px">
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
