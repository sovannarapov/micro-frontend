<script setup>
import { vue } from '@codemirror/lang-vue';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { setCodes, getCodes, getCodesFromStorage } from '@/common/util/commonCodes';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const nuxtApp = useNuxtApp();
const {
  $global: { sessionInfo },
} = nuxtApp;

const extensions = [javascript(), vue(), html(), oneDark];
const code = ref('');

const commonCodesAsync = reactive([]);
const commonCodesStorage = reactive([]);

// api 통신 fetch
const onGetCodes = () => {
  const codes = getCodes();

  commonCodesAsync.splice(0);
  if (codes) Object.assign(commonCodesAsync, codes);
};

// api 통신 fetch
const onGetCodesWithFilterAsync = async () => {
  // ex : bzwkInstncIdnfr 가 "CSM000001"인 code만 추출
  const param = { key: 'bzwkInstncIdnfr', value: 'CSM000001' };
  const codes = await getCodes(param);

  commonCodesAsync.splice(0);
  if (codes) Object.assign(commonCodesAsync, codes);
};

// storage 에서 추출
const onGetCodesWithFilterFromStorage = async () => {
  // ex : bzwkInstncIdnfr 가 "CSM000001"인 code만 추출
  const param = { key: 'bzwkInstncIdnfr', value: 'CSM000001' };
  const codes = getCodesFromStorage(param);

  commonCodesStorage.splice(0);
  if (codes) Object.assign(commonCodesStorage, codes);
};
</script>

<template>
  <div>
    <!-- <div>
      <p>Get Common Codes - 전체 호출</p>
      <b-button @click="onGetCodes">Get</b-button>
    </div> -->
    <br />
    <div>
      <p>Get Common Codes - 파라미터 전달 api 통신</p>
      <b-button @click="onGetCodesWithFilterAsync">Get</b-button>
    </div>
    <br />
    <div>
      <p>Get Common Codes - 파라미터 전달 Storage</p>
      <b-button @click="onGetCodesWithFilterFromStorage">Get</b-button>
    </div>
    <br />
    <div>
      api 통신 common codes :
      <p>{{ commonCodesAsync }}</p>
    </div>
    <br />
    <div>
      storage에서 추출 common codes :
      <p>{{ commonCodesStorage }}</p>
    </div>
  </div>
</template>
