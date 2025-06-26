<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

import dayjs from 'dayjs';

// 여신 DDMMYYYY
const today = dayjs(new Date()).format('DDMMYYYY');
const dateStart = ref(today);
const dateEnd = ref('');
const disableCalendar = ref(true);

// 정보 YYYYMMDD
const todayInfo = dayjs(new Date()).format('YYYYMMDD');
const dateStartInfo = ref(todayInfo);

const thisMonth = dayjs(new Date()).format('MMYYYY');
const monthStart = ref(thisMonth);

const thisMonthInfo = dayjs(new Date()).format('YYYYMM');
const monthStartInfo = ref(thisMonthInfo);

const thisYear = dayjs(new Date()).format('YYYY');
const year = ref(thisYear);

const clearDate = () => {
  dateStart.value = '';
  dateStartInfo.value = '';
};
</script>
<template>
  <div>
    <h1>Vue Datepicker</h1>

    <br /><br />
    <h2><strong>일달력</strong></h2>
    <br />
    <div>
      여신 DISABLED
      <b-date-picker :disabled="disableCalendar" v-model="dateStart" />
      <p>Selected date: {{ dateStart }}</p>

      <br /><br />
      <b-button @click="() => (disableCalendar = !disableCalendar)">toggle DISABLED</b-button>
    </div>
    <br /><br />
    <div>
      정보 READONLY
      <b-date-picker readonly v-model="dateStartInfo" dateFormat="yyyyMMdd" />
      <p>Selected date: {{ dateStartInfo }}</p>
    </div>
    <br />
    <div>
      <b-button @click="clearDate">clear</b-button>
    </div>
    <br />
    <hr />
    <br /><br />
    <h2>월달력</h2>
    <br />
    <div>
      여신
      <b-month-picker v-model="monthStart" />
      <p>Selected date: {{ monthStart }}</p>
    </div>
    <div>
      정보
      <b-month-picker v-model="monthStartInfo" dateFormat="yyyyMM" />
      <p>Selected date: {{ monthStartInfo }}</p>
    </div>
    <br />
    <hr />
    <br /><br />
    <h2>연달력</h2>
    <br />
    <div>
      <b-year-picker v-model="year" />
      <p>Selected date: {{ year }}</p>
    </div>
    <div>ព័ត៌មានកម្ចី</div>
    <div class="khmer">ព័ត៌មានកម្ចី</div>
  </div>
</template>
