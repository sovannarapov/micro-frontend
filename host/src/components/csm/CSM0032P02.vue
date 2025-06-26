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
const emit = defineEmits(['popup-emit']);
onMounted(() => {
  resultData.totalCnt = 0;
  resultData.adUserInfoList = [];
  insParam.empid = props.datas.empid;
});

// input form
const inqParam = computed(() => ({
  empid: insParam.empid, //사용자ID 
  employeeID: insParam.employeeID, //직원번호
  brncd: insParam.brncd, //부점코드
}));
// 조회 파라미터
const insParam = reactive({
  empid: '',
  employeeID: '',
  brncd : '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'empid', label: 'User ID' },
  { key: 'employeeID', label: 'Employee ID' },
  { key: 'emnm', label: 'Employee NAME' },
  { key: 'brncd', label: 'Branch Code' },
  { key: 'userRegiYn', label: 'User registered(Y/N)' },
  { key: 'employeeRegiYn', label: 'Employee registered(Y/N)' },
]);

const fetchList = () => {
  const validate = validateExe();
  if (validate) {
    apiCommon.callApi(`/csm/selectListAdUser`, 'post', inqParam.value, fetchListCallback);
  }
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.adUserInfoList = returnObject.resultData.adUserInfoList;
  updateTableProperties();
};

const resultData = reactive({
  totalCnt: 0,
  adUserInfoList: [],
});

const updateTableProperties = () => {
  for (const [index, item] of resultData.adUserInfoList.entries()) {
    // level1 값이 5 이상일 경우 warning, 이하일 경우 info class 적용
    item.userRegiYn ==='N'
      ? (item._cellVariants = { ...item._cellVariants, userRegiYn: 'warning' }):'';

    item.employeeRegiYn ==='N'
      ? (item._cellVariants = { ...item._cellVariants, employeeRegiYn: 'warning' }):'';
  }
};

const errorMessage = ref('');
const clearMessage = () => {
  errorMessage.value = '';
};

// 거래 실행 전 유효성 검사
const validateExe = () => {
  const { empid, employeeID, brncd } = inqParam.value;

  if(empid === '' && employeeID === '' && brncd === '' ) errorMessage.value = 'Please enter one of (Branch Code) or (Employee ID) or (USER ID).';
  const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

  if (errorMessage.value) {
    useAlert(options);
    return false;
  }
  return true;
};

// 테이블 클릭
const gridClick = items => {
  console.log('gridClick--->> ', items, ' : ', items.emnm);

  let sendData = {
    empid: items.empid == null ? '' : items.empid,
    emnm: items.emnm == null ? '' : items.emnm,
    brncd: items.brncd == null ? '' : items.brncd,
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
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area">
      <button type="button" class="btn btn_primary" @click="fetchList()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea -->

  <div class="con_area">
    <ul class="boardlist_top">
      <li class="form_box">
        <p class="text">
          Total <span>{{ !resultData.totalCnt ? 0 : resultData.totalCnt }}</span>
        </p>
      </li>
    </ul>
    <div class="boardlist">
      <b-table striped hover selectable sticky-header responsive :items="resultData.adUserInfoList" :fields="fields" select-mode="single" @row-dbl-clicked="gridClick" style="height: 351px">
        <template #cell(NO)="row">{{ row.index + 1 }}</template>
      </b-table>
    </div>
  </div>
  <!-- //con_area -->
</template>
