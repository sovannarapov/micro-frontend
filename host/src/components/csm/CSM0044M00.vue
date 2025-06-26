<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo } from '@/common/util/helpers';
  import dayjs from 'dayjs';

  const sessionInfo = getSessionInfo();

  // 테이블 필드명
  const fields = reactive([
    { key: 'isActive', label: '', thStyle: { width: '4%' } },
    { key: 'status', label: 'Status' },
    // { key: 'uno', label: 'User ID' },
    { key: 'dtyCd', label: 'Duty Code', thStyle: { width: '25%' } },
    { key: 'athCd', label: 'Authority Code', thStyle: { width: '25%' } },
    { key: 'sysLastPrcYms', label: 'Resist YMS' },
    { key: 'sysLastUno', label: 'Resister ID' },
  ]);

  let athCdList = reactive([]);
  let dtyCdList = reactive([]);

  onMounted(() => {
    updatedItems.splice(0);
    //메뉴콤보 조회
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

    // console.log('athCdList==>  ', dtyCdList);
  };

  const inqParam = computed(() => ({
    dtyCd: '',
  }));

  const insParam = reactive({
    DutyAthList: '',
  });

  const updatedItems = useUpdatedData('full-table0044');

  const fetchList = () => {
    if (!chkDtyCd()) {
      return false;
    }
    apiCommon.callApi(`/csm/selectListDtyAthMgt`, 'post', inqParam.value, fetchListCallback);
    updatedItems.splice(0);
  };
  const chkDtyCd = () => {
    if (inqParam.value.dtyCd == '') {
      mkErrorMessage('Missing equired value (Duty Code)');
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
    console.log('resultData.list===>>   ', resultData.list);
    useUpdateEvents({ table: '#full-table0044', data: JSON.parse(JSON.stringify(resultData.list)) });
  };

  const resultData = reactive({
    totalCnt: 0,
    list: [],
    dtyList: [],
  });

  // 테이블 클릭
  const gridClick = row => {
    Object.assign(insParam, row);
  };

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행
  const execBtn = () => {
    // console.log('updateItems==>> ', updatedItems);

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
    insParam.DutyAthList = updatedItems;
    apiCommon.callApi('/csm/insertDtyAthMgt', 'post', insParam, execBtnCallback);
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

  const removeRow = param => {
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

  const initRow = fields.reduce((init, acc) => {
    console.log('inqParam.value.dtyCd==> ', inqParam.value.dtyCd);
    init[acc.key] = '';
    init.status = 'N';
    init.isActive = true;
    init.dtyCd = '';
    init.sysLastPrcYms = dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss');
    init.sysLastUno = sessionInfo.uno;
    init.operGroupCd = '';
    return init;
  }, {});

  const addRow = () => {
    if (!chkDtyCd()) {
      return false;
    }
    initRow.dtyCd = inqParam.value.dtyCd;
    console.log('initRow: ', initRow);
    updatedItems.push(JSON.parse(JSON.stringify(initRow)));
  };

  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    setTimeout(() => {
      const oldV = updatedItems[rowIndex].status === 'N' ? '' : originalData[rowIndex].athCd;
      console.log('oldV==>>   ', oldV);
      if (updatedItems.filter(item => item.athCd === updatedItems[rowIndex].athCd).length > 1) {
        mkErrorMessage('No Allowed duplication duty code');
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
  const changeRow = () => {
    updatedItems.splice(0);
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
            <th>Duty Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.dtyCd"
                :options="dtyCdList"
                value-field="value"
                text-field="name"
                style="width: 200px"
                @change="changeRow"
                class="req"
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
    <!-- grid Page Count Start -->
    <ul class="boardlist_top">
      <li class="form_box"></li>
      <li class="form_box">
        <b-button @click="addRow">Add</b-button>
        <b-button @click="removeRow">Remove</b-button>
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
        id="full-table0044"
        :items="updatedItems"
        :fields="fields"
        select-mode="single"
        style="height: 351px"
      >
        <template #cell(isActive)="row">
          <b-form-checkbox v-model="row.item.isActive" @change="e => chkedBox(e, row.item)">&nbsp;</b-form-checkbox>
        </template>
        <template #cell(dtyCd)="row">
          <b-form-select
            v-model="row.item.dtyCd"
            v-select-mix
            :options="dtyCdList"
            value-field="value"
            text-field="name"
            readonly="true"
          >
          </b-form-select>
        </template>
        <template #cell(athCd)="row">
          <b-form-select
            v-model="row.item.athCd"
            v-select-mix
            :options="athCdList"
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
      <li class="form_box">
        <!-- <span class="text">Transaction distinction</span>
        <b-form-select v-model="tranTypeInner" :options="tranTypeList" value-field="value" text-field="name">
        </b-form-select>
        <span class="text ml10">{{ typesText }}</span> -->
      </li>
      <li>
        <button class="btn" @click="execBtn()"><span>Execute</span></button>
      </li>
    </ul>
    <!-- end 실행 -->
  </div>
  <!-- //con_area -->
</template>
