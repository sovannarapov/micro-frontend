<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });
  const nuxtApp = useNuxtApp();
  const pathTest = '/guide/image/control';

  const openImagePopup = () => {
    const options = {
      title: 'File download and image preview',
      width: 1200,
      height: 800,
      component: 'FileImage',
      datas: { test: 'test' },
      closeDatas: { closed: 'closed' },
    };
    usePopup(options);
  };
</script>
<template>
  <div class="boardwrite guide">
    <table>
      <colgroup>
        <col width="200px;" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th>Publishing guide</th>
          <td>
            <b-button variant="light">
              <NuxtLink to="/guide/pub/form">Publishing-form</NuxtLink>
            </b-button>
            <b-button variant="light">
              <NuxtLink to="/guide/pub/list">Publishing-sample</NuxtLink>
            </b-button>
          </td>
        </tr>
        <tr>
          <th>업무 공통 컴포넌트</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>컴포넌트 state 전체 초기화 - store 미사용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/csm/CSM0002M00">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>컴포넌트와 store state 전체 초기화 - store 사용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/csm/CSM0008M00">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>업무 페이지 상단 Title 영역 "business-title"</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/csm/CSM0002M00">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>업무 페이지 실행 영역 "business-exec"</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/csm/CSM0002M00">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>업무 페이지 Paging Display Info 영역 "business-display-info"</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/csm/CSM0002M00">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Alert</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>경고창 설정 및 노출</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/alert">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Dialog</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>컨펌창 설정 및 노출</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/dialog">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Date Picker</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>일, 월, 연 달력 선택 및 초기화. 시작일 제한</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datepicker/single">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>달력 상태 readyonly, disabled 로 변경</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datepicker/singleStatus">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>달력 기간 설정</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datepicker/singleRange">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>

              <!-- <li>
                  <dl>
                    <dt>
                      이중달력 - 작업예정
                    </dt>
                    <dd><b-button disabled class="sm">
                        <NuxtLink to="/guide/datepicker/dual">></NuxtLink>
                      </b-button></dd>
                  </dl>
                </li> -->
            </ul>
          </td>
        </tr>
        <tr>
          <th>Datatable</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>기본형</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/default">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>마스킹 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/masking">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header 고정 및 tbody 스크롤</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/fixHead">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header 고정 및 tbody 스크롤 + footer</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/fixHeadWithFooter">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header column 고정 및 tbody 스크롤</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/fixColumnHead">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header rowspan, colspan + body scroll</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/complexHeader">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header width 고정</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/fixHeaderWidth">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>width 100% 이상의 table header width 강제 고정</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/forceWidth">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>header에 여러줄 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/forceWidth">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>cell 내 text 정렬</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/align">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>checkbox 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/checked">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>row 선택 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/selectable">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>input text field 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/editable">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>selectbox 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/combo">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>cell별 color 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/cellColor">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>cell별 disabled 속성 적용 및 input enter 시 focus 자동 이동</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/cellDisabled">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>cell내 text trim</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/cellTextTrim">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>row 추가, 삭제, 감춤 및 전체 제거</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/addRemove">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>달력 적용</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/datepicker">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>b-table-simple을 사용한 복합 테이블(정적 생성)</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/complexTable">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Export excel</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/exportExcel">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Export excel + style</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/exportStyledExcel">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Import excel</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/importExcel">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Import excel - filter</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/importExcelField">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>row 번호 및 text 공백 처리</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/whiteSpace">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>field toggle (Column)</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/toggleColumn">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Datable 내 item 변경 감지 및 콜백처리</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/datepicker">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>동일한 값을 가진 row 자동 merge</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/merge">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>여신 복합 테이블</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/datatable/full">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Layer Popup</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>레이어팝업 설정 및 노출</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/popup">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Tab</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Bootstrap Tab, 내용 height 토글 Tab</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/tab">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Rest Apis</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Get, Post, Blob file</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/api">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Utils</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Common Codes 호출</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/commonCodes">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Session Info 확인</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/session">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Trim Objects</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Clear Object (Reactive)</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Clear Array (Reactive)</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Empty check (isEmpty)</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Add Comma</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>날짜 차이 계산</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/helpers">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>소수점 계산</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/utils/decimal">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>File</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Upload, download, delete file</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/file/upload">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Image</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Zoom, rotate</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink :to="{ path: pathTest }">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Preview</dt>
                  <dd>
                    <b-button @click="openImagePopup"> Popup</b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Route</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Route 이동 및 데이터 전달</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/route/">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Directives</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Select box에 all 옵션 삽입</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/directives/">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Select box에 key, value 동시 표시</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/directives/">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Input field에 comma 자동 삽입</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/directives/">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Events</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>input text blur event 확인</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/events">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>input 연산</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/events">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
              <li>
                <dl>
                  <dt>Event bus로 Component간 데이터 전송</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/popup">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>OZ Report Popup</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>OZ Report 호출 및 파라미터 전송</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/report">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>Chart</th>
          <td>
            <ul>
              <li>
                <dl>
                  <dt>Line</dt>
                  <dd>
                    <b-button class="sm">
                      <NuxtLink to="/guide/chart">></NuxtLink>
                    </b-button>
                  </dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <table>
      <colgroup>
        <col width="200px;" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th>Vue 3</th>
          <td>
            <NuxtLink to="https://v3-docs.vuejs-korea.org/guide/introduction.html" target="_blank">가이드</NuxtLink
            >&nbsp;
            <NuxtLink to="https://v3-docs.vuejs-korea.org/examples/#hello-world" target="_blank">예제</NuxtLink>&nbsp;
            <NuxtLink to="https://v3-docs.vuejs-korea.org/api/" target="_blank">API</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>Router</th>
          <td>
            <NuxtLink to="https://router.vuejs.org/guide/" target="_blank">가이드</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>Pinia (Store)</th>
          <td>
            <NuxtLink to="https://pinia.vuejs.org/core-concepts/" target="_blank">가이드</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>Bootstrap</th>
          <td>
            <NuxtLink to="https://bootstrap-vue.org/docs/components" target="_blank">가이드</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>Day.js</th>
          <td>
            <NuxtLink to="https://day.js.org/docs/en/installation/installation" target="_blank">가이드</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>Chrome devtool</th>
          <td>
            <NuxtLink
              to="https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd"
              target="_blank"
              >설치</NuxtLink
            >&nbsp;<NuxtLink to="https://dreamcoding.tistory.com/34" target="_blank">설명</NuxtLink>
          </td>
        </tr>
        <tr>
          <th>HTML editor</th>
          <td>
            <NuxtLink to="https://htmlg.com/html-editor/" target="_blank">Editor</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
