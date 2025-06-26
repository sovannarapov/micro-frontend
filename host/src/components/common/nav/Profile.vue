<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useCommonStore } from '@/store/common/';

  const router = useRouter();
  const commonStore = useCommonStore();
  const { logout, hideLoader } = commonStore;
  const sessionInfoRaw = sessionStorage.getItem('sessionInfo');
  const sessionInfo = sessionInfoRaw ? JSON.parse(sessionInfoRaw) : null;
  const windowRef = ref();
  const windowRefIntv = ref();

  const procLogout = async e => {
    const { logoutSuccess } = e.data;

    if (logoutSuccess) {
      if (windowRef.value) windowRef.value.close();

      try {
        const result = await logout();

        if (result) {
          router.push({ path: '/login/' });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // if (aleadyLoggedOut) {
    //   console.log('aleadyLoggedOut ??!!');
    //   if (sessionStorage.getItem('ssoIdToken')) {
    //     sessionStorage.removeItem('ssoIdToken');
    //   }

    //   if (sessionStorage.getItem('sessionInfo')) {
    //     sessionStorage.removeItem('sessionInfo');
    //   }

    //   if (sessionStorage.getItem('menuLnbList')) {
    //     sessionStorage.removeItem('menuLnbList');
    //   }

    //   nextTick(() => {
    //     router.push({ path: '/login/' });
    //   });
    // }
  };

  const onProcLogout = async () => {
    const ssoToken = sessionStorage.getItem('ssoIdToken');
    const documentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;
    const layerWidth = 900;
    const layerHeight = 700;
    const layerTopPos = 150;
    const layerLeftPos = documentWidth / 2 - layerWidth / 2;

    if (ssoToken) {
      const attr =
        'top=' +
        layerTopPos +
        ', left=' +
        layerLeftPos +
        ', width=' +
        layerWidth +
        ', height=' +
        layerHeight +
        ', resizable=no,status=no';
      windowRef.value = window.open(`/common/ssoLogin?logoutToken=${ssoToken}`, '', attr);
      window.addEventListener('message', procLogout, false);
    }

    if (!ssoToken) {
      const result = await logout();

      if (result) {
        router.push({ path: '/login/' });
      }
    }
  };

  const onLogout = async () => {
    const options = { title: 'Confirm', contents: 'Do you want to logout?', callback: onProcLogout };
    useDialog(options);
  };

  const toggleDD = e => {
    const { target } = e;

    target.classList.toggle('expand');
  };

  onBeforeUnmount(() => {
    window.removeEventListener('message', procLogout, false);
  });
</script>

<template>
  <div v-if="sessionInfo" class="user_info">
    <span class="brnCode">Branch : {{ sessionInfo?.brnCode }}</span>
    <span class="name" id="tooltip-target-1">{{ sessionInfo?.userName }}</span>
    <b-tooltip target="tooltip-target-1" triggers="hover">
      <div class="ov">
        <dl v-for="(item, name, idx) in sessionInfo" :key="`session-${idx}`">
          <dt class="dot">{{ name }}</dt>
          <dd :title="item" @click="toggleDD">{{ item }}</dd>
        </dl>
      </div>
    </b-tooltip>
    <button @click="onLogout">
      <span class="contact">Logout</span>
    </button>
  </div>
</template>
