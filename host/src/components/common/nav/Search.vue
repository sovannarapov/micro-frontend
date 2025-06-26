<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common/';

  const router = useRouter();
  const route = useRoute();
  const commonStore = useCommonStore();
  const { searchableLnb } = storeToRefs(commonStore);

  const keyupTimer = ref<NodeJS.Timeout | null>(null);
  const searchTerm = ref('');
  const Menulist = ref();
  // TODO : type 작성
  const filteredLnb: any = computed(() => {
    const loweredSearchTerm = searchTerm?.value?.toLowerCase();
    const result = ref([]);

    result.value =
      loweredSearchTerm.length > 0
        ? searchableLnb?.value?.filter(
            lnb =>
              lnb.menuEngName.toLowerCase().trim().includes(loweredSearchTerm) ||
              lnb.menuUrl.toLowerCase().trim().includes(loweredSearchTerm),
          )
        : [];

    return result.value;
  });

  watch(
    () => filteredLnb?.value,
    flag => {
      if (Menulist.value) Menulist.value.style.display = flag?.length ? 'block' : 'none';
    },
    { deep: true, immediate: true },
  );

  const checkThrottle = e => {
    if (keyupTimer.value) return;
    if (filteredLnb.value.length && e.which === 40) {
      const firstAnode = Menulist.value.querySelector('a.dot');

      firstAnode.focus();
    }

    keyupTimer.value = setTimeout(() => {
      if (keyupTimer.value) {
        clearTimeout(keyupTimer.value);
        keyupTimer.value = null;
      }
    }, 300);
  };

  const onClickSearch = item => {
    const { menuUrl } = item;

    searchTerm.value = '';
    setTimeout(() => {
      router.push({ path: menuUrl });
    }, 0);
  };

  const getMenuId = (url: string) => {
    const d = url.split('/');
    const l = d[d.length - 1];

    return l;
  };

  const tabHandler = e => {
    const list = e.target.parentNode.querySelectorAll('a.dot');
    const listLength = list.length;

    if (e.which === 38 || e.which === 40) {
      const isSearchedItem = e.target.classList.value.includes('dot');

      if (isSearchedItem) {
        e.preventDefault();

        const aidx = parseInt(e.target.getAttribute('tabindex')) - 1;

        if (e.which === 38) {
          if (aidx === 0) return false;
          list[aidx - 1].focus();
        }

        if (e.which === 40) {
          if (aidx === listLength - 1) return false;
          list[aidx + 1].focus();
        }
      }
    }
  };

  const searchAreaHandler = e => {
    const searchClassList = ['form-control searchField', 'menulist'];

    if (!searchClassList.includes(e.target.classList.value)) searchTerm.value = '';
  };

  onMounted(() => {
    document.documentElement.addEventListener('keydown', tabHandler, false);
    document.documentElement.addEventListener('click', searchAreaHandler, false);
  });

  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('keydown', tabHandler, false);
    document.documentElement.removeEventListener('click', searchAreaHandler, false);
  });
</script>
<template>
  <!-- 메뉴검색 -->
  <div class="menu_search">
    <div class="search_group">
      <b-form-input
        v-model="searchTerm"
        class="searchField"
        placeholder="search..."
        @keyup="checkThrottle"
      ></b-form-input>
      <b-button class="btn ico ico_search"></b-button>
    </div>

    <div class="menulist" ref="Menulist">
      <span v-if="!filteredLnb.length"> Searching... </span>
      <span v-if="filteredLnb.length">
        <NuxtLink
          v-for="(item, index) in filteredLnb"
          :key="index"
          @click="onClickSearch(item)"
          @keyup.enter="onClickSearch(item)"
          class="dot"
          :tabindex="index + 1"
        >
          [{{ getMenuId(item.menuUrl) }}] {{ item.menuEngName }}</NuxtLink
        >
      </span>
    </div>
  </div>
  <!-- //메뉴검색 -->
</template>
