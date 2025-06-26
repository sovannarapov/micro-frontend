<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo, generateOZparam } from '@/common/util/helpers';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';
  import dayjs from 'dayjs';

  const sessionInfo = getSessionInfo();
  const bzwkList = getComCodes('CSM000001');
  const bzwkDtailList = getComCodes('CSM000002');
  const chnlList = getComCodes('CSM000006');
  const useYns = getComCodes('CSM000007');
  // 테이블 필드명
  const leftFields = reactive([
    { key: 'isActive', label: 'Active' , stickyColumn: true},
    { key: 'apiPath', label: 'API Path' , stickyColumn: true},
    { key: 'tranName', label: 'API Name' },
    { key: 'menuPath', label: 'Menu Path' },
    { key: 'screnNo', label: 'Screen No' },
  ]);
  const rightFields = reactive([
    { key: 'isActive', label: 'Active' },
    { key: 'status', label: 'Status' },
    { key: 'apiPath', label: 'API Path' },
    { key: 'tranName', label: 'API Name' },
  ]);

  onMounted(() => {
    // updatedItems.splice(0);
    apiCommon.callApi(`/csm/selectAllAthCdList`, 'post', {}, fetchComboCallback);
  });
  let athCdList = reactive([]);
  const fetchComboCallback = returnObject => {
    console.log('returnObject====>>>    ', returnObject);
    returnObject.resultData.list.filter(item => athCdList.push({ name: item.athName, value: item.athCd }));

    console.log('athCdList==>  ', athCdList);
  };
  const mkErrorMessage = param => {
    errorMessage.value = param;
    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
    if (errorMessage.value) {
      useAlert(options);
    }
  };
  const chkParams = () => {
    if (inqParam.athCd == '' || inqParam.bzwkDstcd == '') {
      mkErrorMessage('Missing equired value (Authority Code or Business Distinction Code)');
      return false;
    }
    return true;
  };
  const fetchList = () => {
    if (!chkParams()) {
      return false;
    }

    apiCommon.callApi(`/csm/selectListTranAthMgt`, 'post', inqParam, fetchListCallback);
    apiCommon.callApi(`/csm/selectAllTranMgtList`, 'post', inqParam, fetchTranListCallback);

    updatedItems.splice(0);
  };
  let originalData = [];
  const fetchListCallback = returnObject => {
    resultData.list = returnObject.resultData.list.map(cv => {
      return { ...cv, status: 'R' };
    });
    originalData = JSON.parse(JSON.stringify(resultData.list));
    useUpdateEvents({ table: '#full-table0045', data: resultData.list });
  };
  const fetchTranListCallback = returnObject => {
    const subList = returnObject.resultData.subList;
    const mkList = [];
    subList.forEach(item => {
      returnObject.resultData.tranList.forEach(inner => {
        if (inner.apiPath === item.apiPath) {
          mkList.push(item.apiPath);
        }
      });
    });

    resultData.tranList = returnObject.resultData.tranList;
    mkList.forEach(it => {
      resultData.tranList = resultData.tranList.filter(item => item.apiPath !== it);
    });


    useFixedColumn(resultData, 'grid1', 'left');  //조회 콜백함수에  useFixedColumn 함수 선언 
  };
  const updatedItems = useUpdatedData('full-table0045');
  const resultData = reactive({
    list: [],
    tranList: [],
  });

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  const responseData = reactive({
    totalCnt: 0,
    list: [],
  });

  const inqParam = reactive({
    athCd: '',
    bzwkDstcd: '',
    bzwkDtailDstcd: '',
  });

  const insParam = reactive({
    apiList: '',
  });

  const inqBzwkDtailList = computed(() => {
    let list = [];
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === inqParam.bzwkDstcd);
    // console.log('inq bzwkDtailList: ', bzwkDtailList);

    return list;
  });
  const insBzwkDtailList = computed(() => {
    let list = [];
    // console.log('ins bzwkDtailList: ', bzwkDtailList);
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === insParam.bzwkDstcd);
    return list;
  });

  // 거래 실행
  const execBtn = () => {
    if (!chkParams()) {
      return false;
    }
    const chkUpdatedData = updatedItems.filter(item => item.status === 'N' || item.status === 'D');
    // console.log(chkUpdatedData, ' : : ', chkUpdatedData.length);
    if (chkUpdatedData.length == 0) {
      mkErrorMessage('There is no new data');
      return false;
    }

    insParam.apiList = updatedItems;
    apiCommon.callApi('/csm/insertTranAthMgt', 'post', insParam, execBtnCallback);
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
    const addToLeft = updatedItems.filter(item => item.isActive && item.status === 'N');
    const removed = updatedItems
      .map(item =>
        item.isActive && item.status !== 'N'
          ? { ...item, isActive: false, status: 'D', _rowVariant: 'disabled' }
          : item,
      )
      .filter(item => (!item.isActive && item.status !== 'N') || (!item.isActive && item.status === 'N'));

    addToLeft.map(item => {
      resultData.tranList.push(item);
    });
    console.log('resultData:   ', resultData.tranList);
    updatedItems.splice(0);
    Object.assign(updatedItems, removed);
  };

  const addRow = () => {
    console.log(
      'row list =>',
      resultData.tranList,
      resultData.tranList.filter(item => item.isActive),
    );

    if (resultData.tranList.filter(item => item.isActive).length == 0) {
      mkErrorMessage('Please choose at least one api');
      return false;
    }
    if (!chkParams()) {
      return false;
    }

    resultData.tranList.map(item => {
      if (item.isActive) {
        updatedItems.push(JSON.parse(JSON.stringify({ ...item, status: 'N', athCd: inqParam.athCd })));
        resultData.tranList = resultData.tranList.filter(tem => !tem.isActive);
      }
    });
  };
  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    console.log(key, ' : ', rowIndex);
  };
  const checkAll = computed({
    get() {
      for (const item of updatedItems) {
        if (!item.isActive) return false;
      }
      return true;
    },
    set(value) {
      for (const item of updatedItems) {
        item.isActive = value;
      }
    },
  });

  const checkAllThead = computed({
    get() {
      for (const item of resultData.tranList) {
        if (!item.isActive) return false;
      }
      return true;
    },
    set(value) {
      for (const item of resultData.tranList) {
        item.isActive = value;
      }
    },
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
            <th>Authority Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.athCd"
                :options="athCdList"
                value-field="value"
                text-field="name"
                class="req"
              >
              </b-form-select>
            </td>
          </tr>
          <tr>
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
                class="req"
              >
              </b-form-select>
            </td>
            <th>Business Detail Distinction Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.bzwkDtailDstcd"
                :options="inqBzwkDtailList"
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
    <div class="flex_row">
      <div class="col wper50">
        <!-- grid Page Count Start -->
        <ul class="title_area sub">
          <li>
            <h2>List of all API</h2>
            <!-- <div>
              <b-form-checkbox v-model="checkAllThead">check all</b-form-checkbox>
            </div> -->
          </li>
          <li>
            <b-button @click="addRow">Add</b-button>
          </li>
        </ul>
        <!-- grid Page Count End -->

        <div class="boardlist over complex-head">
          <b-table
            id="grid1" 
            striped
            hover
            selectable
            sticky-header
            responsive
            :items="resultData.tranList"
            :fields="leftFields"
            select-mode="single"
            style="height: 351px"
          >
            <template #thead-top>
              <b-tr>
                <b-th class="inline-text"><b-form-checkbox v-model="checkAllThead">&nbsp;</b-form-checkbox><span>Active</span></b-th>
                <b-th>API Path</b-th>
                <b-th>API Name</b-th>
                <b-th>Menu Path</b-th>
                <b-th>Screen No</b-th>
              </b-tr>
            </template>
            <template #cell(isActive)="row">
              <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
            </template>
          </b-table>
        </div>
      </div>
      <div class="col wper50">
        <!-- grid Page Count Start -->
        <ul class="title_area sub">
          <li>
            <h2>Allowed list</h2>
          </li>
          <li>
            <b-button @click="removeRow">Remove</b-button>
          </li>
        </ul>
        <!-- grid Page Count End -->
        <div class="boardlist over complex-head">
          <b-table
            striped
            hover
            selectable
            sticky-header
            responsive
            :items="updatedItems"
            :fields="rightFields"
            select-mode="single"
            id="full-table0045"
            style="height: 351px"
          >
            <template #thead-top>
              <b-tr>
                <b-th class="inline-text"
                  ><b-form-checkbox v-model="checkAll">&nbsp;</b-form-checkbox><span>Active</span></b-th
                >
                <b-th>Status</b-th>
                <b-th>API Path</b-th>
                <b-th>API Name</b-th>
              </b-tr>
            </template>
            <template #cell(isActive)="row">
              <b-form-checkbox v-model="row.item.isActive"> &nbsp;</b-form-checkbox>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <!-- grid End -->

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
<style lang="scss" scoped>
  .boardlist {
    :deep(.inline-text > div) {
      display: inline-block;
      width: 25px;
    }
  }
</style>
