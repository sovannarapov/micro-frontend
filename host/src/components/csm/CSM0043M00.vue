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
    { key: 'isActive', label: '', thStyle: { width: '4%' } },
    { key: 'status', label: 'Status' },
    // { key: 'uno', label: 'User ID' },
    { key: 'dtyCd', label: 'Duty Code', thStyle: { width: '25%' } },
    { key: 'sysLastPrcssYms', label: 'Resist YMS' },
    { key: 'sysLastUno', label: 'Resister ID' },
  ]);

  let dtyCdList = reactive([]);
  onMounted(() => {
    updatedItems.splice(0);
    //메뉴콤보 조회
    apiCommon.callApi(`/csm/selectAllDtyCdList`, 'post', {}, fetchComboCallback);
  });
  const fetchComboCallback = returnObject => {
    console.log('returnObject====>>>    ', returnObject);
    returnObject.resultData.list.filter(item => dtyCdList.push({ name: item.dtyName, value: item.dtyCd }));

    console.log('dtyCdList==>  ', dtyCdList);
  };

  const searchParam = computed(() => ({
    uno: inqParam.uno,
  }));

  const inqParam = reactive({
    uno: '',
  });

  const insParam = reactive({
    userDutyList: '',
  });

  const updatedItems = useUpdatedData('full-table0043');

  const fetchList = () => {
    if (!chkUserId()) {
      return false;
    }
    apiCommon.callApi(`/csm/selectListUserDtyMgt`, 'post', searchParam.value, fetchListCallback);
    updatedItems.splice(0);
  };
  const chkUserId = () => {
    console.log('inqParam==>  ', searchParam);
    if (searchParam.value.uno === '' || searchParam.value.uno === undefined) {
      mkErrorMessage('Missing equired value (User ID)');
      return false;
    }
    return true;
  };
  let originalData = [];
  const fetchListCallback = returnObject => {
    resultData.list = returnObject.resultData.list.map(cv => {
      return { ...cv, status: 'R' };
    });
    originalData = JSON.parse(JSON.stringify(resultData.list));
    useUpdateEvents({ table: '#full-table0043', data: resultData.list });
  };

  const resultData = reactive({
    // totalCnt: 0,
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

  // 거래 실행
  const execBtn = () => {
    // console.log('updateItems==>> ', updatedItems);

    if (!chkUserId()) {
      return false;
    }

    if (updatedItems.filter(item => item.dtyCd === '').length > 0) {
      mkErrorMessage('Please select Duty Code');
      return false;
    }

    const chkUpdatedData = updatedItems.filter(item => item.status === 'N' || item.status === 'D');
    // console.log(chkUpdatedData, ' : : ', chkUpdatedData.length);
    if (chkUpdatedData.length == 0) {
      mkErrorMessage('There is no new data');
      return false;
    }
    insParam.userDutyList = updatedItems;
    apiCommon.callApi('/csm/insertUserDtyMgt', 'post', insParam, execBtnCallback);
  };
  const mkErrorMessage = param => {
    errorMessage.value = param;
    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
    if (errorMessage.value) {
      useAlert(options);
    }
  };
  const execBtnCallback = returnObject => {
    if (returnObject.resultCd === '0000') {
      const options = {
        title: 'Success',
        contents: `Processing has been completed.`,
        callback: fetchList,
      };
      useAlert(options);
    }
  };

  const onClickUserPopup = () => {
    const options = {
      title: 'Inquire User',
      width: 1100,
      height: 700,
      component: 'CSM0001P01',
      datas: { uno: inqParam.uno},
      callback: userPopupCallback,
    };
    usePopup(options);
  };
  const userPopupCallback = param => {
      //직원정보조회
      inqParam.uno = param.uno;
  };

  const removeRowUserJob = param => {
    console.log('removeRow');
    const removed = updatedItems
      .map(item =>
        item.isActive && item.status !== 'N'
          ? { ...item, isActive: false, status: 'D', _rowVariant: 'disabled' }
          : item,
      )
      .filter(item => (!item.isActive && item.status !== 'N') || (!item.isActive && item.status === 'N'));

    updatedItems.splice(0);
    Object.assign(updatedItems, removed);
  };
  let comboTableDataList = [];
  const initRow = fields.reduce((init, acc) => {
    init[acc.key] = '';
    init.status = 'N';
    init.uno = '';
    init.isActive = true;
    init.sysLastPrcssYms = dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss');
    init.sysLastUno = sessionInfo.uno;
    return init;
  }, {});
  const addRowUserJob = () => {
    if (!chkUserId()) {
      return false;
    }

    initRow.uno = inqParam.uno;
    console.log('0043.initRow: ', initRow);
    updatedItems.push(JSON.parse(JSON.stringify(initRow)));
  };

  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    setTimeout(() => {
      const oldV = updatedItems[rowIndex].status === 'N' ? '' : originalData[rowIndex].dtyCd;
      console.log('oldV==>>   ', oldV);
      if (updatedItems.filter(item => item.dtyCd === updatedItems[rowIndex].dtyCd).length > 1) {
        mkErrorMessage('No Allowed duplication duty code');
        updatedItems[rowIndex].status !== 'R'
          ? (updatedItems[rowIndex].dtyCd = '')
          : (updatedItems[rowIndex].dtyCd = oldV);
        return false;
      }

      updatedItems[rowIndex].oldDtyCd = oldV;
    }, 0);
  };

  const chkedBox = (e, item) => {
    console.log(e, ' : ', item);
  };
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
              <div class="form_box">
                <b-form-input type="text" v-model="inqParam.uno" class="req" maxLength="20" readonly="true" />
                <button type="button" class="btn ico ico_search" @click="onClickUserPopup()" />
              </div>
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
    <!-- grid Page Count Start -->
    <ul class="boardlist_top">
      <li class="form_box"></li>
      <li class="form_box">
        <b-button @click="addRowUserJob">Add</b-button>
        <b-button @click="removeRowUserJob">Remove</b-button>
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
        id="full-table0043"
        :items="updatedItems"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(isActive)="row">
          <b-form-checkbox v-model="row.item.isActive">&nbsp;</b-form-checkbox>
        </template>
        <template #cell(dtyCd)="row">
          <b-form-select
            v-model="row.item.dtyCd"
            v-select-mix
            :options="dtyCdList"
            value-field="value"
            text-field="name"
            :readonly="row.item.status !== 'N'"
            @change="e => onInputChange(e, row.index)"
          >
          </b-form-select>
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <!-- grid End -->

    <!-- grid Paging Start -->

    <!-- grid Paging End -->

    <!-- 실행 -->
    <!-- <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    /> -->
    <ul class="notiarea flex_row jc_sb">
      <li class="form_box"></li>
      <li>
        <button class="btn" @click="execBtn()"><span>Execute</span></button>
      </li>
    </ul>
    <!-- end 실행 -->
  </div>
  <!-- //con_area -->
</template>
