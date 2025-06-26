<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getSessionInfo } from '@/common/util/helpers';
  import { getComCodes } from '@/common/util/commonCodes';

  const router = useRouter();

  //세션 선언
  const sessionInfo = getSessionInfo();

  const searchParam = computed(() => ({
    menuId: inqParam.menuId,
    menuLev: inqParam.menuLev,
    menu1Lev: inqParam.menu1Lev,
    menu2Lev: inqParam.menu2Lev,
    menuEngName: inqParam.menuEngName,
    displayCnt: displayCnt.value,
    dmndCnt: page.value,
  }));
  // input form
  const inqParam = reactive({
    menuId: '',
    menuEngName: '',
    menuLev: '',
    menu1Lev: '',
    menu2Lev: '',
  });
  // 조회 파라미터
  const insParam = reactive({
    menuId: '',
    menuLev: '',
    menu1Lev: '',
    menu2Lev: '',
    menuEngName: '',
    menuUrl: '',
    orderSeq: '',
    approvalYn: '',
    useYn: '0',
    branchAuth: '',
  });

  // 테이블 필드명
  const fields = reactive([
    'NO',
    { key: 'menuId', label: 'Menu ID' },
    { key: 'menuEngName', label: 'Menu Name' },
    { key: 'menuLev', label: 'Menu Level' },
    { key: 'parentMenuId', label: 'Parent Menu ID' },
    { key: 'menuUrl', label: 'Menu URL' },
    { key: 'orderSeq', label: 'Order Seq' },
    { key: 'approvalYn', label: 'Approval Yn' },
    { key: 'useYn', label: 'Use Yn' },
  ]);
  // 테이블 row 수
  const displayCnt = ref(10);
  const changeDisplayCnt = param => {
    displayCnt.value = param;
  };
  const pageCntList = reactive([
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);

  const useYns = getComCodes('CSM000007');

  // 현재 페이지
  const page = ref(1);
  // 테이블 row 수 변경 시 재조회
  watch(
    () => displayCnt.value,
    (newValue, oldValue) => {
      console.log('displayCnt - watch');
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
      console.log('page - watch');
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
  // 테이블 조회
  const fetchList = () => {
    apiCommon.callApi(`/csm/selectListMenuAll`, 'post', searchParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.menuList = returnObject.resultData.menuList;
  };

  // 테이블 클릭
  const gridClick = row => {
    Object.assign(insParam, row);
    insParam.menu1Lev = row.menuId.substring(0, 3);
    insParam.menu2Lev = row.menuId.substring(0, 5);
    tranType.value = '2';
  };

  const menuLevels = reactive([
    { name: 'Main menu', value: '1' },
    { name: 'Middle Menu', value: '2' },
    { name: 'Screen', value: '3' },
    { name: 'Hidden', value: '9' },
  ]);

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  // 거래 실행 전 유효성 검사
  const validateExe = () => {
    const { menuEngName, menuLev, menuUrl, menu1Lev, menu2Lev, orderSeq, useYn } = insParam;

    if (menuEngName === '') errorMessage.value = 'Please enter the menu name.';
    if (menuLev === '') errorMessage.value = 'Please enter the menu level.';
    if (menuUrl === '' && (menuLev === '3' || menuLev === '9')) errorMessage.value = 'Please enter the menu URL.';
    if (menu1Lev === '' && menuLev === '2') errorMessage.value = 'Please select a major category.';
    if (menu1Lev === '' && menu2Lev === '' && menuLev === '3') errorMessage.value = 'Please select a middle category.';
    if (orderSeq === '') errorMessage.value = 'Please enter Order Seq.';
    if (useYn === '') errorMessage.value = 'Please enter Use Yn.';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);
      return false;
    }
    return true;
  };

  // 거래 구분
  const tranType = ref('1');
  const tranTypeList = reactive([
    { name: 'Register', value: '1' },
    { name: 'Modify', value: '2' },
  ]);
  const changeTranType = param => {
    console.log(param, ' : ', insParam.menuId);
    tranType.value = param;
    if (param == 1 && insParam.menuId) {
      insParam.menuId = '';
    }
  };

  // 거래 실행
  const execBtn = () => {
    const exeUris = ['insertMenu', 'updateMenu'];
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
        contents: `${tranType.value === '1' ? 'Registration' : 'Modification'} was successful.`,
        callback: pageSearch,
      };
      useAlert(options);
    }
  };

  defineExpose({
    validateExe,
  });

  onActivated(() => {
    console.log('onActivated');
  });

  onDeactivated(() => {
    console.log('onDeactivated');
  });

  onMounted(() => {
    console.log('onMounted');
    //메뉴콤보 조회
    apiCommon.callApi(`/csm/selectListMenuCombo`, 'post', searchParam.value, fetchComboCallback, { noDataChkYn: 'N' });
  });
  const fetchComboCallback = returnObject => {
    resultData.menuComboList = returnObject.resultData.menuComboList;
  };
  const resultData = reactive({
    totalCnt: 0,
    menuList: [],
    menuComboList: [],
  });

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

  const insComboFilter1 = computed(() => {
    return resultData.menuComboList.filter(item => item.menuId.length === 3);
  });

  const insComboFilter2 = computed(() => {
    return resultData.menuComboList.filter(
      item =>
        item.menuId.length === 5 &&
        item.menuId !== insParam.menu1Lev &&
        item.menuId.substring(0, 3) === insParam.menu1Lev.substring(0, 3),
    );
  });
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
            <th>Menu ID</th>
            <td>
              <b-form-input v-model="inqParam.menuId" />
            </td>
            <th>Menu Name</th>
            <td>
              <b-form-input v-model="inqParam.menuEngName" style="width: 200px" />
            </td>
            <th>Menu level</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.menu1Lev"
                :options="inqComboFilter1"
                value-field="menuId"
                text-field="menuName"
                style="width: 250px"
              ></b-form-select>
            </td>
            <th></th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.menu2Lev"
                :options="inqComboFilter2"
                value-field="menuId"
                text-field="menuName"
                style="width: 150px"
              ></b-form-select>
            </td>
          </tr>
          <tr>
            <th>Menu Level</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.menuLev"
                :options="menuLevels"
                value-field="value"
                text-field="name"
              />
            </td>
            <td colspan="5"></td>
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
        :items="resultData.menuList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 351px"
      >
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(menuLev)="row">
          <b-form-select
            v-model="row.item.menuLev"
            v-select-mix
            :options="menuLevels"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(approvalYn)="row">
          <b-form-select
            v-model="row.item.approvalYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(useYn)="row">
          <b-form-select
            v-model="row.item.useYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
      </b-table>
    </div>
    <b-pagination
      v-model="page"
      :total-rows="resultData.totalCnt"
      :per-page="parseInt(displayCnt)"
      aria-controls="my-table"
      first-text="<<"
      prev-text="<"
      next-text=">"
      last-text=">>"
    ></b-pagination>
    <!-- 실행 -->
    <business-exec
      :tranType="tranType"
      :tranTypeList="tranTypeList"
      @change-tran-type="changeTranType"
      @execBtn="execBtn"
    />
    <!-- end 실행 -->

    <div class="boxarea">
      <ul class="title_area sub">
        <li><h2>Detail Contents</h2></li>
      </ul>
      <div class="boardwrite">
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
              <th class="req">Menu ID</th>
              <td><b-form-input v-model="insParam.menuId" disabled class="req" /></td>
              <th class="req">Menu Name</th>
              <td colspan="3">
                <b-form-input v-model="insParam.menuEngName" class="req" />
              </td>
            </tr>
            <tr>
              <th class="req">Menu Level</th>
              <td>
                <b-form-select
                  v-model="insParam.menuLev"
                  v-select-mix
                  :options="menuLevels"
                  :disabled="tranType === '2'"
                  value-field="value"
                  text-field="name"
                  class="req"
                />
              </td>
              <th class="req">Main menu</th>
              <td>
                <b-form-select
                  v-model="insParam.menu1Lev"
                  v-select-mix
                  :options="insComboFilter1"
                  :disabled="tranType === '2' || String(insParam.menuLev) === '1' || String(insParam.menuLev) === '9'"
                  value-field="menuId"
                  text-field="menuName"
                  class="req"
                >
                </b-form-select>
              </td>
              <th class="req">Middle menu</th>
              <td>
                <b-form-select
                  v-model="insParam.menu2Lev"
                  v-select-mix
                  :options="insComboFilter2"
                  :disabled="tranType === '2' || String(insParam.menuLev) !== '3'"
                  value-field="menuId"
                  text-field="menuName"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr>
              <th class="req">Menu URL</th>
              <td>
                <b-form-input
                  v-model="insParam.menuUrl"
                  :disabled="String(insParam.menuLev) !== '3' && String(insParam.menuLev) !== '9'"
                  class="req"
                />
              </td>
              <th class="req">Order Seq</th>
              <td><b-form-input v-model="insParam.orderSeq" class="req" /></td>
              <th class="req">Approval Yn</th>
              <td>
                <b-form-select
                  v-model="insParam.approvalYn"
                  v-select-mix
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
            </tr>
            <tr>
              <th class="req">Use Yn</th>
              <td>
                <b-form-select
                  v-model="insParam.useYn"
                  v-select-mix
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  class="req"
                >
                </b-form-select>
              </td>
              <th class="req">Branch Auth</th>
              <td colspan="3">
                <b-form-input v-model="insParam.branchAuth" class="req" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <NuxtLink to="/csm/CSM0001M00">link test</NuxtLink> -->
  </div>
  <!-- //con_area -->
</template>
