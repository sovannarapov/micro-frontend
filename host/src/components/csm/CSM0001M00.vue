<script setup>
  import apiCommon from '@/common/apiCommon.js';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';

  const tranType = ref('1'); //거래구분
  const tranTypeList = reactive([
    { name: 'Register', value: '1' },
    { name: 'Modify', value: '2' },
    { name: 'Delete', value: '3' },
  ]);
  const changeTranType = param => {
    tranType.value = param;
  };

  const useYns = reactive([
    { value: '1', name: 'Y' },
    { value: '0', name: 'N' },
  ]);

  // 테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'uno', label: 'User ID' },
    { key: 'userName', label: 'User Name' },
    { key: 'brnCode', label: 'Branch Code' },
    { key: 'langDstcd', label: 'Language Distinction' },
    { key: 'rmYn', label: 'RM(Y/N)' },
    { key: 'multiBrncd', label: 'Multi Branch list' },
    { key: 'regBrncdList', label: 'Regional Branch List' },
    { key: 'useYn', label: 'Used(Y/N)' },
  ]);

  const pageCnt = ref('10');
  const pageNo = ref(1);
  const pageCntList = reactive([
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);

  const responseData = reactive({
    totalCnt: 0,
    list: [],
  });

  const searchParam = computed(() => ({
    uno: inqParam.uno,
    pageCnt: pageCnt.value,
    pageNo: pageNo.value,
  }));

  const inqParam = reactive({
    uno: '',
  });

  const insParam = reactive({
    uno: '',
    userName: '',
    pwd: '',
    brnCode: '',
    langDstcd: '',
    rmYn: '',
    multiBrncd: '',
    regBrncdList:'',
    useYn: '',
  });

  const langDstcdList = getComCodes('CSM000008');

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

  const pageSearch = () => {
    pageNo.value == 1 ? fetchList() : (pageNo.value = 1);
  };

  const fetchList = () => {
    apiCommon.callApi(`/csm/selectListUserMgt`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.list = returnObject.resultData.list;
  };

  const resultData = reactive({
    totalCnt: 0,
    list: [],
  });

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
    const { uno, userName, pwd, brnCode, langDstcd, useYn } = insParam;

    if (uno === '') errorMessage.value = 'Please enter the (User ID)';
    if (userName === '') errorMessage.value = 'Please enter the (User Name)';
    if (pwd === '') errorMessage.value = 'Please enter the (Password)';
    if (brnCode === '') errorMessage.value = 'Please enter the (Branch Code)';
    if (langDstcd === '') errorMessage.value = 'Please enter the (Language Distinction)';
    if (useYn === '') errorMessage.value = 'Please enter the (Used(Y/N))';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertUserMgt', 'updateUserMgt', 'deleteUserMgt'];
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

  watch(
    () => insParam.rmYn
    , (newValue, oldValue) => {
      if(newValue==="1"){
        insParam.multiBrncd = "";
      }else{
        insParam.regBrncdList = "";
      }
    }
  );

  onActivated(() => {
    const fromTab = useDetectTab();
    console.log('tab클릭으로 열렸는지 확인 : ', fromTab);
  });
</script>
<template>
  <!-- searchArea Start -->
  <div class="search_area">
    <fieldset>
      <legend></legend>
      <table>
        <caption>
          Search Condition
        </caption>
        <tbody>
          <tr>
            <th>User ID</th>
            <td>
              <b-form-input type="text" v-model="inqParam.uno" maxLength="20" style="width: 250px" />
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area tar oneline">
      <button type="button" class="btn btn_primary" @click="pageSearch()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea End -->
  <div class="con_area">
    <!-- grid Page Count Start -->
    <ul class="boardlist_top">
      <li class="form_box">
        <p class="text">
          Total <span>{{ !resultData.totalCnt ? 0 : resultData.totalCnt }}</span>
        </p>
        <span class="text">show</span>
        <b-form-select v-model="pageCnt" :options="pageCntList" value-field="value" text-field="name"> </b-form-select>
      </li>
    </ul>

    <!-- grid Page Count End -->
    <!-- grid Start -->
    <div class="boardlist over">
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
        style="height: 351px"
        >
        <template #cell(rmYn)="row">
          <b-form-select v-model="row.item.rmYn" v-select-mix :options="useYns" readonly value-field="value" text-field="name" />
        </template>
        <template #cell(useYn)="row">
          <b-form-select v-model="row.item.useYn" v-select-mix :options="useYns" readonly value-field="value" text-field="name" />
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <!-- grid End -->
    <!-- grid Paging Start -->
    <b-pagination
      v-model="pageNo"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(pageCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>
    <!-- grid Paging End -->
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
                <b-form-input type="text" v-model="insParam.uno" :disabled="tranType !== '1'" class="req" maxlength="20" />
              </td>
              <th class="req">User Name</th>
              <td>
                <b-form-input type="text" v-model="insParam.userName" class="req" />
              </td>
              <th class="req">Password</th>
              <td>
                <b-form-input type="text" v-model="insParam.pwd" class="req" />
              </td>
            </tr>
            <tr>
              <th class="req">Branch Code</th>
              <td>
                <b-form-input type="text" v-model="insParam.brnCode" class="req" maxlength="3" />
              </td>
              <th class="req">Language Distinction Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.langDstcd"
                  :options="langDstcdList"
                  value-field="value"
                  text-field="name"
                  class="req" />
              </td>
              <th class="req">Used(Y/N)</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.useYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
            </tr>
            <tr>
              <th>RM(Y/N)</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insParam.rmYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                />
              </td>
              <th>Multi Branch List</th>
              <td colspan="3">
                <b-form-input type="text" v-model="insParam.multiBrncd" :readonly="insParam.rmYn==='1'" />
              </td>
            </tr>
            <tr>
              <th>Regional Branch List</th>
              <td colspan="5">
                <b-form-input type="text" v-model="insParam.regBrncdList" readonly=true />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
