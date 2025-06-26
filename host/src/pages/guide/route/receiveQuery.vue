<script setup>
import { useGuideStore } from '@/store/guide/';
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const guideStore = useGuideStore();
const { deleteTempData } = guideStore;
const { tempData } = storeToRefs(guideStore);
const route = useRoute();
const router = useRouter();
// 라우트 이동 시 전달받은 query
const { id } = route.query;

onDeactivated(() => {
  // 다른 라우트로 이동 시 임시 데이터 삭제
  deleteTempData();
});

const onRoute = () => {
  router.go(-1);
};
</script>

<template>
  <div>
    <h1>Route</h1>
    <NuxtLink to="/guide/route">Back to route</NuxtLink>
    <br /><br />
    <div>
      received query param :
      <p>{{ id }}</p>
    </div>
    <div>
      saved data in store :
      <p>{{ tempData }}</p>
    </div>
  </div>
</template>
