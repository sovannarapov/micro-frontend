<script setup>
  import { vue } from '@codemirror/lang-vue';
  import { javascript } from '@codemirror/lang-javascript';
  import { html } from '@codemirror/lang-html';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { getSessionInfo } from '@/common/util/helpers';
  import {
    trimObject,
    numberWithCommas,
    diffDatesLoan,
    diffDatesInfo,
    isEmpty,
    maskName,
    formatHHMMSS,
    parseDateLoan,
    parseDateInfo,
  } from '@/common/util/helpers';
  import dayjs from 'dayjs';

  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const obj1 = reactive({
    fruits: ['strawberry', 'peach'],
    cars: ['audi'],
  });
  const obj2 = reactive({
    fruits: ['cherry', 'banana'],
    cars: ['bmw', 'benz'],
    phones: ['apple', 'samsung'],
  });
  const obj3 = reactive([
    {
      fruits: ['cherry', 'banana'],
      cars: ['bmw', 'benz'],
      phones: ['apple', 'samsung'],
    },
    {
      fruits: ['cherry', 'banana'],
      cars: ['bmw', 'benz'],
      phones: ['apple', 'samsung'],
    },
  ]);

  const trimmed = ref();
  const onTrimObject = () => {
    trimmed.value = trimObject(obj1, obj2);
  };

  // 여신 날짜 차이 계산
  const today = ref(new Date());
  const dateStartLoan = ref(dayjs(today.value).format('DDMMYYYY'));
  const dateEndLoan = ref(dayjs(new Date(today.value)).add(20, 'days').format('DDMMYYYY'));

  const diffLoan = diffDatesLoan(dateStartLoan.value, dateEndLoan.value);

  // 정보 날짜 차이 계산
  const dateStartInfo = ref(dayjs(today.value).format('YYYYMMDD'));
  const dateEndInfo = ref(dayjs(new Date(today.value)).add(15, 'days').format('YYYYMMDD'));

  const diffInfo = diffDatesInfo(dateStartInfo.value, dateEndInfo.value);

  const onClearObject = () => {
    for (const item in obj2) delete obj2[item];
  };

  const onClearArray = () => {
    obj3.splice(0);
  };

  // 한달 이전 계산 [여신]
  const serverDate = getSessionInfo().tranBaseYmd;
  const e1YmTx = parseDateLoan(serverDate);
  const dateStartLoanCurrent = ref(dayjs(e1YmTx).format('DDMMYYYY'));
  const dateEndLoanPreMonth = ref(dayjs(e1YmTx).add(-1, 'month').format('DDMMYYYY'));

  console.log(
    'e1YmTx : ',
    e1YmTx,
    '\ndateStartLoanCurrent : ',
    dateStartLoanCurrent.value,
    '\ndateEndLoanPreMonth : ',
    dateEndLoanPreMonth.value,
  );

  const maskedName = ref(maskName('ridley scott'));

  const formattedTime = ref(formatHHMMSS('175801'));

  console.log('isEmpty', isEmpty(ref([]).value));
</script>

<template>
  <div>
    <h1>Helpers</h1>
    <br /><br />
    <div>
      <h2><strong>Trim Objects</strong></h2>
      <b-button @click="onTrimObject">Trim</b-button>
    </div>
    <br />
    <div>
      Trimmed Object :
      <p>{{ trimmed }}</p>
    </div>
    <br />
    <div>
      <h2><strong>Clear Reactive Object</strong></h2>
      <div>{{ obj2 }}</div>
      <br />
      <b-button @click="onClearObject">Clear</b-button>
    </div>
    <br />
    <div>
      <h2><strong>Clear Reactive Array</strong></h2>
      <div>{{ obj3 }}</div>
      <br />
      <b-button @click="onClearArray">Clear</b-button>
    </div>
    <br />
    <hr />
    <br /><br />
    <div>
      <h2><strong>Add Comma</strong></h2>
      <br />
      <p>{{ numberWithCommas(900000000) }}</p>
      <p>{{ numberWithCommas('10000000.03564598') }}</p>
      <p>{{ numberWithCommas('10000000', 5) }}</p>
      <p>{{ numberWithCommas('10000000.035', 5) }}</p>
    </div>
    <br />
    <hr />
    <br /><br />
    <div>날짜 차이 계산 :</div>
    <br />
    <div>
      <h2><strong>여신 종료일 - 시작일 계산</strong></h2>
      <p>시작일 : {{ dateStartLoan }} 종료일 : {{ dateEndLoan }} 날짜 차이: {{ diffLoan }}</p>
    </div>
    <br />
    <div>
      <h2><strong>정보 종료일 - 시작일 계산</strong></h2>
      <p>시작일 : {{ dateStartInfo }} 종료일 : {{ dateEndInfo }} 날짜 차이: {{ diffInfo }}</p>
    </div>
    <br /><br />
    <div>Empty check :</div>
    <br />
    <div>
      <span style="color: red">* ref는 .value까지 입력해야합니다.</span><br /><br />
      isEmpty(ref([]).value); // true<br />
      isEmpty(reactive([])); // true<br />
      isEmpty([]); // true<br />
      isEmpty({}); // true<br />
      isEmpty(''); // true<br />
      isEmpty(0); // true<br />
      isEmpty(function(){}); // true<br />
      isEmpty(null); // true<br />
      isEmpty(undefined); // true<br />
      isEmpty(new Map()); // true<br />
      isEmpty(new Set()); // true<br />
      isEmpty(new Error()); // true<br /><br />

      isEmpty(true); // false<br />
      isEmpty(false); // false<br />
      isEmpty(['a', 'b']); // false<br />
      isEmpty({ a: 'b' }); // false<br />
      isEmpty('string'); // false<br />
      isEmpty(42); // false<br />
      isEmpty(function(a,b){}); // false<br />
      isEmpty(new Map([['key', 'value']])); // false<br />
      isEmpty(new Set([1])); // false<br />
      isEmpty(new Error('fail'))// false<br />
    </div>
    <br />
    <div>
      <h2><strong>이름 masking</strong></h2>
      <br />
      <p>{{ maskedName }}</p>
    </div>
    <br />
    <div>
      <h2><strong>시간 formatting</strong></h2>
      <br />
      <p>{{ formattedTime }}</p>
    </div>
  </div>
</template>
