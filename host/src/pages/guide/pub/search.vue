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
  <div class="contWrap">
    <ul class="title_area">
      <li>
        <h2><span>[RBE06218000]</span>Search Type</h2>
      </li>
    </ul>

    <h2 class="mb5">기본 Type - 2줄이상일때</h2>
    <!-- searchArea -->
    <div class="search_area">
      <table>
        <caption></caption>
        <tbody>
          <tr>
            <th class="req">title input</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="text" style="width: 100px"></b-form-input>
                <b-button class="ico ico_search">button</b-button>
                <b-form-select v-model="selected"></b-form-select>
              </div>
            </td>
            <th>select</th>
            <td>
              <b-form-select v-model="selected" :options="options"></b-form-select>
            </td>
            <th>title radio</th>
            <td>
              <b-form-checkbox
                id="checkbox-1"
                v-model="status"
                name="checkbox-1"
                value="accepted"
                unchecked-value="not_accepted"
              >
                I accept the terms and use
              </b-form-checkbox>
            </td>
          </tr>
          <tr>
            <th>select+input</th>
            <td>
              <div class="form_box">
                <b-form-select v-model="selected" :options="options"></b-form-select>
                <b-form-input v-model="text" placeholder=""></b-form-input>
              </div>
            </td>
            <th>periperiodperiodperiodperiodod</th>
            <td>
              <b-form-input v-model="text" placeholder=""></b-form-input>
            </td>
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
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_area">
        <b-button class="btn btn_primary" title="Search">Search</b-button>
      </div>
    </div>
    <!-- //searchArea -->

    <h2 class="mb5">기본 Type - 1줄일때</h2>
    <!-- searchArea -->
    <div class="search_area">
      <table>
        <caption></caption>
        <tbody>
          <tr>
            <th>select+input</th>
            <td>
              <div class="form_box">
                <b-form-select v-model="selected" :options="options"></b-form-select>
                <b-form-input v-model="text" placeholder=""></b-form-input>
              </div>
            </td>
            <th>period</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="text" placeholder=""></b-form-input>
                <span class="text">~</span>
                <b-form-input v-model="text" placeholder=""></b-form-input>
              </div>
            </td>
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
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_area">
        <b-button class="btn btn_primary" title="Search">Search</b-button>
      </div>
    </div>
    <!-- //searchArea -->

    <h2 class="mb5">tb_full 추가 - 1줄일때</h2>
    <!-- searchArea -->
    <div class="search_area tb_full">
      <table>
        <caption></caption>
        <colgroup>
          <col width="85px" />
          <col width="" />
          <col width="80px" />
          <col width="" />
          <col width="80px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th>select+input</th>
            <td>
              <div class="form_box">
                <b-form-select v-model="selected" :options="options"></b-form-select>
                <b-form-input v-model="text" placeholder=""></b-form-input>
              </div>
            </td>
            <th>period</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="text" placeholder=""></b-form-input>
                <span class="text">~</span>
                <b-form-input v-model="text" placeholder=""></b-form-input>
              </div>
            </td>
            <th>radioArea</th>
            <td>
              <b-form-group class="radioArea">
                <b-form-radio-group
                  v-model="selected"
                  :options="options"
                  :aria-describedby="ariaDescribedby"
                  name="radio-inline"
                ></b-form-radio-group>
              </b-form-group>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_area">
        <b-button class="btn btn_primary" title="Search">Search</b-button>
      </div>
    </div>
    <!-- //searchArea -->

    <h2 class="mb5">tb_full 추가 - 2줄일때</h2>
    <!-- searchArea -->
    <div class="search_area tb_full">
      <table>
        <caption></caption>
        <colgroup>
          <col width="85px" />
          <col width="" />
          <col width="100px" />
          <col width="" />
          <col width="120px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th>select+input</th>
            <td>
              <b-form-select v-model="selected" :options="options"></b-form-select>
            </td>
            <th>period period</th>
            <td colspan="3">
              <div class="form_box">
                <b-form-input v-model="text" placeholder="" style="width: 100px"></b-form-input>
                <span class="text">~</span>
                <b-form-input v-model="text" placeholder="" style="width: 100px"></b-form-input>
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
              </div>
            </td>
          </tr>
          <tr>
            <th>select+input</th>
            <td>
              <div class="form_box">
                <b-form-select v-model="selected" :options="options"></b-form-select>
                <b-form-input v-model="text" placeholder=""></b-form-input>
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
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_area">
        <b-button class="btn btn_primary" title="Search">Search</b-button>
      </div>
    </div>
    <!-- //searchArea -->

    <h2 class="mb5">tb_full 추가 - 여러줄 검색조건 100% 버튼 하단 오른쪽 배치</h2>
    <div class="search_area tb_full">
      <table class="wper100">
        <caption></caption>
        <colgroup>
          <col width="200px" />
          <col width="300px" />
          <col width="200px" />
          <col width="300px" />
          <col width="180px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th>Branch Code</th>
            <td>
              <div class="form_box">
                <b-form-input v-model="text" class="tac" style="width: 60px"></b-form-input>
                <b-button class="ico ico_search">search</b-button>
                <b-form-input v-model="text" disabled></b-form-input>
              </div>
            </td>
            <th>Guarator Customer Identifier</th>
            <td colspan="3">
              <div class="form_box">
                <b-form-input v-model="text" class="tac" style="width: 100px"></b-form-input>
                <b-button class="ico ico_search">search</b-button>
                <b-form-input v-model="text" class="tac" style="width: 80px" disabled></b-form-input>
                <b-form-input v-model="text" disabled></b-form-input>
              </div>
            </td>
          </tr>
          <tr>
            <th>Collateral Large Classification</th>
            <td>
              <b-form-select v-model="selected" disabled></b-form-select>
            </td>
            <th>Collateral Type</th>
            <td>
              <b-form-select v-model="selected" disabled></b-form-select>
            </td>
            <th>Collateral Status</th>
            <td>
              <b-form-select v-model="selected"></b-form-select>
            </td>
          </tr>
          <tr>
            <th>Collateral Inquire Distinction</th>
            <td>
              <b-form-select v-model="selected"></b-form-select>
            </td>
            <th>Collateral Inquire Date</th>
            <td>
              <div class="form_box">
                <b-date-picker v-model:modelValue="dateStart" />
                <span>~</span>
                <b-date-picker v-model:modelValue="dateStart" />
              </div>
            </td>
            <th>Linked Account No.Status</th>
            <td>
              <b-form-select v-model="selected"></b-form-select>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_area wper100 tar mt5 mb0">
        <b-button class="btn btn_primary" title="Search">Search</b-button>
      </div>
    </div>

    <h2 class="mb5">
      dl dt dd - 화면이 줄면 아래로 떨어짐 (단 타이틀에 배열을 맞추려면 width값을 가장 긴 타이틀에 맞춰서 줘야함.)
    </h2>
    <div class="search_area">
      <div class="sch_dl">
        <dl>
          <dt class="req">title input</dt>
          <dd><b-form-input v-model="text" placeholder=""></b-form-input></dd>
        </dl>
        <dl>
          <dt class="req">title input</dt>
          <dd><b-form-input v-model="text" placeholder=""></b-form-input></dd>
        </dl>
        <dl>
          <dt>select</dt>
          <dd><b-form-select v-model="selected" :options="options"></b-form-select></dd>
        </dl>
        <dl>
          <dt>select+input</dt>
          <dd>
            <div class="form_box">
              <b-form-input v-model="text" style="width: 80px"></b-form-input>
              <b-button class="ico ico_search">button</b-button>
              <b-form-select v-model="selected" style="width: 150px"></b-form-select>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>checkbox</dt>
          <dd>
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
          </dd>
        </dl>
      </div>

      <div class="btn_area">
        <b-button class="btn btn_primary" title="Inquiry">Inquiry</b-button>
      </div>
    </div>
  </div>
</template>
