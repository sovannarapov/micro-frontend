<script setup>
import { vue } from '@codemirror/lang-vue';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { useGuideStore } from '@/store/guide/';

definePageMeta({
  layout: 'guide',
  keepalive: true,
  // validate: async route => {
  //   console.log('route :: ', /^\d+$/.test(route.params.id));
  // },
});

const extensions = [javascript(), vue(), html(), oneDark];
const guideStore = useGuideStore();
const { saveTempData } = guideStore;
const router = useRouter();

// 라우트 이동 시 query 전달
const onRouteWithQuery = () => {
  router.push({ path: '/guide/route/receiveQuery', query: { id: 'manual' } });
};
// 라우트 이동 시 store에 데이터 저장
const onRouteWithStore = () => {
  const tempData = { temp: 'tempData' };
  saveTempData(tempData);
  router.push({ path: '/guide/route/receiveQuery' });
};
const tabTestCode = ref(
  `onActivated(() => { 
    const fromTab = useDetectTab();
    console.log('tab클릭으로 열렸는지 확인 : ', fromTab); 
});`,
);
</script>

<template>
  <div>
    <h1>Route</h1>

    <br /><br />
    <div>
      <p>nuxt-link 기본</p>
      <nuxt-link to="/">Home</nuxt-link>
    </div>
    <br /><br />
    <div>
      <p>파라미터 전달</p>
      <br />
      <nuxt-link :to="{ path: '/guide/route/receiveQuery', query: { id: 'admin' } }">nuxt-link query param</nuxt-link
      ><br /><br />
      <div><b-button @click="onRouteWithQuery">Pass query param Data - maual</b-button></div>
    </div>
    <br /><br />
    <div>
      <p>스토어에 데이터 저장 후 이동</p>
      <br />
      <div><b-button @click="onRouteWithStore">Store - maual</b-button></div>
    </div>
    <br /><br />
    <div>
      <p>Tab click으로 이동 여부 구분</p>
      <br />
      <div>
        <code-mirror
          v-model="tabTestCode"
          basic
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
        />
      </div>
    </div>
  </div>
</template>
