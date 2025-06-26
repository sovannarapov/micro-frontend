<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common/';
  import { getSessionInfo } from '@/common/util/helpers';

  interface ILnbCell {
    menuEngName: string;
    menuId: string;
    menuLev: number;
    menuUrl: string;
    orderSeq: number;
    parentMenuId: string;
    useYn: string;
    visible?: boolean;
  }

  const config = useRuntimeConfig();
  const {
    public: { ENV, TITLE },
  } = config;
  const router = useRouter();
  const route = useRoute();
  const commonStore = useCommonStore();
  const { updateLnb, searchableLnb } = commonStore;
  const { pageLoaded, menuLnbList, mappedLnb } = storeToRefs(commonStore);
  const props = defineProps({
    rootPath: {
      type: String,
      default: () => '',
    },
  });
  const emit = defineEmits(['toggleLnb']);

  const hasSession = computed(() => Object.keys(getSessionInfo()).length > 0);

  const relocated = ref(false);
  const relocateTimeout = ref();
  const lnbStat = ref(true);
  const lnbClass = computed(() => `leftMenu ${!lnbStat.value ? 'lnb_close' : ''}`);
  // arrow click event
  const onClickArrow = () => {
    lnbStat.value = !lnbStat.value;
    emit('toggleLnb');
  };

  const clearMenuTimer = () => {
    if (relocateTimeout.value) {
      window.clearTimeout(relocateTimeout.value);
      relocateTimeout.value = null;
    }
  };
  const setMenuTimer = () => {
    if (!relocateTimeout.value) {
      relocateTimeout.value = window.setTimeout(() => {
        highLightMenu();
      }, 30000);
    }
  };

  // lnb click event
  const onClickMenu = (e, depth, item) => {
    e.stopPropagation();

    const oriLnb = menuLnbList.value;
    const newLnb = [];

    clearMenuTimer();

    if (depth === 1) {
      const lastLnb = oriLnb.map((cell: ILnbCell) =>
        cell.menuLev === 1 && cell.menuId === item.menuId
          ? { ...cell, visible: cell.visible ? false : true }
          : { ...cell, visible: false },
      );

      Object.assign(newLnb, lastLnb);

      setMenuTimer();
    }

    if (depth === 2) {
      const lastLnb = oriLnb
        .map((cell: ILnbCell) => (cell.menuLev === 2 ? { ...cell, visible: false } : cell))
        .map((cell: ILnbCell) =>
          cell.menuLev === 2 && cell.menuId === item.menuId ? { ...cell, visible: cell.visible ? false : true } : cell,
        );

      Object.assign(newLnb, lastLnb);

      setMenuTimer();
    }

    if (depth === 3) {
      const { menuUrl } = item;
      const lastLnb = oriLnb.map((cell: ILnbCell) =>
        cell.menuUrl === menuUrl.replace(/\/+$/, '') ? { ...cell, selected: true } : { ...cell, selected: false },
      );
     
      /*
      const approvalYn  = searchableLnb?.filter(menu => menu.menuUrl === menuUrl);

      if (!approvalYn.length) {
        const authAlertOption = {
          title: 'alert',
          contents: 'Page access denied.',
          status: 'error',
        };

        useAlert(authAlertOption);

        return false
      }
      */

      Object.assign(newLnb, lastLnb);

      clearMenuTimer();
      router.push({ path: menuUrl });
    }

    updateLnb(newLnb);
  };

  const currentPath = ref(route?.path);
  const highLightMenu = () => {
    const path = currentPath.value; // window?.location?.pathname; // TODO : route는 시점이 느림 > 확인 필요
    const trimmedPath = props.rootPath;
    const oriLnb: any = menuLnbList.value;
    const rootMenuId = oriLnb?.filter((_: ILnbCell) => _.menuUrl === trimmedPath)[0]?.parentMenuId.slice(0, 3);
    const subMenuId = oriLnb?.filter((_: ILnbCell) => _.menuUrl === trimmedPath)[0]?.parentMenuId.slice(0, 6);

    const newLnb = oriLnb
      .map((cell: ILnbCell) =>
        cell.menuId === rootMenuId || cell.menuId === subMenuId
          ? { ...cell, visible: true }
          : { ...cell, visible: false },
      )
      .map((cell: ILnbCell) =>
        cell.menuUrl === trimmedPath ? { ...cell, selected: true } : { ...cell, selected: false },
      );

    updateLnb(newLnb);

    clearMenuTimer();
  };

  watch(
    () => props.rootPath,
    path => {
      currentPath.value = path;

      highLightMenu();
    },
    { deep: true, immediate: true },
  );
</script>
<template>
  <div :class="lnbClass">
    <!-- header -->
    <header class="header">
      <NuxtLink to="/">
        <h1 class="logo on">
          KB PRASAC<span>{{ TITLE }}</span>
        </h1>
      </NuxtLink>
    </header>
    <!-- //header -->

    <!-- lnb -->
    <a class="lnb_open" @click="onClickArrow"><span class="arrow">닫고 펼치기</span></a>
    <nav class="lnb">
      <common-nav-search />

      <div class="lnbmenu">
        <ul>
          <!-- depth 1 -->
          <li
            v-for="(item, idx) in mappedLnb"
            :key="`dep1-${idx}`"
            :class="[item.child.length > 0 ? 'has-sub' : '', item.visible ? 'open' : '']"
            @click="e => onClickMenu(e, 1, item)"
          >
            <NuxtLink to="" :class="[item.visible ? 'on' : '']">{{ item.menuEngName }}</NuxtLink>
            <!-- depth 2 -->
            <ul v-if="item.child.length > 0" :class="[item.visible ? 'is-visible' : '']">
              <li v-for="(subItem, sidx) in item.child" :key="`dep2-${sidx}`">
                <NuxtLink @click="e => onClickMenu(e, 2, subItem)">{{ subItem.menuEngName }}</NuxtLink>
                <!-- depth 3 -->
                <ul v-if="subItem.child.length > 0" :class="[subItem.visible ? 'depth3 is-visible' : 'depth3']">
                  <li v-for="(lastItem, lidx) in subItem.child" :key="`dep3-${lidx}`">
                    <NuxtLink @click="e => onClickMenu(e, 3, lastItem)" :class="lastItem.selected ? 'on' : ''">{{
                      lastItem.menuEngName
                    }}</NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
    <!-- //lnb -->
  </div>
</template>
