<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

import dayjs from 'dayjs';

const dateRange = 7;
const today = ref(new Date());

// 여신 DDMMYYYY
const dateStart = ref(dayjs(today.value).format('DDMMYYYY'));
const dateEnd = ref(dayjs(new Date(today.value)).add(dateRange, 'days').format('DDMMYYYY'));
const rangedDate = ref();

rangedDate.value = [dateStart.value, dateEnd.value];

// 정보 YYYYMMDD
const dateStartInfo = ref(dayjs(today.value).format('YYYYMMDD'));
const dateEndInfo = ref(dayjs(new Date(today.value)).add(dateRange, 'days').format('YYYYMMDD'));
const rangedDateInfo = ref();

rangedDateInfo.value = [dateStartInfo.value, dateEndInfo.value];
</script>
<template>
  <div>
    <h1>Vue Datepicker</h1>

    <br /><br />
    <h2><strong>일달력 고정 선택</strong></h2>
    <br />
    <div>
      여신
      <b-date-picker-range v-model="rangedDate" range :dateRange="dateRange" />
      <p>Selected date: {{ rangedDate }}</p>
    </div>
    <br /><br />
    <div>
      정보
      <b-date-picker-range v-model="rangedDateInfo" range :dateRange="dateRange" dateFormat="yyyyMMdd" />
      <p>Selected date: {{ rangedDateInfo }}</p>
    </div>
    <br />
  </div>
</template>
