<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo } from '@/common/util/helpers';
  import dayjs from 'dayjs';

  const sessionInfo = getSessionInfo();

  const tranType = ref('1'); //거래구분
  const useYnType = ref('1');
  // const searchParam = ref('');
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
    { key: 'isActive', label: '', thStyle: { width: '4%' } },
    { key: 'status', label: 'Status' },
    // { key: 'uno', label: 'User ID' },
    { key: 'athCd', label: 'Authority Code', thStyle: { width: '20%' } },
    { key: 'dtyCd', label: 'Duty Code', thStyle: { width: '20%' } },
    { key: 'dtyAthYn', label: 'Duty Authority', thStyle: { width: '5%' } },

    { key: 'sysLastPrcssYms', label: 'Resist YMS' },
    { key: 'sysLastUno', label: 'Resister ID' },
  ]);

  let dtyCdList = reactive([]);
  let athCdList = reactive([]);

  onMounted(() => {
    //updatedItems.splice(0);

    apiCommon.callApi(`/csm/selectAllDtyCdList`, 'post', {}, fetchDtyCdListCallback);
    apiCommon.callApi(`/csm/selectAllAthCdList`, 'post', {}, fetchComboCallback);
  });
  const fetchComboCallback = returnObject => {
    // console.log('returnObject====>>>    ', returnObject);
    returnObject.resultData.list.filter(item => athCdList.push({ name: item.athName, value: item.athCd }));

    // console.log('athCdList==>  ', athCdList);
  };
  const fetchDtyCdListCallback = returnObject => {
    // console.log('returnObject====>>>    ', returnObject);
    returnObject.resultData.list.filter(item => dtyCdList.push({ name: item.dtyName, value: item.dtyCd }));

    // console.log('dtyCdList==>  ', dtyCdList);
  };

  const searchParam = reactive({
    uno: '',
  });

  const inqParam = computed(() => ({
    uno: searchParam.uno,
    includeDtyAuth: useYnType.value,
  }));

  const insParam = reactive({
    athMgtList: '',
  });

  const updatedItems = useUpdatedData('full-table0041');

  const fetchList = () => {
    if (!chkUserId()) {
      return false;
    }
    apiCommon.callApi(`/csm/selectListAthMgt`, 'post', inqParam.value, fetchListCallback);
    updatedItems.splice(0);
  };
  const chkUserId = () => {
    console.log('inqParam==>>    ', inqParam.value, insParam.value);
    if (inqParam.value.uno === '' || inqParam.value.uno === undefined) {
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
    useUpdateEvents({ table: '#full-table0041', data: resultData.list });
  };

  const resultData = reactive({
    totalCnt: 0,
    list: [],
  });

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행
  const execBtn = () => {
    // console.log('updateItems==>> ', updatedItems);
    console.log('searchParam.uno', searchParam.uno);
    if (searchParam.uno === '' || searchParam.uno===undefined) {
      mkErrorMessage('User ID should not be empty!');
      return false;
    }
    if (updatedItems.filter(item => item.athCd === '').length > 0) {
      mkErrorMessage('Please select Authority Code');
      return false;
    }

    const chkUpdatedData = updatedItems.filter(item => item.status === 'N' || item.status === 'D');
    // console.log(chkUpdatedData, ' : : ', chkUpdatedData.length);
    if (chkUpdatedData.length == 0) {
      mkErrorMessage('There is no new data');
      return false;
    }

    // console.log('updatedItems::   ', updatedItems);
    insParam.athMgtList = updatedItems;
    apiCommon.callApi('/csm/insertAthMgt', 'post', insParam, execBtnCallback);
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
      datas: { uno: searchParam.uno},
      callback: userPopupCallback,
    };
    usePopup(options);
  };
  const userPopupCallback = param => {
      //직원정보조회
      searchParam.uno = param.uno;
  };


  const removeRowUserJob = param => {
    // console.log('removeRow');
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
    init.useYn = '1';
    init.dtyAthYn = 'N';
    return init;
  }, {});
  const addRowUserJob = () => {
    if (!chkUserId()) {
      return false;
    }
    initRow.uno = searchParam.uno;
    console.log(document.querySelector('#full-table0041').scrollHeight);
    //console.log(initRow, ' : : ', searchParam.uno);
    updatedItems.push(JSON.parse(JSON.stringify(initRow)));
    setTimeout(() => {
      if (
        document.querySelector('#full-table0041').scrollHeight > document.querySelector('#full-table0041').offsetHeight
      ) {
        document
          .querySelector('#full-table0041')
          .scrollTo({ top: document.querySelector('#full-table0041').scrollHeight + 50 });
      }
    }, 500);

    // console.log(document.querySelector('#full-table0041').scrollHeight);
  };

  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    setTimeout(() => {
      const oldV = updatedItems[rowIndex].status === 'N' ? '' : originalData[rowIndex].athCd;
      console.log('oldV==>>   ', oldV, ' : ', updatedItems[rowIndex]);
      if (
        updatedItems.filter(item => item.dtyAthYn !== 'Y' && item.athCd === updatedItems[rowIndex].athCd).length > 1
      ) {
        mkErrorMessage('No Allowed duplication Authority code');
        updatedItems[rowIndex].status !== 'R'
          ? (updatedItems[rowIndex].athCd = '')
          : (updatedItems[rowIndex].athCd = oldV);
        return false;
      }
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
                <b-form-input type="text" v-model="searchParam.uno" class="req" maxLength="20" readonly="true"/>
                <button type="button" class="btn ico ico_search" @click="onClickUserPopup()" />
              </div>
            </td>
            <th>INCLUDE DUTY AUTHORITY</th>
            <td>
              <b-form-select v-select-mix v-model="useYnType" :options="useYns" value-field="value" text-field="name">
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
    <ul class="boardlist_top">
      <li class="form_box"></li>
      <li class="form_box">
        <b-button @click="addRowUserJob">Add</b-button>
        <b-button @click="removeRowUserJob">Remove</b-button>
      </li>
    </ul>

    <!-- grid Start -->
    <div class="boardlist over">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        id="full-table0041"
        :items="updatedItems"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(isActive)="row">
          <b-form-checkbox v-model="row.item.isActive" :disabled="row.item.status === 'R' && row.item.dtyAthYn === 'Y'"
            >&nbsp;</b-form-checkbox
          >
        </template>
        <template #cell(dtyCd)="row">
          <b-form-select
            v-model="row.item.dtyCd"
            v-select-mix
            readonly
            :options="dtyCdList"
            value-field="value"
            text-field="name"
          >
          </b-form-select>
        </template>
        <template #cell(athCd)="row">
          <b-form-select
            v-model="row.item.athCd"
            v-select-mix
            :readonly="row.item.status !== 'N'"
            :options="athCdList"
            value-field="value"
            text-field="name"
            @change="e => onInputChange(e, row.index)"
          >
          </b-form-select>
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (pageNo - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <!-- grid End -->
    <!-- 실행 -->

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
