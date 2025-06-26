<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

import dayjs from 'dayjs';

const dateStart = ref(dayjs().format('DD-MM-YYYY'));
const dateEnd = ref(dayjs().format('DD-MM-YYYY'));
</script>
<template>
  <div>
    <h1>Vue Datepicker</h1>

    <div>
      <b-date-picker v-model:modelValue="dateStart" />
      <p>Start Date: '{{ dateStart }}'</p>
    </div>
    <div>
      <b-date-picker v-model:modelValue="dateEnd" />
      <p>End Date: '{{ dateEnd }}'</p>
    </div>
  </div>
</template>
