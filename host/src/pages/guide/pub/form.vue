<script setup>
  import dayjs from 'dayjs';

  const text = ref('');
  const value = ref('');
  const status = ref('');
  const dateStart = ref(dayjs().format('YYYY-MM-DD'));
  const selected = ref(['orange']);
  const options = ref([
    { text: 'Orange', value: 'orange' },
    { text: 'Apple', value: 'apple' },
    { text: 'Pineapple', value: 'pineapple' },
    { text: 'Grape', value: 'grape' },
  ]);
  const perPage = ref(['10']);
  const items = [
    { id: 1, first_name: 'Fred', last_name: 'Flintstone' },
    { id: 2, first_name: 'Wilma', last_name: 'Flintstone' },
    { id: 3, first_name: 'Barney', last_name: 'Rubble' },
    { id: 4, first_name: 'Betty', last_name: 'Rubble' },
    { id: 5, first_name: 'Pebbles', last_name: 'Flintstone' },
    { id: 6, first_name: 'Bamm Bamm', last_name: 'Rubble' },
    { id: 7, first_name: 'The Great', last_name: 'Gazzoo' },
    { id: 8, first_name: 'Rockhead', last_name: 'Slate' },
    { id: 9, first_name: 'Pearl', last_name: 'Slaghoople' },
    { id: 10, first_name: 'Pearl', last_name: 'Slaghoople' },
  ];
</script>

