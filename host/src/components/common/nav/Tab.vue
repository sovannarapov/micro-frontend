<script lang="ts" setup>
  import { v4 as uuidv4 } from 'uuid';
  import { useCommonStore } from '@/store/common/';
  import { storeToRefs } from 'pinia';
  import { __v_cache } from '@/common/util/cache';

  interface IMenuLnbType {
    [key: string]: any;
  }
  interface Props {
    tabHistory?: Array<IMenuLnbType>;
  }

  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const instance = getCurrentInstance();
  const route = useRoute();
  const router = useRouter();
  const {
    public: { ENV },
  } = config;
  const currentEnv = ENV.toLowerCase();
  const commonStore = useCommonStore();
  const { setIsTab, deleteTab, deleteAllHiddenTabs, deleteAllTabs } = commonStore;
  const { menuLnbList, tabHistory, tabQueryHistory, pageLoaded, session }: any = storeToRefs(commonStore);

  const emit = defineEmits<{
    (e: 'onClickTab', name: string): void;
    (e: 'onDelTab', name: string): void;
    (e: 'onDelAll'): void;
  }>();

  const currentRouteName = computed(() => {
    return route.path === '/' ? route.path : route.path.replace(/\/+$/, '');
  });

  const getName = path => {
    return menuLnbList?.value.filter(menu => menu.menuUrl === path)[0]?.menuEngName || 'no name';
  };

  const getQuery = path => {
    const searchParam = ref({});
    for (const q in tabQueryHistory?.value) {
      if (q === path) searchParam.value = tabQueryHistory?.value[q];
    }

    return searchParam.value;
  };

  const tabLength = 9;
  const trimmedHistory = computed(() => {
    const spliced = tabHistory.value.slice(0, tabLength);

    return spliced;
  });

  const trimmedHistorySelect = computed(() => {
    const spliced = tabHistory.value.length > 7 ? tabHistory.value.slice(7, 10) : [];
    const converted = spliced.map(menu => ({ name: getName(menu), value: menu }));

    return converted;
  });
  const selectedTab = ref(null);

  const onChangeTab = tab => {
    window.setTimeout(() => {
      const query = getQuery(tab);

      router.push({ path: tab, query });
    }, 0);
  };

  const onShiftTab = tab => {
    selectedTab.value = tab;
  };

  watch(
    () => selectedTab.value,
    tab => {
      if (tab) onChangeTab(tab);
    },
    { deep: true, immediate: true },
  );

  // watch(
  //   () => trimmedHistorySelect.value,
  //   (tab, oldTab) => {
  //     const strTab = JSON.stringify(tab?.sort());
  //     const strOldTab = oldTab ? JSON.stringify(oldTab?.sort()) : undefined;
  //     // 이전 selectbox 목록과 같으면 return false
  //     if (oldTab && strTab === strOldTab) return false;
  //     if (tab.length) onShiftTab(tab[tab.length - 1].value);
  //   },
  //   { deep: true, immediate: true },
  // );

  const onClickTab = path => {
    const query = getQuery(path);

    setIsTab(true);
    router.push({ path, query });
  };

  const onDelTab = async path => {
    const result = await deleteTab(path);

    if (result && pageLoaded.value) {
      window.setTimeout(() => {
        const lastPath = ref('');

        setIsTab(true);
        clearPageState(path);

        if (!tabHistory.value.length) {
          lastPath.value = '/';

          router.push({ path: lastPath.value });

          return false;
        }

        if (currentRouteName.value === path) {
          lastPath.value = tabHistory.value[tabHistory.value.length - 1];

          const query = getQuery(lastPath.value);

          router.push({ path: lastPath.value, query });
        }
      }, 0);
    }
  };

  const onDeleteAllHidden = async () => {
    if (tabHistory.length === 0) return false;

    const result = await deleteAllTabs();

    if (result) clearPageState();

    clearPageState();
  };

  const onDelAll = async () => {
    if (tabHistory.length === 0) return false;

    const result = await deleteAllTabs();

    clearPageState();

    if (result) {
      window.setTimeout(() => {
        router.push({ path: '/' });
      }, 0);
    }
  };

  const clearPageState = (path?) => {
    try {
      // TODO : type 작성
      const uid = uuidv4();
      const piniaStore = nuxtApp.$pinia as any;
      const routeView = instance?.parent as any;

      // routeView.subTree.children[1].children[1].children[1].children[0] : nuxtPage
      // routeView.subTree.children[1].children[1].children[1].children[0].component.subTree : routerView
      // routeView.subTree.children[1].children[1].children[1].children[0].component.subTree.component.subTree : keepAlive

      piniaStore.state.value.common.tempData = {};

      // close all pages
      if (!path) {
        const childrenIndex = currentEnv === 'local' ? 2 : 1;

        // prd
        routeView.subTree.children[childrenIndex].children[1].children[1].children[1].children[0].key = uid;

        for (const [key, value] of piniaStore._s) {
          if (key !== 'common') {
            piniaStore._s.get(key).$reset();
          }
        }
      }

      if (path) {
        // close single page
        if (typeof path !== 'object') {
          const trimmedPath = path.replace(/\/+$/, '');
          const menuTitle = trimmedPath?.substring(trimmedPath?.lastIndexOf('/') + 1);

          for (const [key, value] of __v_cache) {
            if (key === path) {
              value.component.isDeactivated = true;
              value.key = uid;
            }
          }

          if (piniaStore._s.get(menuTitle)) piniaStore._s.get(menuTitle).$reset();
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  watch(
    () => session.value,
    value => {
      if (value === false) {
        const sessionInfo = sessionStorage.getItem('sessionInfo');

        if (!sessionInfo) onDeleteAllHidden();
      }
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div class="tab">
    <button
      :class="`tablinks ${currentRouteName === '/' ? 'active home' : 'home'}`"
      title="home"
      @click="$router.push({ path: '/' })"
    >
      <span>H</span>
    </button>
    <div class="tabbox">
      <div class="tabbox_inner">
        <button
          v-for="(item, idx) in trimmedHistory"
          :key="idx"
          :class="`tablinks ${currentRouteName === item ? 'active' : ''}`"
          :title="getName(item)"
          @click="onClickTab(item)"
        >
          <span>{{ getName(item) }}</span
          ><a href="#" @click.stop="onDelTab(item)">close</a>
        </button>
      </div>
    </div>
    <div class="tabmove">
      <!-- <b-form-select
        v-show="trimmedHistorySelect.length > 0"
        v-model="selectedTab"
        :options="trimmedHistorySelect"
        value-field="value"
        text-field="name"
        disabled-field="disabled"
      ></b-form-select> -->
      <a href="#" class="allclose" v-show="tabHistory.length > 0" @click="onDelAll">close all</a>
    </div>
  </div>
</template>
<style>
  .allclose {
    cursor: pointer;
  }
</style>
