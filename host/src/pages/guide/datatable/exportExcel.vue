<script setup>
  import {
    getSessionInfo,
    allowNumberOnly,
    parseDateInfo,
    parseDateLoan,
    dateToDDMMMYYYY,
  } from '@/common/util/helpers';
  definePageMeta({
    layout: 'guide',
  });

  const tableToExportSimple = ref();
  const tableToExport = ref();
  const exportName = ref('');

  const fields = reactive([
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'date', label: 'Date' },
  ]);
  const items = reactive([
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
    { date: '12122022', first_name: 'Jami', last_name: 'Carney' },
  ]);

  const options = [
    { value: 45, text: '45' },
    { label: 46, text: '46' },
  ];
  const selected = ref(46);
  const tempInputValue = ref('test temp');
</script>

<template>
  <h1>Datatable - export html table</h1>
  <br />

  <b-form-input v-model="exportName" placeholder="Export할 excel명 지정" />
  <br />
  <b-excel-util mode="export" :targetTable="tableToExportSimple" :name="exportName" button-name="export 이름 지정" />
  <b-excel-util
    mode="export"
    :targetTable="tableToExportSimple"
    :name="exportName"
    button-name="export 이름 지정 disabled"
    :isDisabled="true"
  />
  <br /><br />
  <div ref="tableToExportSimple" class="boardlist">
    <b-table-simple responsive>
      <caption>
        Items sold in August, grouped by Country and City:
      </caption>
      <colgroup>
        <col />
        <col />
      </colgroup>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <colgroup>
        <col />
        <col />
      </colgroup>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th colspan="2">Region</b-th>
          <b-th colspan="3">Clothes</b-th>
          <b-th rowspan="2">Accessories</b-th>
          <b-th rowspan="2">Rings</b-th>
        </b-tr>
        <b-tr>
          <b-th>Country</b-th>
          <b-th>City</b-th>
          <b-th>Trousers</b-th>
          <b-th>Skirts</b-th>
          <b-th>Dresses</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr>
          <b-th rowspan="3">Belgium</b-th>
          <b-th class="text-right">Antwerp</b-th>
          <b-td>0056</b-td>
          <b-td>22</b-td>
          <b-td>43</b-td>
          <b-td variant="success">72</b-td>
          <b-td>23</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Gent</b-th>
          <b-td
            ><b-form-select v-model="selected" :options="options"></b-form-select>
            <span class="print-area">{{ selected }}</span></b-td
          >
          <b-td variant="warning">18</b-td>
          <b-td>50</b-td>
          <b-td>61</b-td>
          <b-td variant="danger">15</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Brussels</b-th>
          <b-td>51</b-td>
          <b-td>27</b-td>
          <b-td>38</b-td>
          <b-td>69</b-td>
          <b-td>28</b-td>
        </b-tr>
        <b-tr>
          <b-th rowspan="17">The Netherlands</b-th>
          <b-th class="text-right">Amsterdam</b-th>
          <b-td variant="success">89</b-td>
          <b-td>34</b-td>
          <b-td>69</b-td>
          <b-td>85</b-td>
          <b-td>38</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td>
        </b-tr>
        <b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td
            ><b-form-input v-model="tempInputValue"></b-form-input
            ><span class="print-area">{{ tempInputValue }}</span></b-td
          >
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td> </b-tr
        ><b-tr>
          <b-th class="text-right">Utrecht</b-th>
          <b-td>80</b-td>
          <b-td variant="danger">12</b-td>
          <b-td>43</b-td>
          <b-td>36</b-td>
          <b-td variant="warning">19</b-td>
        </b-tr>
      </b-tbody>
      <b-tfoot>
        <b-tr>
          <b-td colspan="7" variant="secondary" class="text-right"> Total Rows: <b>5</b> </b-td>
        </b-tr>
      </b-tfoot>
    </b-table-simple>
  </div>
  <br /><br />
  <b-excel-util mode="export" :targetTable="tableToExport" :name="exportName" />
  <br />
  <div ref="tableToExport" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(first_name)="row">
        <!-- input 요소들은 exel로 export가 안되므로 span추가  -->
        <b-form-input v-model="row.item.first_name" placeholder="Enter your name"></b-form-input>
        <span class="print-area">{{ row.item.first_name }}</span>
      </template>
      <template #cell(date)="row">
        <b-date-picker v-model="row.item.date" />
        <span class="print-area">{{ dateToDDMMMYYYY(row.item.date) }}</span>
      </template>
    </b-table>
  </div>
</template>
