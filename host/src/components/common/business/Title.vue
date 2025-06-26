<script setup lang="ts">
  import { createApp } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common';
  import { __v_cache } from '@/common/util/cache';
  import { getCodesFromStorage } from '@/common/util/commonCodes'; //공통유틸 import

  const nuxtApp = useNuxtApp();
  const instance = getCurrentInstance();
  const titleNode = instance as any;
  const config = useRuntimeConfig();
  const {
    public: { ENV },
  } = config;
  const currentEnv = ENV.toLowerCase();
  const props = defineProps({
    show: {
      type: Array,
      default: () => [''],
    },
    hide: {
      type: Array,
      default: () => [''],
    },
  });
  const emits = defineEmits(['clear-state']);
  const isShown: unknown[] = props?.show;
  const isHidden: unknown[] = props?.hide;
  const exeFn = ref('');
  const hideClear = computed(() => {
    for (const word of isHidden) {
      if (typeof word === 'string' && word.includes('clear')) {
        return false;
      }
      return true;
    }
  });
  const showExe = computed(() => {
    for (const word of isShown) {
      if (typeof word === 'string' && word.includes('exe')) {
        exeFn.value = word.split(':')[1];

        return true;
      }
    }
  });

  const route = useRoute();
  const router = useRouter();
  const { path } = route;
  const useStore = useCommonStore();
  // TODO : type 설정
  const { menuLnbList }: any = storeToRefs(useStore);
  const trimmedPath = path.replace(/\/+$/, '');
  const menuTitle = trimmedPath?.substring(trimmedPath?.lastIndexOf('/') + 1);
  const menuName = computed(() => {
    let name = '';

    if (!menuLnbList.value) return name;

    const filtered = menuLnbList?.value?.filter(v => v?.menuUrl?.includes(trimmedPath));
    if (filtered[0]) name = filtered[0]?.menuEngName;

    return name;
  });

  const onFileUpload = () => {
    const options = {
      title: 'Help Files',
      width: 800,
      height: 700,
      component: 'File',
      datas: { fileBzwkDstic: 'HELP', idnfiNo: menuTitle },
      callback: null,
    };
    usePopup(options);
  };

  const onClearState = () => {
    const uid = uuidv4();
    const piniaStore = nuxtApp.$pinia as any;
    const routeView = instance?.parent as any;

    piniaStore.state.value.common.tempData = {};

    for (const [key, value] of __v_cache) {
      if (key === trimmedPath) {
        const keepAliveComponent = titleNode.parent.parent.parent;
        const targetComponent = value.component.subTree;

        try {
          targetComponent.children[1].key = uid;
          targetComponent.children[1].ctx.update();

          // 2023.11.09 danger zone --
          titleNode.parent.parent.parent.subTree.key = uid;
          titleNode.parent.parent.parent.subTree.ctx.update();
          // -- danger zone
        } catch (e) {
          console.warn('Failed clear state', e);
        }
      }
    }

    if (piniaStore._s.get(menuTitle)) piniaStore._s.get(menuTitle).$reset();
  };

  const onExe = () => {
    const contentsNode = titleNode?.parent?.subTree?.children[1]?.component?.exposed;

    if (contentsNode && exeFn.value) contentsNode[exeFn.value]();
  };
</script>
<template>
  <ul class="title_area">
    <li>
      <h2>
        <span>[{{ menuTitle }}]</span>{{ menuName }}
      </h2>
    </li>
    <li>
      <b-button v-show="showExe" class="btn" @click="onExe">Exe</b-button>
      <b-button class="btn" @click="onFileUpload">Help</b-button>
      <b-button v-show="hideClear" class="btn" @click="onClearState">Clear All</b-button>
    </li>
  </ul>
</template>
