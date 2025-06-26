<script lang="ts" setup>
  import { useCommonStore } from '@/store/common/';
  import { setCodes, clearCodes } from '@/common/util/commonCodes';

  const appConfig = useAppConfig();
  const commonStore = useCommonStore();
  const { login, fetchLnb, showLoader, hideLoader } = commonStore;
  const config = useRuntimeConfig();
  const {
    public: { ENV, TITLE },
  } = config;
  const route = useRoute();
  const router = useRouter();
  const { redirect } = route.query;
  const isPrd = computed(() => (ENV === 'prod' ? true : false));

  const id = ref('');
  const password = ref('');

  const errorMessage = ref('');
  const clearMessage = () => {
    errorMessage.value = '';
  };

  const validateLogin = () => {
    if (password.value === '') errorMessage.value = 'Please enter your password.';
    if (id.value === '') errorMessage.value = 'Please enter your ID.';

    const options = { title: 'Error', contents: errorMessage.value, callback: clearMessage };

    if (errorMessage.value) {
      useAlert(options);

      return false;
    }
    return true;
  };

  const windowRef = ref();
  const windowRefIntv = ref();

  const procLogin = async e => {
    const { sessionInfo, ssoResult, message } = e.data;

    if (sessionInfo) {
      if (windowRef.value) windowRef.value.close();
      const { id_token } = ssoResult;

      sessionStorage.setItem('ssoIdToken', id_token);
      sessionStorage.setItem('sessionInfo', sessionInfo);

      const lnb = await fetchLnb();

      if (lnb) {
        router.push({ path: '/' });
      }
    }

    if (message) {
      hideLoader();

      if (windowRef.value) {
        windowRef.value.close();
        windowRef.value = null;
      }

      setTimeout(() => {
        const alertOptions = {
          title: 'alert',
          contents: message,
          status: 'error',
        };

        useAlert(alertOptions);
      }, 300);
    }
  };

  const onLogin = async e => {
    e.preventDefault();

    const isSSO = e.submitter.classList.contains('sso');
    const isSSOPopup = e.submitter.classList.contains('sso-popup');
    const documentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;
    const layerWidth = 900;
    const layerHeight = 700;
    const layerTopPos = 150;
    const layerLeftPos = documentWidth / 2 - layerWidth / 2;

    if (isSSOPopup) {
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

      showLoader();

      if (windowRef.value) {
        windowRef.value.close();
        windowRef.value = null;

        return false;
      }

      windowRef.value = window.open('/common/ssoLogin', '', attr);
      window.addEventListener('message', procLogin, false);

      windowRefIntv.value = setInterval(() => {
        if (windowRef.value && windowRef.value.closed) {
          if (!sessionStorage.getItem('sessionInfo')) hideLoader();
          windowRef.value.close();
          windowRef.value = null;
          clearInterval(windowRefIntv.value);
        }
      }, 1000);

      return false;
    }

    const validate = validateLogin();

    if (validate) {
      showLoader();
      const result = await login({ uno: id.value, psswd: password.value });

      if (result) {
        if (ENV !== 'LOCAL') clearCodes();
        const getCode = await setCodes();
        const lnb = await fetchLnb();

        if (getCode && lnb) {
          if (redirect) router.push({ path: String(redirect) });
          if (!redirect) router.push({ path: '/' });
        }
      }
    }
  };

  onBeforeUnmount(() => {
    window.removeEventListener('message', procLogin, false);
  });
</script>
<template>
  <h1>
    KB PRASAC <span>{{ TITLE }}</span>
  </h1>
  <div class="login_inner">
    <b-form @submit="e => onLogin(e)">
      <div class="title">
        <span>Welcome. Please login...</span>
      </div>
      <template v-if="!isPrd">
        <div class="form_group">
          <label>Username</label>
          <b-form-input type="text" v-model="id" maxlength="20" placeholder="ID" name="username" />
        </div>
        <div class="form_group">
          <label>Password</label>
          <b-form-input type="password" v-model="password" placeholder="Password" maxlength="20" name="password" />
        </div>
      </template>
      <div v-show="!isPrd" class="btn_area">
        <button type="submit" v-show="!isPrd" class="btn btn_primary">
          <span>Login</span>
        </button>
      </div>
      <!-- <div class="btn_area">
        <button type="submit" class="btn btn_primary sso">
          <span>SSO Login</span>
        </button>
      </div> -->
      <div class="btn_area">
        <button type="submit" class="btn btn_primary sso-popup">
          <span>SSO Login</span>
        </button>
      </div>
    </b-form>
  </div>
</template>
