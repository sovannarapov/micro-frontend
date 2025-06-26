<script setup>
  definePageMeta({
    layout: 'guide',
  });

  const tableau = ref();
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
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
    { date: '12122022', first_name: 'Jami', last_name: 'Carney' },
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
    { date: '12122022', first_name: 'Jami', last_name: 'Carney' },
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
    { date: '12122022', first_name: 'Jami', last_name: 'Carney' },
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
    { date: '12122022', first_name: 'Jami', last_name: 'Carney' },
    { date: '12122022', first_name: 'Dickerson', last_name: 'Macdonald' },
    { date: '12122022', first_name: 'Larsen', last_name: 'Shaw' },
    {
      date: '12122022',
      first_name: 'Geneva',
      last_name: 'Wilson',
    },
  ]);

  /*
   * b-table item 변경 감지
   * 마지막으로 변경된 item의 index와 값 반환
   */

  // 변경 감지할 key 값 입력
  const chndName = useCompareData(
    'first_name',
    computed(() => items.map(item => item.first_name)),
  );
  const chndDate = useCompareData(
    'date',
    computed(() => items.map(item => item.date)),
  );

  // 변경 후 콜백 처리
  watch(
    () => chndName.first_name,
    value => {
      console.log('name changed : ', value);
    },
    { deep: true },
  );
  watch(
    () => chndDate.date,
    value => {
      console.log('date changed : ', value);
    },
    { deep: true },
  );
  const getFocus = () => {
    const table = tableau.value.querySelector('table tbody');
    const datePickers = table.querySelectorAll('.dp__input_wrap');
    const focusabled = datePickers[10].querySelector('input');

    focusabled.focus();
    // focusabled.select();
    // ocusabled.click();
  };
  const onFocus = () => {
    const options = { title: 'alert', contents: 'focus alert', callback: getFocus };
    useAlert(options);
  };
</script>

<template>
  <h1>Datatable - datepicker</h1>

  <div ref="tableau" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(first_name)="row">
        <b-form-input v-model="row.item.first_name" placeholder="Enter your name"></b-form-input>
      </template>
      <template #cell(date)="row">
        <b-date-picker v-model="row.item.date" @closed="console.log('datepicker closed')" />
      </template>
    </b-table>
  </div>
  <div>
    <b-button @click="onFocus">focus</b-button>
  </div>
  <br />
  <div>
    <p>변경된 요소 :</p>
    <br />
    <div>{{ chndName }}</div>
  </div>
</template>
