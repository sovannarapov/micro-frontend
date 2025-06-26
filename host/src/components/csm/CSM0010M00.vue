<script setup>
  // util 스크립트 import
  import apiCommon from '@/common/apiCommon.js';
  import { getComCodes } from '@/common/util/commonCodes';
  import { parseDateLoan, getSessionInfo } from '@/common/util/helpers';
  import dayjs from 'dayjs';

  const sessionInfo = getSessionInfo();
  const tranBaseYmd = sessionInfo.tranBaseYmd;
  const chnlList = getComCodes('CSM000006');
  const useYns = getComCodes('CSM000007');
  const today = dayjs(parseDateLoan(tranBaseYmd)).format('DDMMYYYY');
  // input form
  const inqParam = reactive({
    uuid: '',
    tranYmd: today,
    apiName: '',
    brnCode: '',
    tranSuccessYn: '',
  });
  // 조회 파라미터
  const insParam = computed(() => ({
    uuid: inqParam.uuid,
    tranYmd: inqParam.tranYmd,
    screnNo: inqParam.screnNo,
    screnName: inqParam.screnName,
    apiName: inqParam.apiName,
    brnCode: inqParam.brnCode,
    tranSuccessYn: inqParam.tranSuccessYn,
    pageCnt: displayCnt.value,
    pageNo: page.value,
  }));

  // 테이블 필드명
  const fields = reactive([
    { key: 'NO', stickyColumn: true },
    { key: 'uuid', label: 'UUID', stickyColumn: true },
    { key: 'tranYmd', label: 'Transaction Date' },
    { key: 'tranHhmmss', label: 'Transaction Time' },
    { key: 'screnNo', label: 'Screen No' },
    { key: 'screnName', label: 'Screen Name' },
    { key: 'apiName', label: 'Api Name' },
    { key: 'chnlDstcd', label: 'Channel Code' },
    { key: 'uno', label: 'User No' },
    { key: 'brnCode', label: 'Branch Code' },
    { key: 'ipAddress', label: 'IP Address' },
    { key: 'reqCtnt', label: 'Request Content' },
    { key: 'resCtnt', label: 'Response Content' },
    { key: 'tranSuccessYn', label: 'Transaction Success Yn' },
    { key: 'errCode', label: 'Error Code' },
    { key: 'errCtnt', label: 'Error Content' },
  ]);

  // 테이블 row 수
  const displayCnt = ref(10);
  // 현재 페이지
  const page = ref(1);
  const pageCntList = reactive([
    { name: '2', value: '2' },
    { name: '10', value: '10' },
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '50', value: '50' },
  ]);

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
    resultData?.onlineLogList?.splice(0);
    apiCommon.callApi(`/csm/selectLogList`, 'post', insParam.value, fetchListCallback);
  };

  const fetchListCallback = returnObject => {
    resultData.totalCnt = returnObject.resultData.totalCnt;
    resultData.onlineLogList = returnObject.resultData.onlineLogList;
  };

  const resultData = reactive({
    totalCnt: 0,
    onlineLogList: [],
  });

  useFixedColumn(resultData, 'grid1', 'left');

  // 상세 데이터
  const insData = reactive({
    uuid: '',
    tranYmd: '',
    tranHhmmss: '',
    screnNo: '',
    apiName: '',
    chnlDstcd: '',
    uno: '',
    brnCode: '',
    ipAddress: '',
    reqCtnt: '',
    resCtnt: '',
    tranSuccessYn: '',
    errCode: '',
    errCtnt: '',
  });
  // 테이블 클릭
  const gridClick = row => {
    console.log('gridClick===>>  ', row);
    Object.assign(insData, row);
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
            <th>UUID</th>
            <td colspan="3">
              <div class="form_box">
                <b-form-input v-model="inqParam.uuid" />
              </div>
            </td>
            <th class="req">Transaction Ymd</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model="inqParam.tranYmd" class="dp_req" />
              </div>
            </td>
          </tr>
          <tr>
            <th>Api Name</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="inqParam.apiName" maxlength="200" />
              </div>
            </td>
            <th>Screen No</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="inqParam.screnNo" maxlength="100" />
              </div>
            </td>
            <th>Branch Code</th>
            <td>
              <div class="form_box">
                <b-form-input input type="text" v-model="inqParam.brnCode" maxlength="3" />
              </div>
            </td>
            <th>Transaction Success Yn</th>
            <td>
              <b-form-select
                v-select-all
                v-select-mix
                v-model="inqParam.tranSuccessYn"
                :options="useYns"
                value-field="value"
                text-field="name"
              >
              </b-form-select>
            </td>
            <th colspan="2"></th>
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
    <div class="boardlist over">
      <b-table
        id="grid1"
        striped
        hover
        selectable
        sticky-header
        responsive
        :items="resultData.onlineLogList"
        :fields="fields"
        select-mode="single"
        @row-clicked="gridClick"
        style="height: 367px"
      >
        <template #cell(NO)="row">{{ row.index + 1 + (page - 1) * displayCnt }}</template>
        <template #cell(tranYmd)="row">
          <b-date-picker v-model="row.item.tranYmd" readonly />
        </template>
        <template #cell(chnlDstcd)="row">
          <div style="width: 150px">
            <b-form-select
              v-model="row.item.chnlDstcd"
              v-select-mix
              :options="chnlList"
              readonly
              value-field="value"
              text-field="name"
            />
          </div>
        </template>
        <template #cell(tranSuccessYn)="row">
          <b-form-select
            v-model="row.item.tranSuccessYn"
            v-select-mix
            :options="useYns"
            readonly
            value-field="value"
            text-field="name"
          />
        </template>
        <template #cell(reqCtnt)="row">
          <p :title="row.item.reqCtnt" v-trim-text="'60'">
            {{ row.item.reqCtnt }}
          </p>
        </template>
        <template #cell(resCtnt)="row">
          <p :title="row.item.resCtnt" v-trim-text="'60'">
            {{ row.item.resCtnt }}
          </p>
        </template>
        <template #cell(errCtnt)="row">
          <p :title="row.item.errCtnt" v-trim-text="'60'">
            {{ row.item.errCtnt }}
          </p>
        </template>
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
              <th>UUID</th>
              <td colspan="3"><b-form-input v-model="insData.uuid" readonly /></td>
              <th>Transaction date</th>
              <td>
                <b-date-picker v-model="insData.tranYmd" readonly />
              </td>
              <th>Transaction Time</th>
              <td>
                <b-form-input v-model="insData.tranHhmmss" readonly />
              </td>
            </tr>
            <tr>
              <th>Screen No</th>
              <td>
                <b-form-input v-model="insData.screnNo" readonly />
              </td>
              <th>Screen Name</th>
              <td>
                <b-form-input v-model="insData.screnName" readonly />
              </td>
              <th>Api Name</th>
              <td colspan="3"><b-form-input v-model="insData.apiName" readonly /></td>
            </tr>
            <tr>
              <th>Channel Code</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.chnlDstcd"
                  :options="chnlList"
                  value-field="value"
                  text-field="name"
                  readonly
                />
              </td>
              <th>User No</th>
              <td>
                <b-form-input v-model="insData.uno" readonly />
              </td>
              <th>Transaction Success Yn</th>
              <td>
                <b-form-select
                  v-select-mix
                  v-model="insData.tranSuccessYn"
                  :options="useYns"
                  value-field="value"
                  text-field="name"
                  readonly
                />
              </td>
              <th>Branch Code</th>
              <td><b-form-input v-model="insData.brnCode" readonly /></td>
            </tr>
            <tr>
              <th>IP Address</th>
              <td><b-form-input v-model="insData.ipAddress" readonly /></td>
              <th colspan="6"></th>
            </tr>
            <tr>
              <th>Request Content</th>
              <td colspan="7">
                <textarea style="width: 100%; height: 100px" v-model="insData.reqCtnt" readonly></textarea>
              </td>
            </tr>
            <tr>
              <th>Response Content</th>
              <td colspan="7">
                <textarea style="width: 100%; height: 100px" v-model="insData.resCtnt" readonly></textarea>
              </td>
            </tr>
            <tr>
              <th>Error Code</th>
              <td>
                <b-form-input v-model="insData.errCode" readonly />
              </td>
              <th>Error Content</th>
              <td colspan="5">
                <textarea style="width: 100%; height: 100px" v-model="insData.errCtnt" readonly></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- //con_area -->
</template>
