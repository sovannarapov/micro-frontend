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
  const rightFields = reactive([
    'NO',
    { key: 'isActive', label: 'Allowed' },
    // { key: 'status', label: 'Status' },
    { key: 'menuId', label: 'Menu ID' },
    { key: 'menuEngName', label: 'Menu Name' },
    { key: 'menuLev', label: 'Menu Level' },
  ]);
  const searchParam = computed(() => ({
    menuId: inqParam.menuId,
    menuLev: inqParam.menuLev,
    menu1Lev: inqParam.menu1Lev,
    menu2Lev: inqParam.menu2Lev,
    menuEngName: inqParam.menuEngName,

    useYn: '1',
  }));

  onMounted(() => {
    updatedItems.splice(0);
    apiCommon.callApi(`/csm/selectListMenuCombo`, 'post', searchParam.value, fetchMenuComboCallback);
    apiCommon.callApi(`/csm/selectAllAthCdList`, 'post', {}, fetchComboCallback);
  });
  const fetchMenuComboCallback = returnObject => {
    resultData.menuComboList = returnObject.resultData.menuComboList;
  };
  const inqComboFilter1 = computed(() => {
    return resultData.menuComboList.filter(item => item.menuId.length === 3);
  });

  const inqComboFilter2 = computed(() => {
    return resultData.menuComboList.filter(
      item =>
        item.menuId.length === 5 &&
        item.menuId !== inqParam.menu1Lev &&
        item.menuId.substring(0, 3) === inqParam.menu1Lev.substring(0, 3),
    );
  });

  let athCdList = reactive([]);
  const fetchComboCallback = returnObject => {
    console.log('returnObject====>>>    ', returnObject);
    returnObject.resultData.list.filter(item => athCdList.push({ name: item.athName, value: item.athCd }));
    // console.log('athCdList==>  ', athCdList);
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

    apiCommon.callApi(`/csm/selectListMenuAthMgt`, 'post', inqParam, fetchListCallback);
    updatedItems.splice(0);
  };
  let originalData = [];
  const fetchListCallback = returnObject => {
    resultData.menulist = returnObject.resultData.menulist
      .map(cv => {
        if (cv.status === 'R') {
          return { ...cv, athCd: inqParam.athCd, isActive: true };
        } else {
          return { ...cv, status: 'N', athCd: inqParam.athCd };
        }
      })
      .filter(item => item.parentMenuId !== 'H');
    resultData.list = returnObject.resultData.list;
    // console.log('menulist---->>    ', resultData.menulist);

    originalData = JSON.parse(JSON.stringify(resultData.menulist));
    useUpdateEvents({ table: '#full-table', data: resultData.menulist });
  };
  const fetchTranListCallback = returnObject => {
    resultData.tranList = returnObject.resultData.tranList;
  };
  const updatedItems = useUpdatedData('full-table');
  const resultData = reactive({
    list: [],
    menuList: [],
    menuComboList: [],
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
    menuLev: '',
    menu1Lev: '',
  });

  const insParam = reactive({
    menuList: '',
  });

  const inqBzwkDtailList = computed(() => {
    let list = [];
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === inqParam.bzwkDstcd);
    console.log('inq bzwkDtailList: ', bzwkDtailList);
    return list;
  });
  const insBzwkDtailList = computed(() => {
    let list = [];
    console.log('ins bzwkDtailList: ', bzwkDtailList);
    if (!bzwkDtailList) return list;
    list = bzwkDtailList.filter(item => item.bzwkIncd.substring(0, 3) === insParam.bzwkDstcd);

    return list;
  });

  // 거래 실행
  const execBtn = () => {
    if (!chkParams()) {
      return false;
    }
    const chkUpdatedData = updatedItems.filter(item => (item.status === 'N' && item.isActive) || item.status === 'U');
    // console.log(chkUpdatedData, ' : : ', updatedItems.length, ' : : ', updatedItems);
    if (chkUpdatedData.length == 0) {
      mkErrorMessage('There is no changed data');
      return false;
    }

    insParam.menuList = updatedItems;
    // console.log('insParam.apiList===>>  ', insParam.menuList);
    apiCommon.callApi('/csm/insertMenuAthMgt', 'post', insParam, execBtnCallback);
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

  const onInputChange = (key, rowIndex) => {
    // value : 선택된 combobox의 key
    // rowIndex : 선택된 행의 key
    // 선택된 값
    console.log(key, ' : ', rowIndex);
  };
  const checkedRows = computed(() => {
    updatedItems.filter(item => item.isChecked);
  });

  const onChecked = item => {
    // console.log('chk Item--->>   ', item);
    if (item.menuLev === 2 && item.isActive) {
      updatedItems.filter(i => {
        if (item.parentMenuId === i.menuId) {
          i.isActive = true;
        }
      });
    } else if (item.menuLev === 3 && item.isActive) {
      let level1, level2, level3;
      level2 = item.parentMenuId;
      updatedItems.filter(i => {
        if (i.menuId === level2) {
          i.isActive = true;
          level1 = i.parentMenuId;
        }
      });
      updatedItems.filter(i => {
        if (level1 === i.menuId) {
          i.isActive = true;
        }
      });
    }
  };
  const mkInnerHtml = (item, target) => {
    let nbsp = '';
    for (let i = 1; i < item.menuLev; i++) {
      nbsp += '&nbsp;&nbsp;';
    }
    return unescapeHtml(nbsp) + target;
  };
  const unescapeHtml = text => {
    var doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent;
  };
  const checkAllThead = computed({
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
                v-select-all
                v-select-mix
                v-model="inqParam.menu1Lev"
                :options="inqComboFilter1"
                value-field="menuId"
                text-field="menuName"
                class="req"
              >
              </b-form-select>
            </td>
            <th>Business Detail Distinction Code</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.menu2Lev"
                :options="inqComboFilter2"
                value-field="menuId"
                text-field="menuName"
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
            id="full-table"
            style="height: 351px"
          >
            <template #thead-top>
              <b-tr>
                <b-th>No</b-th>
                <b-th class="inline-text"
                  ><b-form-checkbox v-model="checkAllThead">&nbsp;</b-form-checkbox><span>Allowed</span></b-th
                >
                <b-th>Menu ID</b-th>
                <b-th>Menu Name</b-th>
                <b-th>Menu Level</b-th>
              </b-tr>
            </template>
            <template #cell(NO)="row">{{ row.index + 1 }}</template>
            <template #cell(isActive)="row">
              <b-form-checkbox v-model="row.item.isActive" @change="onChecked(row.item)"> &nbsp;</b-form-checkbox>
            </template>
            <template #cell(menuId)="row">
              {{ mkInnerHtml(row.item, row.item.menuId) }}
            </template>
            <template #cell(menuEngName)="row">
              {{ mkInnerHtml(row.item, row.item.menuEngName) }}
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
