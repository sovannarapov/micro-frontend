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
  const fields = reactive([
    { key: 'first_name', label: 'crossline', class: 'crossline text-center' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'age', label: 'Age' },
  ]);
  const items = reactive([
    { age: 40, first_name: 'crossline ', last_name: 'Macdonald' },
    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
    { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
    { age: 38, first_name: 'Jami7', last_name: 'Carney2' },
    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  ]);
</script>

<template>
  <div class="contWrap">
    <ul class="title_area">
      <li>
        <h2><span>[RBE06218000]</span>Sample screen</h2>
      </li>
      <li class="form_box">
        <b-button class="btn">Help</b-button>
      </li>
    </ul>

    <!-- searchArea -->
    <div class="search_area">
      <table>
        <caption></caption>
        <tbody>
          <tr>
            <th class="req">title input</th>
            <td><b-form-input v-model="text" placeholder=""></b-form-input></td>
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
        <b-button class="btn btn_primary" title="Inquiry">Inquiry</b-button>
      </div>
    </div>
    <!-- //searchArea -->

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

    <div class="con_area">
      <!-- 진행중 ing / 완료 done  -->
      <ul class="process">
        <li class="arr ing">Loan <br />Application</li>
        <li class="arr done">Credit <br />Assessment</li>
        <li class="arr">Collateral <br />Assessment</li>
        <li class="arr">Loan/Facility <br />Registration</li>
        <li class="arr">Evaluation <br />Review</li>
        <li class="arr">Evaluation <br />Approval</li>
        <li class="arr">Apply</li>
        <li class="arr">Disburesment</li>
      </ul>
      <ul class="boardlist_top">
        <li class="form_box">
          <p class="text">Total <span>100</span></p>
          <span class="text">show</span>
          <b-form-select v-model="selected" :options="options"></b-form-select>
        </li>
        <li class="form_box">
          <!-- paginate -->
          <div class="paginate">
            <ul>
              <li class="first disabled"><a href="#link">First</a></li>
              <li class="pl10 pr10">1 of 20</li>
              <li class="last"><a href="#link">Last</a></li>
            </ul>
          </div>
          <span class="text">message</span>
          <b-button class="btn btn_line btn_sm">Add</b-button>
          <b-button class="btn btn_line btn_sm">Del</b-button>
        </li>
      </ul>

      <div class="boardlist">
        <b-table
          id="my-table"
          :sticky-header="stickyHeader"
          :no-border-collapse="noCollapse"
          responsive
          :items="items"
          :fields="fields"
        >
        </b-table>
      </div>
      <!-- paginate -->
      <b-pagination
        class="paginate"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        first-text="<<"
        prev-text="<"
        next-text=">"
        last-text=">>"
      ></b-pagination>

      <!-- Transaction distinction -->
      <ul class="notiarea flex_row jc_sb">
        <li class="form_box">
          <span class="text">Transaction distinction</span>
          <b-form-select v-model="selected" :options="options"></b-form-select>
          <span class="text ml10">1:Register 2:Modify</span>
        </li>
        <li><b-button class="btn">Execute</b-button></li>
      </ul>

      <!-- Detail -->
      <div class="boxarea">
        <ul class="title_area sub">
          <li><h2>Detail Content</h2></li>
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

      <div class="btn_area tar">
        <b-button class="btn btn_primary">Primer</b-button>
        <b-button class="btn">Default</b-button>
        <b-button class="btn btn_line btn_sm">Default</b-button>
        <b-button class="btn btn_line btn_sm" disabled>Disabled</b-button>
      </div>
    </div>

    <div class="toast-pop success">
      "The transaction has been successfully completed."
      <b-button class="btn-close"></b-button>
    </div>
    <div class="toast-pop fail">
      "The transaction has failed."
      <b-button class="btn-close"></b-button>
    </div>
  </div>
</template>
