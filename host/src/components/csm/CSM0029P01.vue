<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo, generateOZparam } from '@/common/util/helpers';
  import { setCodes, getCodes, getComCodes } from '@/common/util/commonCodes';
  const props = defineProps({
    datas: {
      type: Object,
      default: () => {},
    },
  });

  const sessionInfo = getSessionInfo();
  const originApprovalTypeCdList = getComCodes('CSM000009');
  const originApprovalClssCdList = getComCodes('CSM000010');
  const originCrdtCmmtTypeCdList = getComCodes('CSM000011');
  const originMmbTypeCdList = getComCodes('CSM000012');
  const approvalTypeCdList = ref('');
  const approvalClssCdList = ref('');
  const crdtCmmtTypeCdList = ref('');
  const mmbTypeCdList = ref('');
  const layerType = ref('1');
  const layerComp = ref('');
  const layerTitle = ref('');
  const layerData = ref('');

  console.log('originApprovalTypeCdList:  ', originCrdtCmmtTypeCdList, ' : ', originMmbTypeCdList);

  approvalTypeCdList.value = originApprovalTypeCdList;
  approvalClssCdList.value = originApprovalClssCdList;
  crdtCmmtTypeCdList.value = originCrdtCmmtTypeCdList;
  mmbTypeCdList.value = originMmbTypeCdList;
  const reqCheck = reactive({
    searchApprovalTypeCd: true,
    searchApprovalClssCd: false,
    searchCrdtCmmtTypeCd: false,
    searchMmbTypeCd: false,
  });
  let multiSelectYn = props.datas.multiSelectYn;
  // 레이어팝업 emit event
  const emit = defineEmits(['popup-emit']);
  onMounted(() => {
    initData();
    if(multiSelectYn==='1'){
      fields.unshift({ key: 'isActive', label: '' , class: 'text-center'});
    }

    console.log('parent data: ', props.datas);
    resultData.totalCnt = 0;
    resultData.list = [];
  });

  const initData = () => {
    insParam.approvalTypeCd = props.datas.approvalTypeCd ? props.datas.approvalTypeCd : '01';
    insParam.approvalClssCd = props.datas.approvalClssCd ? props.datas.approvalClssCd : '';
    insParam.crdtCmmtTypeCd = props.datas.crdtCmmtTypeCd ? props.datas.crdtCmmtTypeCd : '';
    insParam.mmbTypeCd = ''; //props.datas?.mmbTypeCd ? props.datas.mmbTypeCd : '01';
    insParam.brncd = props.datas.brncd;

    props.datas.approvalTypeCd ? (reqCheck.searchApprovalTypeCd = true) : (reqCheck.searchApprovalTypeCd = false);
    props.datas.approvalClssCd ? (reqCheck.searchApprovalClssCd = true) : (reqCheck.searchApprovalClssCd = true);
    props.datas.crdtCmmtTypeCd ? (reqCheck.searchCrdtCmmtTypeCd = true) : (reqCheck.searchCrdtCmmtTypeCd = true);
    props.datas.mmbTypeCd ? (reqCheck.searchMmbTypeCd = true) : (reqCheck.searchMmbTypeCd = true);
    chgApprovalType(insParam.approvalTypeCd, "search");
  };
  // input form
  const inqParam = computed(() => ({
    brncd: insParam.brncd,
    empid: insParam.empid,
    emnm: insParam.emnm,
    serno: insParam.serno,
    approvalTypeCd: insParam.approvalTypeCd,
    approvalClssCd: insParam.approvalClssCd,
    crdtCmmtTypeCd: insParam.crdtCmmtTypeCd,
    mmbTypeCd: insParam.mmbTypeCd,
    pageCnt: pageCnt.value, // 화면display수
    pageNo: page.value, // 요청쪽수
  }));
  // 조회 파라미터
  const insParam = reactive({
    brncd: '',
    empid: '',
    emnm: '',
    serno: '',
    approvalTypeCd: '',
    approvalClssCd: '',
    crdtCmmtTypeCd: '',
    mmbTypeCd: '',
  });

  // 테이블 필드명
  const fields = reactive([
    { key:'NO',label: 'NO', class: 'text-center'},
    { key: 'brncd', label: 'Branch Code' },
    { key: 'branchName', label: 'Branch Name' },
    { key: 'empid', label: 'Employee No' },
    { key: 'emnm', label: 'Employee Name' },
    { key: 'serno', label: 'Serial No' },
    { key: 'approvalTypeCd', label: 'Approval Distinction Code' },
    { key: 'approvalClssCd', label: 'Approval Classification Code' },
    { key: 'crdtCmmtTypeCd', label: 'Credit Commitee Type Code' },
    { key: 'mmbTypeCd', label: 'Member Type Code' },
    { key: 'regiYms', label: 'Registration YMS' },
    { key: 'regiUno', label: 'Registration User No' },
  ]);
  // 테이블 row 수
  const pageCnt = ref(10);
  const pageCntList = reactive([
    { name: '2', value: '2' },
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);
  // 현재 페이지
  const page = ref(1);
  // 테이블 row 수 변경 시 재조회
  watch(
    () => pageCnt.value,
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
    console.log('insParam.approvalTypeCd===>> ', insParam.approvalTypeCd);

    if (validateExe()) {
      inqParam.value.cnclYn = '0';
      apiCommon.callApi(`/csm/selectListAthMgtBasicList`, 'post', inqParam.value, fetchListCallback);
    }
  };
  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  const validateExe = () => {
    const { approvalTypeCd} = insParam;

    if (approvalTypeCd === '') errorMessage.value = 'Missing equired value (Approval Type)';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };
  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.list = returnObject.resultData.list;
  };

  const resultData = reactive({
    totalCnt: 0,
    list: [],
  });

  const onConfirm = () => {
    let sendData = resultData.list.filter(v => v.isActive);
    if(sendData.length===0){
      const options = {
        title: 'Error',
        contents: 'There are no rows selected.',
      };
      useAlert(options);
    }else{
      console.log('grid onConfirm --->> ', sendData);
      emit('popup-emit', sendData);
    }
  }

  // 테이블 클릭
  const gridClick = items => {
    console.log('gridClick--->> ', items, ' : ', items.emnm);

    let sendData = {
      approvalClssCd: items.approvalClssCd == null ? '' : items.approvalClssCd,
      approvalTypeCd: items.approvalTypeCd == null ? '' : items.approvalTypeCd,
      branchName: items.branchName == null ? '' : items.branchName,
      brncd: items.brncd == null ? '' : items.brncd,
      cnclUno: items.cnclUno == null ? '' : items.cnclUno,
      cnclYms: items.cnclYms == null ? '' : items.cnclYms,
      cnclYn: items.cnclYn == null ? '' : items.cnclYn,
      crdtCmmtTypeCd: items.crdtCmmtTypeCd == null ? '' : items.crdtCmmtTypeCd,
      emnm: items.emnm == null ? '' : items.emnm,
      empid: items.empid == null ? '' : items.empid,
      mmbTypeCd: items.mmbTypeCd == null ? '' : items.mmbTypeCd,
      operGroupCd: items.operGroupCd == null ? '' : items.operGroupCd,
      regiUno: items.regiUno == null ? '' : items.regiUno,
      regiYms: items.regiYms == null ? '' : items.regiYms,
      serno: items.serno == null ? '' : items.serno,
      sysLastPrcYms: items.sysLastPrcYms == null ? '' : items.sysLastPrcYms,
      sysLastUno: items.sysLastUno == null ? '' : items.sysLastUno,
      totalCnt: items.totalCnt == null ? '' : items.totalCnt,
    };
    console.log('gridClick222--->> ', sendData);
    emit('popup-emit', sendData);
  };

  const openPopup = gbn => {
    layerType.value = gbn;
    if (gbn === 'brn') {
      //부점정보조회
      layerComp.value = 'CSM0031P01';
      layerTitle.value = 'Search Branch';
    } else if (gbn === 'emp') {
      //직원정보조회
      layerComp.value = 'CSM0032P01';
      layerTitle.value = 'Inquire Employee';
    }
    onClickPopup();
  };
  const keyUp = gbn => {
    if (gbn === 'brn') {
      if (insParam.brncd.length < 1) insParam.brnName = '';
    } else if (gbn === 'emp') {
      if (insParam.empid.length < 1) insParam.emnm = '';
    }
  };
  const onClickPopup = () => {
    const options = {
      title: layerTitle,
      width: 1100,
      height: 700,
      component: layerComp,
      datas: layerData,
      callback: popupCallback,
    };
    usePopup(options);
  };
  const popupCallback = param => {
    console.log('popupCallback', param);
    if (layerType.value === 'brn') {
      //부점정보조회
      param.brncd ? (insParam.brncd = param.brncd) : '';
      param.brnName ? (insParam.brnName = param.brnName) : '';
    } else if (layerType.value === 'emp') {
      //직원정보조회
      param.empid ? (insParam.empid = param.empid) : '';
      param.emnm ? (insParam.emnm = param.emnm) : '';
    }
  };
  const chgApprovalType = (e, type) => {
    // const chgApprovalType = e => {
    console.log('chgApprovalType : ', e, type);
    insParam.approvalClssCd = '';
    insParam.crdtCmmtTypeCd = '';
    insParam.mmbTypeCd = '';
    switch (e) {
      case '01':
        behavior01();
        break;
      case '02':
        behavior02();
        break;
      case '03':
        behavior03();
        break;
      case '04':
        behavior04();
        break;
      case '98':
        behavior04();
        break;
      case '99':
        behavior04();
        break;
      default:
        break;
    }
  };
  const behavior01 = () => {
    approvalClssCdList.value = approvalClssCdList.value.filter(s => s.bzwkIncd !== '00');
    crdtCmmtTypeCdList.value = crdtCmmtTypeCdList.value.filter(s => s.bzwkIncd !== '00');
    mmbTypeCdList.value = mmbTypeCdList.value.filter(s => s.bzwkIncd !== '00');
    reqCheck.searchApprovalClssCd = false;
    reqCheck.searchCrdtCmmtTypeCd = false;
    reqCheck.searchMmbTypeCd = false;
  };
  const behavior02 = () => {
    approvalClssCdList.value = approvalClssCdList.value.filter(s => s.bzwkIncd !== '00');
    crdtCmmtTypeCdList.value = originCrdtCmmtTypeCdList;
    mmbTypeCdList.value = originMmbTypeCdList;
    insParam.crdtCmmtTypeCd = '00';
    insParam.mmbTypeCd = '00';
    reqCheck.searchApprovalClssCd = false;
    reqCheck.searchCrdtCmmtTypeCd = true;
    reqCheck.searchMmbTypeCd = true;
  };
  const behavior03 = () => {
    approvalClssCdList.value = originApprovalClssCdList;
    crdtCmmtTypeCdList.value = originCrdtCmmtTypeCdList;
    mmbTypeCdList.value = originMmbTypeCdList;
    insParam.approvalClssCd = '00';
    insParam.crdtCmmtTypeCd = '00';
    insParam.mmbTypeCd = '00';
    reqCheck.searchApprovalClssCd = true;
    reqCheck.searchCrdtCmmtTypeCd = true;
    reqCheck.searchMmbTypeCd = true;
  };
  const behavior04 = () => {
    approvalClssCdList.value = originApprovalClssCdList;
    crdtCmmtTypeCdList.value = originCrdtCmmtTypeCdList;
    mmbTypeCdList.value = originMmbTypeCdList;
    insParam.approvalClssCd = '00';
    insParam.crdtCmmtTypeCd = '00';
    insParam.mmbTypeCd = '00';
    reqCheck.searchApprovalClssCd = true;
    reqCheck.searchCrdtCmmtTypeCd = true;
    reqCheck.searchMmbTypeCd = true;
  };

  const crdtBehavior01 = () => {
    mmbTypeCdList.value = originMmbTypeCdList.filter(
      s => s.bzwkIncd === '01' || s.bzwkIncd === '02' || s.bzwkIncd === '03' || s.bzwkIncd === '04',
    );
  };
  const crdtBehavior02 = () => {
    mmbTypeCdList.value = originMmbTypeCdList.filter(
      s => s.bzwkIncd === '05' || s.bzwkIncd === '06' || s.bzwkIncd === '07' || s.bzwkIncd === '08',
    );
  };
  const crdtBehavior03 = () => {
    mmbTypeCdList.value = originMmbTypeCdList.filter(
      s => s.bzwkIncd === '08' || s.bzwkIncd === '07' || s.bzwkIncd === '09' || s.bzwkIncd === '10',
    );
  };
  const crdtBehavior04 = () => {
    mmbTypeCdList.value = originMmbTypeCdList.filter(
      s =>
        s.bzwkIncd === '10' || s.bzwkIncd === '11' || s.bzwkIncd === '12' || s.bzwkIncd === '13' || s.bzwkIncd === '14',
    );
  };
  const changeCrdtCmmtType = e => {
    console.log('changeCrdtCmmtType : ', e, originMmbTypeCdList);
    switch (e) {
      case '01':
        crdtBehavior01();
        break;
      case '02':
        crdtBehavior02();
        break;
      case '03':
        crdtBehavior03();
        break;
      case '04':
        crdtBehavior04();
        break;
      default:
        break;
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
                <b-form-input v-model="insParam.brncd" @keyup="keyUp('brn')" maxLength="3" />
                <button type="button" class="btn ico ico_search" @click="openPopup('brn')" />
                <b-form-input v-model="insParam.brnName" readonly="true" />
              </div>
            </td>

            <th>User ID</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="insParam.empid" @keyup="keyUp('emp')" maxLength="20" />
                <button type="button" class="btn ico ico_search" @click="openPopup('emp')" />
                <b-form-input v-model="insParam.emnm" readonly="true" />
              </div>
            </td>
          </tr>
          <tr>
            <th>Approval Type</th>
            <td>
              <b-form-select
                v-model="insParam.approvalTypeCd"
                v-select-all
                v-select-mix
                :options="approvalTypeCdList"
                value-field="value"
                text-field="name"
                @change="e => chgApprovalType(e, 'search')"
                :readonly="reqCheck.searchApprovalTypeCd"
              />
            </td>
            <th>Approval Classification</th>
            <td>
              <b-form-select
                v-model="insParam.approvalClssCd"
                v-select-all
                v-select-mix
                :options="approvalClssCdList"
                value-field="value"
                text-field="name"
                :readonly="reqCheck.searchApprovalClssCd"
              />
            </td>
          </tr>
          <tr>
            <th>Credit Commitee Type</th>
            <td>
              <b-form-select
                v-model="insParam.crdtCmmtTypeCd"
                v-select-all
                v-select-mix
                :options="crdtCmmtTypeCdList"
                value-field="value"
                text-field="name"
                :readonly="reqCheck.searchCrdtCmmtTypeCd"
                @change="e => changeCrdtCmmtType(e, 'search')"
              />
            </td>
            <th>Member Type</th>
            <td>
              <b-form-select
                v-model="insParam.mmbTypeCd"
                v-select-all
                v-select-mix
                :options="mmbTypeCdList"
                value-field="value"
                text-field="name"
                :readonly="true"
              />
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
        <b-form-select v-model="pageCnt" :options="pageCntList" value-field="value" text-field="name"> </b-form-select>
      </li>
      <li class="form_box">
        <b-button v-if="multiSelectYn==='1'" class="btn btn_line" @click="onConfirm()">Confirm</b-button>
      </li>
      
    </ul>
    <div class="boardlist">
      <b-table
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="resultData.list"
        :fields="fields"
        select-mode="single"
        @row-dbl-clicked="gridClick"
        style="height: 371px"
        >
        <template #cell(isActive)="row">
          <b-form-checkbox v-if="multiSelectYn==='1'" v-model="row.item.isActive" class="only-ch">&nbsp;</b-form-checkbox>
        </template>
        <template #cell(approvalTypeCd)="row">
          <b-form-select
            v-model="row.item.approvalTypeCd"
            v-select-mix
            :options="approvalTypeCdList"
            style="width: 200px"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(approvalClssCd)="row">
          <b-form-select
            v-model="row.item.approvalClssCd"
            v-select-mix
            :options="approvalClssCdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(crdtCmmtTypeCd)="row">
          <b-form-select
            v-model="row.item.crdtCmmtTypeCd"
            v-select-mix
            :options="crdtCmmtTypeCdList"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(mmbTypeCd)="row">
          <b-form-select
            v-model="row.item.mmbTypeCd"
            v-select-mix
            :options="mmbTypeCdList"
            style="width: 300px"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * pageCnt }}</template>
      </b-table>
    </div>
    <b-pagination
      class="paginate"
      v-model="page"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(pageCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>
  </div>
  <!-- //con_area -->
</template>
