<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo } from '@/common/util/helpers';
  import dayjs from 'dayjs';

  const sessionInfo = getSessionInfo();

  const tranType = ref('1'); //거래구분
  const tranTypeList = reactive([
    { name: 'Register', value: '1' },
    { name: 'Modify', value: '2' },
    { name: 'Delete', value: '3' },
  ]);
  const changeTranType = param => {
    tranType.value = param;
  };

  // 테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'uno', label: 'User Id' },
    { key: 'aldtUno', label: 'Alternative User Id' },
    { key: 'aldtStartYmd', label: 'Start Date' },
    { key: 'aldtEndYmd', label: 'End Date' },
    { key: 'aldtResnDstcd', label: 'Reason' },
    { key: 'stusDtscd', label: 'Status' },
    { key: 'rmark', label: 'Remark' },
    // { key: 'sysLastPrcssYms', label: 'Resist YMS' },
    // { key: 'sysLastUno', label: 'Resister ID' },
  ]);

  const useYns = reactive([
    { name: 'Y', value: '1' },
    { name: 'N', value: '0' },
  ]);

  const responseData = reactive({
    totalCnt: 0,
    list: [],
  });

  const inqParam = computed(() => ({
    uno: '',
    aldtUno: '',
    aldtStartYmd: '',
    aldtEndYmd: '',
    stusDtscd: '',
  }));

  const insData = reactive({
    uno: '',
    aldtUno: '',
    aldtResnDstcd: '',
    aldtStartYmd: '',
    aldtEndYmd: '',
    stusDtscd: '',
    rmark: '',
  });
  const insParam = reactive({
    uno: '',
    aldtUno: '',
    aldtResnDstcd: '',
    aldtStartYmd: '',
    aldtEndYmd: '',
    stusDtscd: '',
    rmark: '',
    aldtTranSerno: '',
  });

  const fetchList = () => {
    apiCommon.callApi(`/csm/selectListAldtMgt`, 'post', inqParam.value, fetchListCallback);
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
    const { uno, aldtUno, aldtStartYmd, aldtEndYmd, stusDtscd, aldtResnDstcd, rmark } = insParam;

    if (uno === '') errorMessage.value = 'Missing equired value (User Id)';
    if (aldtUno === '') errorMessage.value = 'Missing equired value (Alternative User Id)';
    if (aldtStartYmd === '') errorMessage.value = 'Missing equired value (Period Start date)';
    if (aldtEndYmd === '') errorMessage.value = 'Missing equired value (Period End Date)';
    if (stusDtscd === '') errorMessage.value = 'Missing equired value (Status)';
    if (aldtResnDstcd === '') errorMessage.value = 'Missing equired value (Reason)';
    if (rmark === '') errorMessage.value = 'Missing equired value (Remark)';

    if (uno === aldtUno) errorMessage.value = 'User ID cannot be same with alternative user id';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertAldtMgt', 'updateAldtMgt', 'deleteAldtMgt'];
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
        contents: `${tranType.value === '1' ? 'Registration' : tranType.value === '2' ? 'Modification' : 'deletion'} was successful.`,
        callback: fetchList,
      };
      useAlert(options);
    }
  };

  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    console.log(key, ' : ', rowIndex);
  };
  const useStatus = reactive([
    { value: '1', name: 'Regist' },
    { value: '0', name: 'Cancel' },
  ]);
  const aldtResnDsctcdList = reactive([
    { value: '1', name: 'Vacation' },
    { value: '2', name: 'Business Education' },
    { value: '3', name: 'Dispatch for Business' },
    { value: '4', name: 'Leave of absence' },
    { value: '5', name: 'Resign' },
    { value: 'D', name: 'Morning Off' },
    { value: 'E', name: 'Afternoon Off' },
  ]);
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
            <th>User Id</th>
            <td>
              <b-form-input type="text" v-model="inqParam.uno" maxLength="20" />
            </td>
            <th>Alternative User Id</th>
            <td>
              <b-form-input type="text" v-model="inqParam.aldtUno" maxLength="20" />
            </td>
            <th>Period:</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model:modelValue="inqParam.aldtStartYmd" />
                <span>~</span>
                <b-date-picker v-model:modelValue="inqParam.aldtEndYmd" />
              </div>
            </td>
            <th>Status</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.stusDtscd"
                :options="useStatus"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area oneline">
      <button type="button" class="btn btn_primary" @click="fetchList()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea End -->
  <div class="con_area">
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
        <template #cell(isActive)="row">
          <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
        </template>
        <template #cell(aldtStartYmd)="row">
          <b-date-picker v-model="row.item.aldtStartYmd" dateFormat="ddMMyyyy" readonly="true" />
        </template>
        <template #cell(aldtEndYmd)="row">
          <b-date-picker v-model="row.item.aldtEndYmd" dateFormat="ddMMyyyy" readonly />
        </template>
        <template #cell(aldtResnDstcd)="row">
          <b-form-select
            v-model="row.item.aldtResnDstcd"
            v-select-mix
            :options="aldtResnDsctcdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(stusDtscd)="row">
          <b-form-select
            v-model="row.item.stusDtscd"
            v-select-mix
            :options="useStatus"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(NO)="row">{{ row.index + 1 }}</template>
      </b-table>
    </div>
    <!-- grid End -->
    <!-- 실행 -->
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <div class="boxarea">
      <ul class="title_area sub">
        <li>
          <h2>Detail Contents</h2>
        </li>
      </ul>
      <div v-bind:class="[{ boardwrite: true }, { disabled: tranType === '3' }]">
        <table>
          <tbody>
            <tr>
              <th class="req">User Id</th>
              <td>
                <b-form-input v-model="insParam.uno" />
              </td>
              <th class="req">Period</th>
              <td>
                <div class="form_box">
                  <b-date-picker v-model:modelValue="insParam.aldtStartYmd" class="dp_req" />
                  <span class="text">~</span>
                  <b-date-picker
                    v-model:modelValue="insParam.aldtEndYmd"
                    class="dp_req"
                    :minDate="insParam.aldtStartYmd"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th class="req">Alternative User Id</th>
              <td>
                <b-form-input v-model="insParam.aldtUno" />
              </td>
              <th class="req">Reason</th>
              <td>
                <b-form-select
                  v-model="insParam.aldtResnDstcd"
                  v-select-mix
                  :options="aldtResnDsctcdList"
                  value-field="value"
                  text-field="name"
                />
              </td>
            </tr>
            <tr>
              <th class="req">Status</th>
              <td>
                <b-form-select
                  v-model="insParam.stusDtscd"
                  v-select-mix
                  :options="useStatus"
                  value-field="value"
                  text-field="name"
                />
              </td>
              <th class="req">Remark</th>
              <td><b-form-input v-model="insParam.rmark" maxlength="250" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- end 실행 -->
  </div>
  <!-- //con_area -->
</template>
