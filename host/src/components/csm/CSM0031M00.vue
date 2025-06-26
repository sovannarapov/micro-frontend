<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';

  const popupCallback = param => {
    console.log('popupCallback', param);
    recvEvtFromChild(param);
  };
  onMounted(() => {
    fetchListAdedInfo();
  });
  const onClickPopup = () => {
    const options = {
      title: 'Search Branch',
      component: 'CSM0031P01',
      height: 620,
      datas: [{ test: 'test' }],
      callback: popupCallback,
    };
    usePopup(options);
  };
  // input form
  const searchParam = computed(() => ({
    brncd: insParam.brncd, //입력부점코드 v
    brnName: insParam.brnName, //입력부점명 v
    displayCnt: displayCnt.value, // 화면display수
    dmndCnt: page.value, // 요청쪽수
  }));

  // 조회 파라미터
  const insParam = reactive({
    brnName: '',
    brncd: '',
  });

  const updateParam = reactive({
    brnName: '',
    brncd: '',
    bnkCd: '',
    dtailAddr: '',
    bic: '',
    pilotBrnYn: '',
    brnMgrExstYn: '',
    regionType: '',
    regionCode: '', //for select box
    inPhnompenhYn: '',
  });

  // 테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'brncd', label: 'Branch Code' },
    { key: 'brnName', label: 'Branch Name' },
    { key: 'parentBranch', label: 'Parent Branch' },
    { key: 'regionalOffice', label: 'Regional Office' },
    { key: 'bnkCd', label: 'Bank Code' },
    { key: 'bic', label: 'BIC Code' },
    { key: 'dtailAddr', label: 'Branch Address' },
    { key: 'pilotBrnYn', label: 'Pilot Branch' },
    { key: 'brnMgrExstYn', label: 'Branch Manager Exist' },
    { key: 'regionCode', label: 'Region Code' },
    { key: 'inPhnompenhYn', label: 'In Phnompenh' },
  ]);
  // 테이블 row 수
  const displayCnt = ref(10);
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
    apiCommon.callApi(`/csm/selectBrnInfoInq`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.brnInfoInqList = returnObject.resultData.brnInfoInqList;
  };
  const fetchListAdedInfo = () => {
    apiCommon.callApi(
      `/csm/selectListAdedInfoMgt`,
      'post',
      { adedInfoIdnfiNo: 'CSMDIV', displayCnt: 100, dmndCnt: 1 },
      fetchListAdedInfoCallback,
      { noDataChkYn: 'N' },
    );
  };
  const contactList = reactive({
    totalCnt: 0,
    list: [],
  });
  let selectList = reactive([]);
  const fetchListAdedInfoCallback = returnObject => {
    contactList.totalCnt = returnObject.resultData.totalCnt;

    const resultList = returnObject.resultData.adedInfoList;
    //쿼리에서 etc가 젤 처음으로 나옴 위치변경
    const nonEtc = resultList.filter(d => d.adedInfoNo !== 'ETC');
    const etc = resultList.filter(d => d.adedInfoNo === 'ETC');

    if (etc.length > 0) nonEtc.push(etc[0]);

    contactList.list = nonEtc;

    contactList.list.map(d => {
      selectList.push({ name: d.adedInfoName, value: d.adedInfoNo });
    });
    // console.log('selectList: ', selectList);
  };
  const resultData = reactive({
    totalCnt: 0,
    brnInfoInqList: [],
  });

  const openBrnPopup = gbn => {
    if (gbn === '1') {
      // 레이어 팝업 오픈
      onClickPopup();
    }
  };
  const recvEvtFromChild = param => {
    console.log('recvEvtFromChild......');
    // console.log(param);
    if (!param) {
      return;
    }
    let recvObj = param;

    if (recvObj.brncd) {
      insParam.brncd = recvObj.brncd;
    }
    if (recvObj.brnName) {
      insParam.brnName = recvObj.brnName;
    }
  };
  const keyUp = gbn => {
    if (gbn === '1') {
      if (insParam.brncd.length < 1) {
        insParam.brnName = '';
      }
    }
  };

  const validateExe = () => {
    const { pilotBrnYn, brnMgrExstYn, regionCode } = updateParam;
    console.log('pilotBrnYn: ', pilotBrnYn);
    if (regionCode == null || regionCode === '') errorMessage.value = 'Please Select the (Region Type) ';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };
  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };
  // 거래 실행
  const execBtn = () => {
    let regionT = '';
    contactList.list.filter(da => {
      if (da.adedInfoNo === updateParam.regionCode) regionT = da;
      // console.log(da.adedInfoNo === updateParam.regionType, ' : ', da);
    });

    console.log('updateParam: ', updateParam, ' regionValue: ', regionT);
    if (validateExe()) {
      regionT.adedInfoCtnt1 === 'PH'
        ? (updateParam.inPhnompenhYn = 1)
        : updateParam.inPhnompenhYn && updateParam.inPhnompenhYn === 'PH'
        ? (updateParam.inPhnompenhYn = 1)
        : (updateParam.inPhnompenhYn = 0);
      updateParam.regionCode = regionT.adedInfoNo;
      updateParam.regionType = regionT.adedInfoCtnt1;
      apiCommon.callApi('/csm/updateBrnInfoInq', 'put', updateParam, fetchList);
    }
  };
  const tranType = ref('1'); //거래구분
  const tranTypeList = reactive([{ name: 'Modify', value: '1' }]);
  // 테이블 클릭
  const gridClick = row => {
    console.log('clicked row==> ', row);
    Object.assign(updateParam, row);
    if (!row.regionType) updateParam.regionCode = '';
    // tranType.value = '2';
  };
  const useYns = reactive([
    { value: '1', name: 'Y' },
    { value: '0', name: 'N' },
  ]);
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
                <b-form-input v-model="insParam.brncd" @keyup="keyUp('1')" maxlength="3" />
                <button type="button" class="btn ico ico_search" @click="openBrnPopup('1')" />
                <b-form-input v-model="insParam.brnName" readonly="true" />
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
        :items="resultData.brnInfoInqList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 367px"
      >
        <template #cell(pilotBrnYn)="row">
          <b-form-select
            v-model="row.item.pilotBrnYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(brnMgrExstYn)="row">
          <b-form-select
            v-model="row.item.brnMgrExstYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(inPhnompenhYn)="row">
          <b-form-select
            v-model="row.item.inPhnompenhYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
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
  </div>
  <business-exec :tranType="tranType" :tranTypeList="tranTypeList" @execBtn="execBtn" />
  <!-- //con_area -->
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
            <th>Branch Name</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="updateParam.brnName" maxLength="15" class="req" :disabled="true" />
              </div>
            </td>

            <th>Branch Code</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="updateParam.brncd" maxLength="15" class="req" :disabled="true" />
              </div>
            </td>
            <th>Regional Office</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="updateParam.regionalOffice" maxLength="15" class="req" :disabled="true" />
              </div>
            </td>
          </tr>
          <tr>
            <th>Bank Code</th>
            <td>
              <b-form-input v-model="updateParam.bnkCd" maxLength="15" class="req" :disabled="true" />
            </td>
            <th>Bic Code</th>
            <td>
              <b-form-input v-model="updateParam.bic" maxLength="15" class="req" :disabled="true" />
            </td>
            <th>Branch Address</th>
            <td>
              <b-form-input v-model="updateParam.dtailAddr" class="req" :disabled="true" />
            </td>
          </tr>
          <tr>
            <th>Pilot Branch YN</th>
            <td>
              <b-form-select
                v-model="updateParam.pilotBrnYn"
                v-select-mix
                :options="useYns"
                value-field="value"
                text-field="name"
                class="req"
              />
            </td>
            <th>Branch Manager Exist YN</th>
            <td>
              <b-form-select
                v-model="updateParam.brnMgrExstYn"
                v-select-mix
                :options="useYns"
                value-field="value"
                text-field="name"
                class="req"
              />
            </td>
            <th>Region Code</th>
            <td>
              <b-form-select
                v-model="updateParam.regionCode"
                v-select-mix
                :options="selectList"
                value-field="value"
                text-field="name"
                class="req"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
