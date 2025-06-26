<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });
  const tabIndex = ref(0);
  const tab0 = reactive({ contents: '' });
  const onUpdateState = () => {
    Object.assign(tab0, { contents: 'updated' });
  };

  const items = reactive([
    { name: 'name a', description: 'description a' },
    { name: 'name b', description: 'description b' },
  ]);

  const activeTab = ref(2);
  const updateTab = index => {
    setTimeout(() => {
      activeTab.value = 0;
    }, 300);
  };
</script>
<template>
  <div>
    <h1>Tab</h1>

    <br /><br />
    <div class="guideTab">
      <b-tabs v-model="tabIndex">
        <b-tab title="General"
          ><div>I'm the first fading tab</div>
          <div>{{ tab0 }}</div>
          <b-button @click="onUpdateState">update state</b-button></b-tab
        >
        <b-tab title="Edit profile">
          <div>I'm the second tab</div>
        </b-tab>
        <b-tab title="Premium Plan"><div>Sibzamini!</div></b-tab>
        <b-tab title="Info"><div>I'm the last tab</div></b-tab>
      </b-tabs>
    </div>
    <br /><br />
    <div>각 tab간 토글 시 부하가 걸릴 정도의 데이터가 사용된 경우 적용</div>
    <br />
    <div>
      <b-height-tabs :labels="['one', 'two', 'three']" contents="heightTab" :active="activeTab" />
      <div class="heightTab">
        <div>tab contents 1<br />tab contents 1<br />tab contents 1<br />tab contents 1</div>
        <div>tab contents 2<br />tab contents 2<br />tab contents 2<br />tab contents 2</div>
        <div>tab contents 3<br />tab contents 3<br />tab contents 3<br />tab contents 3</div>
      </div>
    </div>
    <b-button @click="updateTab(0)">change active num {{ activeTab }}</b-button>
  </div>
</template>
<style lang="scss" scoped>
  .guideTab {
    :deep(.tab-content) {
      padding-top: 30px;
    }
  }
</style>
