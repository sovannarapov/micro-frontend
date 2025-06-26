<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common/';

  const commonStore = useCommonStore();
  const route = useRoute();
  const { menuLnbList } = storeToRefs(commonStore);

  interface ILnb {
    orderSeq: number;
    parentMenuId: string;
    menuEngName: string;
    menuUrl?: string | null;
    menuId: string;
    useYn: string;
    menuLev: number;
    selected?: boolean;
    visible?: boolean;
  }

  const rootName = ref(['Home']);
  const currentMenuName = computed(() => {
    const { path } = route;
    // const path = window?.location?.pathname; // TODO : route는 시점이 느림 > 확인 필요
    const trimmedPath = path.replace(/\/+$/, '');
    const menu = [];
    const menuData = menuLnbList.value;

    if (menuData.length === 0) return menu;
    if (trimmedPath === '/') {
      rootName.value = [];
      rootName.value.push('Home');

      return menu;
    }

    if (menuData.length > 0) {
      const tgt: ILnb = menuData?.filter((menu: ILnb) => menu.menuUrl === trimmedPath)[0];

      if (tgt) {
        if (tgt.parentMenuId && tgt.parentMenuId !== 'H') {
          const { menuId }: ILnb = tgt;
          const dep1 = menuId.slice(0, 3);
          const dep2 = menuId.slice(0, 5);
          const dep1Name = menuData.filter((menu: ILnb) => menu.menuId === dep1)[0]['menuEngName'];
          const dep2Name = menuData.filter((menu: ILnb) => menu.menuId === dep2)[0]['menuEngName'];
          const dep3Name = menuData.filter((menu: ILnb) => menu.menuId === menuId)[0]['menuEngName'];

          menu.push(...[dep1Name, dep2Name, dep3Name]);

          rootName.value = [];
          rootName.value.push('Home');
        }
        if (tgt.parentMenuId === 'H') {
          rootName.value = [];
          rootName.value.push('Home');
          rootName.value.push(tgt.menuEngName);
        }
      }
    }

    return menu;
  });

  watch(
    route,
    () => {
      rootName.value = ['Home'];
    },
    { deep: true },
  );
</script>

<template>
  <ul class="breadcrumb">
    <li v-for="item in rootName" :key="item">{{ item }}</li>
    <li
      v-for="(item, idx) in currentMenuName"
      :key="idx"
      :class="`${idx + 1 === currentMenuName?.length ? 'current' : ''}`"
    >
      <span>{{ item }} </span>
    </li>
  </ul>
</template>
