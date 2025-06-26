<script setup>
  import dayjs from 'dayjs';

  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  // 여신 DDMMYYYY
  const today = dayjs(new Date()).format('DDMMYYYY');
  const dateStart = ref(today);
  const dateEnd = ref(dayjs(new Date()).add(7, 'days').format('DDMMYYYY'));
  const dateServer = ref(null)
  const dateEmpty = ref('')

  // 정보 YYYYMMDD
  const todayInfo = dayjs(new Date()).format('YYYYMMDD');
  const dateStartInfo = ref(todayInfo);
  const dateEndInfo = ref(dayjs(new Date()).add(7, 'days').format('YYYYMMDD'));

  const todayInfoMMM = dayjs(new Date()).format('YYYY-MMM-DD');
  const dateStartInfoMMM = ref(todayInfoMMM);

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

  const tenDaysBefore = ref(dayjs(new Date()).subtract(10, 'days').format('DDMMYYYY'));
  const tenDaysLater = ref(dayjs(new Date('2023-01-01')).add(10, 'days').format('DDMMYYYY'));
  const threeWeeksLater = ref(dayjs(new Date()).add(3, 'week').format('DDMMYYYY'));
  const threeWeeksBefore = ref(dayjs(new Date()).subtract(3, 'week').format('DDMMYYYY'));
  const sixMonthsLater = ref(dayjs(new Date()).add(6, 'month').format('DDMMYYYY'));
  const twoYearsLater = ref(dayjs(new Date()).add(2, 'year').format('DDMMYYYY'));

  const watchTestComp = computed(() => ({ changedDate: dateStart.value }));
  const watchTestRef = ref({ changedDate: dateStart.value });

  watch(
    () => watchTestComp,
    (n, o) => {
      console.log('watchTest computed', n.value);
    },
    { deep: true, immediate: true },
  );

  watch(
    () => watchTestRef,
    (n, o) => {
      console.log('watchTestRef ref', n.value);
    },
    { deep: true, immediate: true },
  );

  const className = ref('test-class');
  const testInput = e => {
    // 변경 값에 따라 className 변경
    if (e === '01062023') className.value = 'test-class-2';
    // console.log('testInput', e);
  };

  const targetTest = ref()

  onMounted(() => {
    // targetTest.value?.calRef.openMenu()
  })

</script>
<template>
  <div>
    <h1>Vue Datepicker</h1>

    <br /><br />
    <h2><strong>일달력</strong></h2>
    <br />
    <div>
      여신
      <b-date-picker ref='targetTest' v-model="dateStart" />
      <p>Selected date: {{ dateStart }}</p>
    </div>
    <br /><br />
    <br />
    <div>
      여신 : input change event 및 class 적용
      <b-date-picker v-model="dateStart" @update:model-value="testInput" :class="className" />
      <p>Selected date: {{ dateStart }}</p>
    </div>
    <br /><br />
    <br />
    <div>
      여신 : 달력 초기값을 비워야 할 경우
      <b-date-picker v-model="dateEmpty" @update:model-value="testInput" :class="className" />
      <p>Selected date: {{ dateEmpty }}</p>
    </div>
    <br /><br />
    <br />
    <div>
      정보
      <b-date-picker v-model="dateStartInfo" dateFormat="yyyyMMdd" />
      <p>Selected date: {{ dateStartInfo }}</p>
    </div>
    <br /><br />
    <div>
      정보
      <b-date-picker v-model="dateStartInfoMMM" dateFormat="yyyy-MMM-dd" />
      <p>Selected date: {{ dateStartInfoMMM }}</p>
    </div>
    <br /><br />
    <div>
      시작일 제한
      <br /><br />
      <div class="inlined">
        여신 <b-date-picker v-model="dateStart" /><b-date-picker v-model="dateEnd" :minDate="dateStart" />
      </div>
      <br />
      <div class="inlined">
        정보 <b-date-picker v-model="dateStartInfo" dateFormat="yyyyMMdd" /><b-date-picker
          v-model="dateEndInfo"
          :minDate="dateStartInfo"
          dateFormat="yyyyMMdd"
        />
      </div>
    </div>
    <br /><br />
    <h2><strong>일자 설정</strong></h2>
    <br />
    <div>
      <b-date-picker v-model="tenDaysBefore" />
      <p>오늘부터 10일 전: {{ tenDaysBefore }}</p>
    </div>
    <br />
    <div>
      <b-date-picker v-model="tenDaysLater" />
      <p>2023-01-01 부터 10일 후: {{ tenDaysLater }}</p>
    </div>
    <br />
    <div>
      <b-date-picker v-model="threeWeeksBefore" />
      <p>오늘부터 3주 전: {{ threeWeeksBefore }}</p>
    </div>
    <br />
    <div>
      <b-date-picker v-model="threeWeeksLater" />
      <p>오늘부터 3주 후: {{ threeWeeksLater }}</p>
    </div>
    <br />
    <div>
      <b-date-picker v-model="sixMonthsLater" />
      <p>오늘부터 6개월 후: {{ sixMonthsLater }}</p>
    </div>
    <br />
    <div>
      <b-date-picker v-model="twoYearsLater" />
      <p>오늘부터 2년 후: {{ twoYearsLater }}</p>
    </div>
    <br /><br />
    <h2><strong>State</strong></h2>
    <div>
      <b-date-picker v-model="dateStart" :state="true" />
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
    <br />
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
  </div>
</template>
<style>
  .test-class input {
    background-color: yellow;
  }
  .test-class-2 input {
    background-color: green;
  }
  .inlined > div {
    display: inline-block;
    padding-right: 5px;
  }
</style>