<template>
  <!-- content -->
  <div class="contWrap">
    <div class="tabsbox">
      <div class="btn_area">
        <b-button class="btn">탭 우측버튼 추가</b-button>
      </div>
      <b-tabs content-class="tabarea">
        <b-tab title="form type" active>
          <b-tabs content-class="tabarea">
            <b-tab title="탭안에 탭" active> </b-tab>
            <b-tab title="탭안에 탭"> </b-tab>
          </b-tabs>

          <ul class="title_area">
            <li>
              <h2><span></span>form type</h2>
            </li>
          </ul>
          <ul class="notiarea">
            <li>제목(th)은 오른쪽 정렬 기본</li>
            <li>
              입력창 넓이값 기본 100% - 고정 넓이값 필요시 : (예시)<span class="fc_red"> style="width:200px;" </span>
            </li>
            <li>필수값 ( th, form 등 ) 적용 : <span class="fc_red"> class="req"</span></li>
            <li>Datepicker 필수값 적용 : <span class="fc_red"> class="dp_req"</span></li>

            <li>
              2개이상 multi ( form + 버튼 + 텍스트 등 ) 조합일 경우 이를 감싼 후 적용 :
              <span class="fc_red"> class="form_box"</span>
            </li>
          </ul>
          <div class="boardwrite">
            <table>
              <colgroup>
                <col width="110px;" />
                <col width="" />
                <col width="100px;" />
                <col width="" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="req">필수값적용</th>
                  <td>
                    <div class="form_box">
                      <b-form-input
                        v-model="text"
                        placeholder="class= req / 넓이값 200px 고정 "
                        class="req"
                        style="width: 200px"
                      ></b-form-input>
                      <b-form-input
                        v-model="text"
                        placeholder="disabled "
                        class="req"
                        style="width: 200px"
                        disabled
                      ></b-form-input>
                    </div>
                  </td>
                  <th class="req">class="req"</th>
                  <td>
                    <div class="form_box">
                      <b-form-select v-model="selected" :options="options" class="req"></b-form-select>
                      <b-form-select v-model="selected" :options="options" class="req" disabled></b-form-select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>input</th>
                  <td>
                    <div class="form_box">
                      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
                      <b-form-input v-model="text" placeholder="disabled" disabled></b-form-input>
                      <b-form-input v-model="text" placeholder="readonly" readonly></b-form-input>
                    </div>
                  </td>
                  <th>select</th>
                  <td>
                    <div class="form_box">
                      <b-form-select v-model="selected" :options="options"></b-form-select>
                      <b-form-select v-model="selected" :options="options" disabled></b-form-select>
                      <b-form-select v-model="selected" :options="options" class="read-only"></b-form-select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>radio</th>
                  <td>
                    <b-form-group label="Inline radios (default)" v-slot="{ ariaDescribedby }" class="radioArea">
                      <b-form-radio-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="radio-inline"
                      ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group label="Inline radios (default)" v-slot="{ ariaDescribedby }" class="radioArea">
                      <b-form-radio-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="radio-inline"
                        disabled
                      ></b-form-radio-group>
                    </b-form-group>
                  </td>
                  <th>radio</th>
                  <td>
                    <b-form-group label="Stacked radios" v-slot="{ ariaDescribedby }" class="radioArea">
                      <b-form-radio-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="radios-stacked"
                        stacked
                      ></b-form-radio-group>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <th>checkbox</th>
                  <td>
                    <b-form-group
                      class="checkArea"
                      label="Form-checkbox-group inline checkboxes (default)"
                      v-slot="{ ariaDescribedby }"
                    >
                      <b-form-checkbox-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-1a"
                      ></b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group
                      class="checkArea"
                      label="Form-checkbox-group inline checkboxes (default)"
                      v-slot="{ ariaDescribedby }"
                    >
                      <b-form-checkbox-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-1a"
                        disabled
                      ></b-form-checkbox-group>
                    </b-form-group>
                  </td>
                  <th>checkbox</th>
                  <td>
                    <b-form-group
                      class="checkArea"
                      label="Form-checkbox-group stacked checkboxes"
                      v-slot="{ ariaDescribedby }"
                    >
                      <b-form-checkbox-group
                        v-model="selected"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-2a"
                        stacked
                      ></b-form-checkbox-group>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <th>Datepicker</th>
                  <td>
                    <div class="form_box">
                      <b-date-picker v-model:modelValue="dateStart" />
                      <b-date-picker v-model:modelValue="dateStart" class="dp_req" />
                      <b-date-picker v-model:modelValue="dateStart" disabled />
                    </div>
                  </td>
                  <th>period</th>
                  <td>
                    <div class="form_box">
                      <b-date-picker v-model:modelValue="dateStart" />
                      <span>~</span>
                      <b-date-picker v-model:modelValue="dateStart" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>link</th>
                  <td><b-link href="#foo">Link</b-link></td>
                  <th>Dropdown</th>
                  <td>
                    <b-dropdown id="dropdown-1" text="Dropdown Button">
                      <b-dropdown-item>First Action</b-dropdown-item>
                      <b-dropdown-item>Second Action</b-dropdown-item>
                      <b-dropdown-item>Third Action</b-dropdown-item>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item active>Active action</b-dropdown-item>
                      <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                    </b-dropdown>
                  </td>
                </tr>
                <tr>
                  <th>Textarea</th>
                  <td>
                    <b-form-textarea
                      id="textarea"
                      v-model="text"
                      placeholder="Enter something..."
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <span class="text fr">0 / 500 Byte</span>
                  </td>
                  <th></th>
                  <td class="form_box" style="height: 100%">
                    <b-form-textarea
                      id="textarea"
                      v-model="text"
                      placeholder="disabled..."
                      rows="3"
                      max-rows="6"
                      disabled
                      style="height: 100%"
                    ></b-form-textarea>
                    <b-form-textarea
                      id="textarea"
                      v-model="text"
                      placeholder="readonly..."
                      rows="3"
                      max-rows="6"
                      readonly
                      style="height: 100%"
                    ></b-form-textarea>
                    <b-form-textarea
                      id="textarea"
                      v-model="text"
                      placeholder="스크롤처리를 위해 readonly적용, 하지만 disabled 처럼 배경칼라를 주고 싶을 경우  class= readonly  를 주면 됩니다."
                      rows="3"
                      max-rows="6"
                      readonly
                      class="readonly"
                      style="height: 100%"
                    ></b-form-textarea>
                  </td>
                </tr>
                <tr>
                  <th>그리드 + input</th>
                  <td>
                    <div class="form_box vt">
                      <div class="boardlist" style="height: 186px">
                        <b-table id="my-table" :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
                      </div>
                      <b-form-input v-model="text" style="width: 100px"></b-form-input>
                    </div>
                  </td>
                  <th>그리드</th>
                  <td class="vt">
                    <div class="boardlist">
                      <b-table id="my-table" :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colspan="4" class="tac">2개이상 조합 - class="form_box"를 감싼다.</th>
                </tr>
                <tr>
                  <th>input + select</th>
                  <td>
                    <div class="form_box">
                      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
                      <b-form-select v-model="selected" :options="options"></b-form-select>
                    </div>
                  </td>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <b-form-input v-model="text" placeholder="" style="width: 100px"></b-form-input>
                      <b-button class="ico ico_search">search</b-button>
                      <b-form-select v-model="selected" :options="options"></b-form-select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <b-form-select v-model="selected" class="wper50"></b-form-select>
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        value="accepted"
                        unchecked-value="not_accepted"
                        class="ovWrap"
                      >
                        I accept the terms and use
                      </b-form-checkbox>
                    </div>
                  </td>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <b-form-group
                        label="Inline radios (default)"
                        v-slot="{ ariaDescribedby }"
                        class="radioArea wper100"
                      >
                        <b-form-radio-group
                          v-model="selected"
                          :options="options"
                          :aria-describedby="ariaDescribedby"
                          name="radio-inline"
                        ></b-form-radio-group>
                      </b-form-group>
                      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <b-date-picker v-model:modelValue="dateStart" />
                      <span>~</span>
                      <b-date-picker v-model:modelValue="dateStart" />
                      <b-button class="btn">전체</b-button>
                      <b-button class="btn">3개월</b-button>
                      <b-button class="btn">5개월</b-button>
                    </div>
                  </td>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <span class="text">text prasac</span>
                      <b-date-picker v-model:modelValue="dateStart" />
                      <b-button class="btn btn_line">전체</b-button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    <div class="form_box">
                      <b-form-input v-model="text" class="tar"></b-form-input>
                      <span class="ff_none">㎡</span>
                    </div>
                  </td>
                  <th></th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="boxarea">
            <ul class="title_area sub">
              <li><h2>Detail Content</h2></li>
              <li>
                <b-button class="btn btn_line">Button</b-button>
                <b-button class="btn">Button</b-button>
              </li>
            </ul>

            <div class="boardwrite">
              <table>
                <caption>
                  write edit
                </caption>
                <colgroup>
                  <col width="10%;" />
                  <col width="" />
                  <col width="10%;" />
                  <col width="" />
                  <col width="10%;" />
                  <col width="" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>Menu ID</th>
                    <td>
                      <b-form-input v-model="text" placeholder="disabled" disabled></b-form-input>
                    </td>
                    <th>Menu Name</th>
                    <td colspan="3">
                      <b-form-group label="Inline radios (default)" v-slot="{ ariaDescribedby }" class="radioArea">
                        <b-form-radio-group
                          v-model="selected"
                          :options="options"
                          :aria-describedby="ariaDescribedby"
                          name="radio-inline"
                        ></b-form-radio-group>
                      </b-form-group>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="vt">
                      <div class="boardwrite tb_inner">
                        <p class="dot">class="boardwrite tb_inner"</p>
                        <table>
                          <caption></caption>
                          <colgroup>
                            <col width="130px;" />
                            <col width="" />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th class="req">Income</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                            <tr>
                              <th class="req">Expense</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="boardwrite tb_inner">
                        <p class="dot">Main Income (Self-Employed)</p>
                        <table>
                          <caption></caption>
                          <colgroup>
                            <col width="130px;" />
                            <col width="" />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th class="req">Income</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                            <tr>
                              <th class="req">Expense</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                            <tr>
                              <th class="req">Net Income</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="boardwrite tb_inner">
                        <p class="dot">Main Income (Self-Employed)</p>
                        <table>
                          <caption></caption>
                          <colgroup>
                            <col width="130px;" />
                            <col width="" />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th class="req">Income</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                            <tr>
                              <th class="req">Expense</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                            <tr>
                              <th class="req">Net Income</th>
                              <td><b-form-input v-model="text"></b-form-input></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="req">Menu Level</th>
                    <td>
                      <b-form-select v-model="selected" :options="options"></b-form-select>
                    </td>
                    <th>Main menu</th>
                    <td>
                      <div class="form_box">
                        <b-form-input v-model="text" placeholder="" style="width: 100px"></b-form-input>
                        <b-button class="btn btn_sm">button</b-button>
                        <b-form-select v-model="selected" :options="options"></b-form-select>
                      </div>
                    </td>
                    <th>Middle menu</th>
                    <td>
                      <div class="form_box">
                        <b-date-picker v-model:modelValue="dateStart" />
                        <span>~</span>
                        <b-date-picker v-model:modelValue="dateStart" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-tab>
        <b-tab title="Button type">
          <ul class="title_area sub" style="margin-top: 20px">
            <li>
              <h2>tab type button</h2>
            </li>
          </ul>
          <!-- 탭형태의 버튼 -->
          <div class="btn_tabs">
            <b-button class="btn_tab">form type</b-button>
            <b-button class="btn_tab active">Button type</b-button>
            <b-button class="btn_tab" disabled>etc css</b-button>
          </div>

          <ul class="title_area" style="margin-top: 10px">
            <li>
              <h2>General Button</h2>
            </li>
          </ul>
          <ul class="notiarea">
            <li>화면전체 컨트롤 버튼 : 하단 우측에 배치</li>
            <li>화면 최상단 제목 영역 <span class="fc_red">우측 Help 버튼 공통 </span> 적용 (팝업은 제외)</li>
            <li>기본버튼 : <span class="fc_red"> class=" btn"</span> 기본 클래스명에서 해당 클래스를 추가한다.</li>
            <li>강조버튼 ( btn_primary 추가 ) : <span class="fc_red"> class="btn btn_primary"</span></li>
            <li>line버튼 ( btn_line 추가 ) : <span class="fc_red"> class="btn btn_line"</span></li>
            <li>
              버튼정렬 기본 가운데 정렬 : 좌측정렬 <span class="fc_red"> class="fl"</span> / 우측정렬
              <span class="fc_red"> class="fr"</span>
            </li>
            <li>팝업은 하단 가운데 배치</li>
          </ul>
          <div class="btn_area tal">
            <b-button class="btn btn_primary">Primer</b-button>
            <b-button class="btn btn_primary" disabled>Disabled</b-button>
            <b-button class="btn">Default</b-button>
            <b-button class="btn" disabled>Disabled</b-button>
          </div>

          <ul class="title_area sub" style="margin-top: 20px">
            <li>
              <h2>Inner / Table Control Button</h2>
            </li>
          </ul>
          <div class="btn_area tal">
            <b-button class="btn btn_primary">Prime</b-button>
            <b-button class="btn btn_primary" disabled>Disabled</b-button>
            <b-button class="btn">Default</b-button>
            <b-button class="btn" disabled>Disabled</b-button>
            <b-button class="btn btn_line">Default</b-button>
            <b-button class="btn btn_line" disabled>Disabled</b-button>
          </div>

          <ul class="title_area sub" style="margin-top: 20px">
            <li>
              <h2>Button 배치</h2>
            </li>
          </ul>
          <div class="btn_area">
            <div class="fl">
              <b-button class="btn btn_primary">Left</b-button>
              <b-button class="btn btn_primer" disabled>class="fl"</b-button>
            </div>
            <div class="fr">
              <b-button class="btn">Right</b-button>
              <b-button class="btn" disabled>class="fr"</b-button>
            </div>
            <div class="tac">
              <b-button class="btn">Center</b-button>
              <b-button class="btn" disabled>class="tac"</b-button>
            </div>
          </div>

          <ul class="title_area sub" style="margin-top: 20px">
            <li>
              <h2>아이콘 버튼</h2>
            </li>
          </ul>
          <ul class="notiarea">
            <li>
              아이콘 기본버튼 : <span class="fc_red"> class="ico"</span> 기본 클래스명에서 해당 클래스를 추가한다.
            </li>
            <li>조회 아이콘 : <span class="fc_red"> class="ico ico_search"</span></li>
            <li>plus(추가) 아이콘 : <span class="fc_red"> class="ico ico_plus"</span></li>
            <li>minus(삭제) 아이콘 : <span class="fc_red"> class="ico ico_minus"</span></li>
            <li>plus(추가) 라인배경 : <span class="fc_red"> class="ico ico_plus ico_line"</span></li>
            <li>minus(삭제) 라인배경: <span class="fc_red"> class="ico ico_minus ico_line"</span></li>
            <li>list(리스트) 아이콘 : <span class="fc_red"> class="ico ico_list ico_line"</span></li>
          </ul>
          <div>
            <b-button class="ico ico_search">search</b-button>
            <b-button class="ico ico_search" disabled="">search</b-button>
            <b-button class="ico ico_plus">plus</b-button>
            <b-button class="ico ico_plus" disabled="">plus</b-button>
            <b-button class="ico ico_minus">minus</b-button>
            <b-button class="ico ico_minus" disabled="">minus</b-button>
            <b-button class="ico ico_plus ico_line">plus</b-button>
            <b-button class="ico ico_plus ico_line" disabled="">plus</b-button>
            <b-button class="ico ico_minus ico_line">minus</b-button>
            <b-button class="ico ico_minus ico_line" disabled="">minus</b-button>
            <b-button class="ico ico_list ico_line">list</b-button>
            <b-button class="ico ico_list ico_line" disabled="">list</b-button>
          </div>
        </b-tab>
        <b-tab title="etc css">
          <ul class="notiarea mb20">
            <li class="dot">
              그리드(리스트) 주요내용
              <ul>
                <li class="hyphen">
                  그리드 상단에<span class="fc_red"> Total 100 show selectbox (10개 , 20개, 30개, ...)</span>
                </li>
                <li class="hyphen">
                  그리드(리스트) 페이지 번호 적용 ( 상황에 맞게 적용 미적용 ) - 적용시 [ NO ] 로 통일한다.
                </li>
                <li class="hyphen">row 선택시 tr에 <span class="fc_red">class= " active " </span> 적용</li>
                <li class="hyphen">
                  라벨(텍스트) 없이 체크박스만 있을 경우 <span class="fc_red">class= " only-ch " </span> 적용
                </li>
              </ul>
            </li>
            <li class="dot">Transaction 영역 <span class="fc_red">우측 Execute 버튼 </span> 적용</li>
            <li class="dot">
              팝업일 경우 실행버튼은 그리드 입력창 <span class="fc_red">상단 우측 Execute 버튼 </span> 적용
            </li>
          </ul>

          <ul class="boardlist_top">
            <li class="form_box">
              <h2>sub title</h2>
              <p class="text">Total <span>100</span></p>
              <span class="text">show</span>
              <b-form-select v-model="selected" :options="options"></b-form-select>
            </li>
            <li>
              <b-button class="btn btn_line">button</b-button>
              <b-button class="btn">button</b-button>
            </li>
          </ul>

          <div class="boardwrite">
            <table>
              <colgroup>
                <col width="150px;" />
                <col width="40%" />
                <col width="150px;" />
                <col width="" />
              </colgroup>
              <tbody>
                <tr>
                  <th>좌우정렬</th>
                  <td><span>tal (왼쪽) / tac (가운데) / tar (오른쪽)</span></td>
                  <th>상하정렬</th>
                  <td><span>vt (위쪽) / vm (가운데) / vb (아래쪽) </span></td>
                </tr>
                <tr>
                  <th>padding</th>
                  <td>
                    <span>pt (위쪽) - pt3, pt5 ~ pt20</span> <br />
                    <span>pr (오른쪽) - pr3, pr5 ~ pr20</span> <br />
                    <span>pb (아래쪽) - pb3, pb5 ~ pb20</span> <br />
                    <span>pl (왼쪽) - pl3, pl5 ~ pl20</span> <br />
                    5px 부터 5단위 20까지
                  </td>
                  <th>margin</th>
                  <td>
                    <span>mt (위쪽) - mt0, mt3, mt5 ~ mt20</span> <br />
                    <span>mr (오른쪽) - mr0, mr3, mr5 ~ mr20</span> <br />
                    <span>mb (아래쪽) - mb0, mb3, mb5 ~ mb20</span> <br />
                    <span>ml (왼쪽) - ml0, ml3, ml5 ~ ml20</span> <br />
                    5px 부터 5단위 20까지<br />
                    mg_auto ( margin:auto )
                  </td>
                </tr>
                <tr>
                  <th>width ( % )</th>
                  <td>
                    <span
                      >wper1 (width:1%) / wper10 (width:10%) - 10% ~ 50%까진 5단위 <br />wper100 (width:100%) - 50% ~
                      100% 까지는 10단위</span
                    >
                  </td>
                  <th>폰트칼라</th>
                  <td>
                    <span class="fc_black mr15">fc_black</span>
                    <span class="fc_white mr15" style="background: #000; padding: 0 10px">fc_white</span>
                    <span class="fc_red mr15">fc_red</span>
                    <span class="fc_blue mr15">fc_blue</span>
                    <span class="fc_green mr15">fc_green</span>
                  </td>
                </tr>
                <tr>
                  <th>보더라인 없애기</th>
                  <td>
                    <span>borTn (위쪽) / borRn (오른쪽) / borBn (아래쪽) / borLn (왼쪽)</span>
                  </td>
                  <th>보더라인 넣기</th>
                  <td>
                    <span>borT (위쪽) / borR (오른쪽) / borB (아래쪽) / borL (왼쪽)</span>
                  </td>
                </tr>
                <tr>
                  <th>한줄 텍스트 해제</th>
                  <td>
                    <span>ws_normal</span>
                  </td>
                  <th>점선처리 하기</th>
                  <td>
                    <span>ellipsis</span>
                  </td>
                </tr>
                <tr>
                  <th>텍스트 앞에 블릿</th>
                  <td>
                    <span class="dot"> class = " dot " </span>
                    <span class="hyphen"> class = " hyphen "</span>
                    <span class="aste"> class = " aste "</span>
                  </td>
                  <th>class="blink"</th>
                  <td>
                    <span class="blink">깜빡이는 효과</span>
                  </td>
                </tr>
                <tr>
                  <th colspan="4" class="tac">배경칼라 - class = " bg_red " / 배경없애기 - class = " bg_none "</th>
                </tr>
                <tr>
                  <td class="bg_red">bg_red</td>
                  <td class="bg_blue">bg_blue</td>
                  <td class="bg_yellow">bg_yellow</td>
                  <td class="bg_green">bg_green</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Transaction distinction -->
          <ul class="notiarea flex_row jc_sb">
            <li class="form_box">
              <span class="text">Transaction Distinction</span>
              <b-form-select v-model="selected" style="width: 120px"></b-form-select>
              <span class="text ml10">1:Register 2:Modify</span>
            </li>
            <li><b-button class="btn">Execute</b-button></li>
          </ul>

          <ul class="notiarea textbox mt20 mb20">
            <li class="title">
              1depth 내용 1111
              <ul>
                <li class="hyphen">
                  2depth 내용
                  <ul>
                    <li class="dot">3depth</li>
                    <li class="dot">3depth</li>
                    <li class="dot">3depth</li>
                  </ul>
                </li>
                <li class="hyphen">
                  2depth text text 2depth text text2depth text text2depth text text2depth text text2depth text text<br />
                  2depth text text 2depth text text2depth text text2
                </li>
              </ul>
            </li>
            <li class="dot">1depth 내용 222</li>
            <li class="aste">1depth 내용 222</li>
          </ul>
          <p class="info_txt">
            class="info_txt" Enter the relevant This is a screen for managing the company's future cash flow information
            in case of overseas corporate credit evluation
          </p>
          <p class="noti">
            ※ class="noti" Enter the relevant This is a screen for managing the company's future cash flow information
            in case of overseas corporate credit evluation
          </p>

          <div class="ds_grid col4 boxarea">
            <div class="col line">
              <ul class="title_area sub mb10">
                <li><h2>Approval Information</h2></li>
              </ul>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
            </div>
            <div class="col line">
              <ul class="title_area sub mb10">
                <li><h2>Approval Information</h2></li>
              </ul>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
            </div>
            <div class="col line">
              <ul class="title_area sub mb10">
                <li><h2>Approval Information</h2></li>
              </ul>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
            </div>
            <div class="col">
              <ul class="title_area sub mb10">
                <li><h2>Approval Information</h2></li>
              </ul>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
              <b-button class="btn btn_line tal mb5 wper100">ccc</b-button>
            </div>
          </div>
          <div class="boxline mt10" style="height: 100px">박스형태로 라인만 필요한 경우 class="boxline"</div>

          <div class="report">
            <p class="title">Report - INC1100M00 / INC1110M00 화면 참고</p>
            <dl>
              <dt>Whistle-blowing System</dt>
              <dd class="hyphen">
                text text 2depth text text2depth text text2depth text text2depth text text2depth text tex
              </dd>
            </dl>
            <dl class="inline">
              <dt>class</dt>
              <dd>class="inline" text2depth text text2depth text text2depth text text2depth text tex</dd>
            </dl>
            <dl class="inline">
              <dt>i n l i n e</dt>
              <dd>text text</dd>
            </dl>
          </div>
        </b-tab>
        <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
      </b-tabs>
    </div>
  </div>

  <!-- //content -->
</template>
