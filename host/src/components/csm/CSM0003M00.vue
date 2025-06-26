<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getComCodes } from '@/common/util/commonCodes';

  const searchParam = computed(() => ({
    tableName: inqParam.tableName,
    ledgerPkCondition: inqParam.ledgerPkCondition,
    ledgerColumn: inqParam.ledgerColumn,
  }));
  // input form
  const inqParam = reactive({
    bzwkDstcd: '',
    tableName: '',
    ledgerPkCondition: '',
    ledgerColumn: '',
    ledgerColumnModify:'',
  });

  // 테이블 필드명
  const pk_fields = reactive([
    { key: 'colNo', label: 'Column No' },
    { key: 'colName', label: 'Column Name' },
    { key: 'colType', label: 'Column Type ' },
    { key: 'colLeng', label: 'Column Length' },
    { key: 'pkCondition', label: 'PK Condition', thStyle: { width: '50%' } },
  ]);

  // 테이블 필드명
  const fields = reactive([
    { key: 'isChange', label: 'Changed'},
    { key: 'colNo', label: 'Column No' },
    { key: 'colName', label: 'Column Name' },
    { key: 'colType', label: 'Column Type ' },
    { key: 'colLeng', label: 'Column Length' },
    { key: 'colNullYn', label: 'Nullable(Y/N)' },
    { key: 'modfiBfCtnt', label: 'Modify before Contents' ,thStyle: { width: '30%' } },
    { key: 'modfiAfCtnt', label: 'Modify After Contents' ,thStyle: { width: '30%' } },
  ]);

  const bzwkList = getComCodes('CSM000001');

  // 테이블 조회
  const fetchList = () => {
    resultData.ledgerColumnList=null;
    if (inqParam.bzwkDstcd === ''){mkErrorMessage('Please enter the Business Distinction Code .'); return false;} 
    if (inqParam.tableName === ''){mkErrorMessage('Please enter the Table Name.'); return false;}

    apiCommon.callApi(`/csm/selectListColumnInfo`, 'post', searchParam.value, fetchListCallback);
    
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.columnList = returnObject.resultData.columnList;

    console.log('resultData.ledgerColumnList', resultData.ledgerColumnList);
  };

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  const mkErrorMessage = param => {
    errorMessage.value = param;
    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
    if (errorMessage.value) {
      useAlert(options);
    }
  };

  // 테이블 조회
  const ledgerInquiry = () => {
    console.log('pkColumnList', ' : : ', inqParam.ledgerPkCondition.length, ' : : ', inqParam.ledgerPkCondition);

    const pkConditionData = inqParam.ledgerPkCondition.filter(item => item.pkCondition?.trim() === ''||item.pkCondition === null);
    console.log('pkConditionData', ' : : ', pkConditionData.length, ' : : ', pkConditionData);
    if (pkConditionData.length > 0 || inqParam.ledgerPkCondition.length === 0) {
      mkErrorMessage('Enter the value in the PK column to search.');
      return false;
    }
    apiCommon.callApi(`/csm/selectListLedgerInfo`, 'post', searchParam.value, ledgerInquiryCallback);
  };

  const ledgerInquiryCallback = returnObject => {
    resultData.ledgerColumnList = returnObject.resultData.ledgerColumnList;
    console.log('inqParam.ledgerColumn : ', inqParam.ledgerColumn);
    console.log('resultData.ledgerColumnList : ', resultData.ledgerColumnList);
    if(resultData.ledgerColumnList != null){
      for(let i=0;i<inqParam.ledgerColumn.length;i++){
        let colName = inqParam.ledgerColumn[i].colName;
        for(const [key, value] of Object.entries(resultData.ledgerColumnList)){
          if(colName === key){
            inqParam.ledgerColumn[i].isChange = false;
            inqParam.ledgerColumn[i].modfiBfCtnt = value;
            inqParam.ledgerColumn[i].modfiAfCtnt = '';
            console.log('colData', colName, key);   
          }
        }
      }
    }
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    const { bzwkDstcd, tableName } = inqParam;

    if (bzwkDstcd === '') errorMessage.value = 'Please enter the Business Distinction Code.';
    if (tableName === '') errorMessage.value = 'Please enter the Table Name.';

    const pkConditionData = inqParam.ledgerPkCondition.filter(item => item.pkCondition?.trim() === ''||item.pkCondition === null);
    if (pkConditionData.length > 0 || inqParam.ledgerPkCondition.length === 0) errorMessage.value = 'Enter the value in the PK column to search.';
     
    const ledgerColumnCheck = inqParam.ledgerColumn.filter(item => item.isChange === true );
    if(ledgerColumnCheck.length===0) errorMessage.value = 'There is nothing to change.';

    console.log('pkConditionData',pkConditionData.length);
    console.log('ledgerColumnCheck',ledgerColumnCheck.length);

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };
    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 실행
  const execBtn = () => {
    const validate = validateExe();
    if (validate) {
      const options = { title: 'Confirm', contents: 'When changing the ledger, the history is recorded. Do you want to proceed?', callback: executeLedgerModify };
      useDialog(options);
    }
  };

  const executeLedgerModify = () =>{
    inqParam.ledgerColumnModify = inqParam.ledgerColumn.filter(item => item.isChange === true);
    apiCommon.callApi('/csm/updateTableInfo', 'post', inqParam, execBtnCallback);
  }

  const execBtnCallback = returnObject => {
    if (returnObject.resultCd === '0000') {
      ledgerInquiry();
    }
  };

  onActivated(() => {
    console.log('onActivated');
  });

  onDeactivated(() => {
    console.log('onDeactivated');
  });

  onMounted(() => {
    console.log('onMounted');

    //테이블목록 조회
    apiCommon.callApi(`/csm/selectListTableInfo`, 'post', searchParam.value, fetchComboCallback, {});

  });
  const fetchComboCallback = returnObject => {
    resultData.tableList = returnObject.resultData.tableList;
  };
  const resultData = reactive({
    totalCnt: 0,
    tableList: [],
    columnList: [],
    ledgerColumnList: null,
  });

  const tableListFilter = computed(() => {
    let list = [];
    if (!resultData.tableList) return list;
    list = resultData.tableList.filter(item => item.tableName.substring(2, 5) === inqParam.bzwkDstcd);
    return list;
  });

  const pkColumnListFilter = computed(() => {
    if (!resultData.columnList) return inqParam.ledgerPkCondition;
    inqParam.ledgerPkCondition = resultData.columnList.filter(item => item.colPkYn === 'Y');
    return inqParam.ledgerPkCondition;
  });

  const generalColumnListFilter = computed(() => {
    if (!resultData.columnList) return inqParam.ledgerColumn;
    inqParam.ledgerColumn = resultData.columnList.filter(item => item.colPkYn != 'Y');
    return inqParam.ledgerColumn;
  });

    const changeHistoryPopup = option => {
    const options = {
      title: 'Change history',
      width: 1100,
      height: 700,
      component: 'CSM0003P01',
      datas: { bzwkDstcd: inqParam.bzwkDstcd, tableName: inqParam.tableName, paramtestvalue:'1' },
      callback: '',
    };
    usePopup(options);
  };

  const isChanged = (key, index) => {
    if(key !=''){
      inqParam.ledgerColumn[index].isChange = true;
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
            <th>Business Distinction Code</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.bzwkDstcd"
                :options="bzwkList"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th>Table Name</th>
            <td>
              <b-form-select
                v-select-mix
                v-model="inqParam.tableName"
                :options="tableListFilter"
                value-field="tableName"
                text-field="tableDesc"
              >
              </b-form-select>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <div class="btn_area">
      <button type="button" class="btn btn_line" @click="changeHistoryPopup()"><span>Change history</span></button>
      <button type="button" class="btn btn_primary" @click="fetchList()"><span>Inquiry</span></button>
    </div>
  </div>
  <!-- //searchArea -->

  <div class="con_area">
    <ul class="boardlist_top">
      <li class="form_box">PK Column - Enter the conditions for ledger change. </li>
      <li class="form_box">
        <b-button class="btn btn_primary" @click="ledgerInquiry()" >Ledger Target inquiry</b-button>
      </li>
    </ul>
    <div class="boardlist">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="pkColumnListFilter"
        :fields="pk_fields"
        select-mode="single"
        style="height: 190px"
      >
        <template #cell(pkCondition)="row">
          <b-form-input v-model="row.item.pkCondition" />
        </template>
      </b-table>
    </div>
    <ul class="boardlist_top">
      <li class="form_box">General Column - Enter your changes in Modify After Contents.</li>
      <li class="form_box">
        <b-button class="btn btn_apply" @click="execBtn()" >Ledger Change Execute</b-button>
      </li>
    </ul>    <div class="boardlist">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="generalColumnListFilter"
        :fields="fields"
        select-mode="single"
        style="height: 420px"
      >
        <template #cell(isChange)="row">
          <b-form-checkbox 
            v-model="row.item.isChange" 
            :disabled="resultData.ledgerColumnList===null "> &nbsp;</b-form-checkbox>
        </template>
        <template #cell(modfiAfCtnt)="row">
          <b-form-input v-model="row.item.modfiAfCtnt" 
                       :disabled="row.item.colName==='SYS_LAST_PRCSS_YMS' || row.item.colName==='SYS_LAST_UNO' || 
                                  resultData.ledgerColumnList===null "
                       @input="e => isChanged(e, row.index)"
                       />
        </template>
      </b-table>
    </div>
    
  </div>
  <!-- //con_area -->
</template>
