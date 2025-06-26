<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  import { useCommonStore } from '@/store/common/';
  import { VueFinalModal } from 'vue-final-modal';
  import VueDragResize from 'vue3-drag-resize';

  const props = defineProps({
    title: {
      type: String,
      default: 'title',
    },
    width: {
      type: [Number, String],
      default: 1000,
    },
    height: {
      type: [Number, String],
      default: 600,
    },
    component: {
      type: String,
      default: '',
      required: true,
    },
    callback: {
      type: null,
      default: () => {},
    },
    readOnly: {
      type: Boolean,
      default: () => false,
    },
    datas: {
      type: Object,
      default: () => {},
    },
    titleButtons: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['confirm', 'close']);
  const commonStore = useCommonStore();
  const { toggleBussinessError } = commonStore;
  const popCon = ref();
  /* 2023.05.22 popup file 이제 등록 안하셔도 됩니다. */
  const compUrls = {};
  const popupEmit = param => {
    emit('confirm', param);
  };

  const getComponent = () => {
    const modules = import.meta.glob('../../**/*.vue');
    const componentName = ref('');

    for (const name in modules) {
      const fullName = name.substring(name.lastIndexOf('/') + 1);
      const fullNameWithoutExt = fullName.replace('.vue', '');

      if (props.component === fullNameWithoutExt) {
        componentName.value = name.replace('.vue', '');
      }
    }

    return modules[componentName.value + '.vue'];
  };

  const dynamicComp = await defineAsyncComponent({
    loader: getComponent() as any,
    loadingComponent: () => 'Loading...',
    errorComponent: () => 'Error',
  });

  const top = ref(0);
  const left = ref(0);
  const pWidth = computed(() => {
    const result = { width: 0 };
    if (typeof props.width === 'number') Object.assign(result, { width: props.width });
    if (typeof props.width === 'string') {
      const domWidth = document?.documentElement?.clientWidth;
      const proWidth = props.width.split('%')[0];
      const calcWidth = domWidth * (parseInt(proWidth) / 100);

      Object.assign(result, { width: calcWidth });
    }

    return result.width;
  });
  const pHeight = computed(() => {
    const result = { height: 0 };
    if (typeof props.height === 'number') Object.assign(result, { height: props.height });
    if (typeof props.height === 'string') {
      const domHeight = document?.documentElement?.clientHeight;
      const proHeight = props.height.split('%')[0];
      const calcHeight = domHeight * (parseInt(proHeight) / 100);

      Object.assign(result, { height: calcHeight });
    }

    return result.height;
  });
  const showExe = computed(() => props.titleButtons.includes('exe'));
  const showHelp = computed(() => props.titleButtons.includes('help'));

  const { clientWidth, clientHeight } = document.documentElement;

  top.value = clientHeight / 2 - pHeight.value / 2;
  left.value = clientWidth / 2 - pWidth.value / 2;

  const mousedown = e => {
    if (e.target.nodeName === 'INPUT') e.stopPropagation();
    if (e.target.nodeName === 'SELECT') e.stopPropagation();

    if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'SELECT') {
      if (!e.target.classList.contains('pop_title')) {
        e.stopPropagation();
      }
    }
  };
  const mouseup = e => {
    // e.stopPropagation();
  };
  const dragResize = newRect => {
    // dwidth.value = newRect.width;
    // dheight.value = newRect.height;
    top.value = newRect.top;
    left.value = newRect.left;
  };

  const closeParam = reactive({});
  const onSetCloseParam = param => {
    Object.assign(closeParam, param);
  };

  const onClose = () => {
    emit('close', closeParam || 'close');
    toggleBussinessError('');
  };

  const onFileUpload = () => {
    const options = {
      title: 'Help Files',
      width: 800,
      height: 700,
      component: 'File',
      datas: { fileBzwkDstic: 'HELP', idnfiNo: props.component },
      callback: null,
    };
    usePopup(options);
  };

  const onExe = () => {
    const exeFn = Object.keys(popCon.value);

    if (exeFn) popCon.value[exeFn[0]]();
  };

  onMounted(() => {
    const modalCon = document.querySelector('.confirm-modal-content .content-container');
    modalCon?.classList.remove('error');
    if (props.component === 'Error') {
      modalCon?.classList.add('error');
    }
  });
</script>
<template>
  <VueFinalModal
    class="confirm-modal"
    content-class="confirm-modal-content "
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <VueDragResize
      :aspectRatio="true"
      :is-active="true"
      :w="pWidth"
      :h="pHeight"
      :x="left"
      :y="top"
      :isResizable="false"
      class="bg-primary-100 dark:bg-gray-800"
      @dragging="dragResize"
    >
      <div @mousedown="mousedown" @mouseup="mouseup">
        <div class="pop_title">
          <h1>
            <span>[{{ component }}]</span>{{ title }}
          </h1>
          <div class="button_group">
            <b-button v-show="showExe" class="btn" @click="onExe">Exe</b-button>
            <b-button v-show="showHelp" class="btn" @click="onFileUpload">Help</b-button>
            <button @click="onClose" class="btn_close">Close</button>
          </div>
        </div>
        <div class="pop_body">
          <component
            :is="dynamicComp"
            @popup-emit="popupEmit"
            @set-close-param="onSetCloseParam"
            :readOnly="readOnly"
            :datas="datas"
            ref="popCon"
          />
        </div>
      </div>
    </VueDragResize>
  </VueFinalModal>
</template>
<style scoped lang="scss">
  .confirm-modal {
    :deep(.error) {
      min-height: 250px;
      height: auto !important;
    }
  }
</style>
