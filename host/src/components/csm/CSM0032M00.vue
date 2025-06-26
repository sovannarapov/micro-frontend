<script setup>
// util 스크립트 import
import apiCommon from '@/common/apiCommon.js';

const tranType = ref('1'); //거래구분
const tranTypeList = reactive([
  { name: 'Register', value: '1' },
  { name: 'Modify', value: '2' },
  { name: 'Delete', value: '3' },
]);
const changeTranType = param => {
  tranType.value = param;
};

const layerType = ref('1');
const layerComp = ref('');
const layerTitle = ref('');
const popupCallback = param => {
  console.log('popupCallback', param);
  if (layerType.value === '1') {
    recvEvtFromChild(param);
  } else if (layerType.value === '2') {
    recvEmpEvtFromChild(param);
  } else if (layerType.value === '3') {
    recvAdUserEvtFromChild(param);
  } 
};
const onClickPopup = () => {
  const options = {
    title: layerTitle,
    width: 1100,
    height: 650,
    component: layerComp,
    datas: { empid: inqParam.empid, brncd: inqParam.brncd, hiddenPopupYn: '1' },
    callback: popupCallback,
  };
  usePopup(options);
};

const searchParam = computed(() => ({
  brncd: inqParam.brncd, //부점코드
  empid: inqParam.empid, //사용자ID
  employeeID : inqParam.employeeID, //직원번호
  displayCnt: displayCnt.value, // 화면display수
  dmndCnt: page.value, // 요청쪽수
}));

const inqParam = reactive({
  brncd: '', //부점코드
  brnName: '',
  empid: '', //사용자ID
  emnm: '', //직원명
  employeeID : '', //직원번호
});
// 조회 파라미터
const insParam = reactive({
  brncd: '',
  brnName: '',
  empid: '',
  emnm: '',
  employeeID: '',
});

// 테이블 필드명
const fields = reactive([
  'NO',
  { key: 'empid', label: 'User ID' },
  { key: 'employeeID', label: 'Employee ID' },
  { key: 'emnm', label: 'Employee Name' },
  { key: 'brncd', label: 'Branch Code' },
  { key: 'brnName', label: 'Branch Name' },
  
]);
// 테이블 row 수
const displayCnt = ref(10);
let branchSearchPopup = '';
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
  apiCommon.callApi(`/csm/selectListEmpInfoInq`, 'post', searchParam.value, fetchListCallback);
};

const fetchListCallback = returnObject => {
  resultData.totalCnt = returnObject.resultData.totalCnt;
  resultData.empInfoInqList = returnObject.resultData.empInfoInqList;
};

const resultData = reactive({
  totalCnt: 0,
  empInfoInqList: [],
});

const openBrnPopup = gbn => {
  if (gbn === '1') {
    layerType.value = gbn;
    layerComp.value = 'CSM0031P01';
    layerTitle.value = 'Search Branch';

    onClickPopup();
  }
};
const openEmpPopup = gbn => {
  if (gbn === '2') {
    layerType.value = gbn;
    layerComp.value = 'CSM0032P01';
    layerTitle.value = 'Inquire Employee';

    onClickPopup();
  }
};

const openAdUserPopup = gbn => {
  if (gbn === '3') {
    layerType.value = gbn;
    layerComp.value = 'CSM0032P02';
    layerTitle.value = 'Inquire AD User';

    onClickPopup();
  }
};

const recvEvtFromChild = evt => {
  console.log('recvEvtFromChild......');
  // console.log(evt.data);
  if (!evt) {
    return;
  }
  if (evt.brncd) {
    inqParam.brncd = evt.brncd;
  }
  if (evt.brnName) {
    inqParam.brnName = evt.brnName;
  }
};
const recvEmpEvtFromChild = evt => {
  console.log('recvEmpEvtFromChild......');
  // console.log(evt.data);

  if (!evt) {
    return;
  }
  // let recvObj = JSON.parse(evt);

  if (evt.empid) {
    inqParam.empid = evt.empid;
  }
  if (evt.emnm) {
    inqParam.emnm = evt.emnm;
  }
  if (evt.employeeID) {
    inqParam.employeeID = evt.employeeID;
  }
};
const recvAdUserEvtFromChild = evt => {
  console.log('recvAdUserEvtFromChild......');
  // console.log(evt.data);

  if (!evt) {
    return;
  }
  // let recvObj = JSON.parse(evt);
  insParam.empid='';
  insParam.emnm='';
  insParam.employeeID='';
  insParam.brncd='';
  if (evt.empid) {
    insParam.empid = evt.empid;
  }
  if (evt.emnm) {
    insParam.emnm = evt.emnm;
  }
  if (evt.employeeID) {
    insParam.employeeID = evt.employeeID;
  }
  if (evt.brncd) {
    insParam.brncd = evt.brncd;
  }
};


const keyUp = gbn => {
  if (gbn === '1' && inqParam.brncd.length < 3) {
    // brancd Code
    inqParam.brnName = '';
  } else if (gbn === '2' && inqParam.empid.length < 6) {
    inqParam.emnm = '';
    inqParam.employeeID = '';
  }
};

// 테이블 클릭
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
    const { empid, emnm, brncd, employeeID } = insParam;
    if (empid === '') errorMessage.value = 'Please enter the (User ID)';
    if (emnm === '') errorMessage.value = 'Please enter the (User Name)';
    if (brncd === '') errorMessage.value = 'Please enter the (Branch Code)';
    if (employeeID === '') errorMessage.value = 'Please enter the (Employee ID)';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

// 거래 실행
  const execBtn = () => {
    const exeUris = ['insertEmpInfo', 'updateEmpInfo', 'deleteEmpInfo'];
    const uri = exeUris[parseInt(tranType.value) - 1];
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
              <div class="form_box">
                <b-form-input v-model="inqParam.brncd" maxlength="3" @keyup="keyUp('1')" />
                <button type="button" class="btn ico ico_search" @click="openBrnPopup('1')" />
                <b-form-input v-model="inqParam.brnName" readonly="true" />
              </div>
            </td>
            <th>User ID</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="inqParam.empid" maxlength="20" @keyup="keyUp('2')" />
                <button type="button" class="btn ico ico_search" @click="openEmpPopup('2')" />
                <b-form-input v-model="inqParam.emnm" readonly="true" />
              </div>
            </td>
            <th>Employee ID</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="inqParam.employeeID" maxlength="5"/>
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
        :items="resultData.empInfoInqList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
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
    <!-- 실행 -->
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <!-- end 실행 -->

    <!-- input Start -->
    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Detail Content</h2></li>
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
              <th class="req">User ID</th>
              <td>
                <div class="form_box">
                  <b-form-input type="text" v-model="insParam.empid" disabled="true" class="req" maxlength="20" />
                  <button type="button" class="btn ico ico_search" @click="openAdUserPopup('3')" />
                </div>
              </td>
              <th class="req">Employee ID</th>
              <td>
                <b-form-input type="text" v-model="insParam.employeeID" class="req" maxlength="5" />
              </td>
              <th class="req">User Name</th>
              <td>
                <b-form-input type="text" v-model="insParam.emnm" class="req"  />
              </td>
            </tr>
            <tr>
              <th class="req">Branch Code</th>
              <td>
                <b-form-input type="text" v-model="insParam.brncd" class="req" maxlength="3"  />
              </td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
