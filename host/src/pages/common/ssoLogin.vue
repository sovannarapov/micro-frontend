<script lang="ts" setup>
  import { useCommonStore } from '@/store/common/';
  import { setCodes, clearCodes } from '@/common/util/commonCodes';

  definePageMeta({
    layout: 'sso',
    keepalive: false,
  });

  const opener = ref();
  const config = useRuntimeConfig();
  const router = useRouter();
  const route = useRoute();
  const commonStore = useCommonStore();
  const {
    public: { SSO_URL, SSO_REDIRECT_URL, SSO_KEY, SSO_CLIENT },
  } = config;
  const { showLoader, ssoLogin, loginWithToken, logout } = commonStore;
  const { query } = route;
  const { code, session_state, logoutToken, state } = query;
  const fromSSO = ref(false);
  const ssoRedirectUrl = window.location.origin + SSO_REDIRECT_URL;

  // LOGOUT
  if (logoutToken) {
    setTimeout(() => {
      const state = 'state_1';
      location.href = `${SSO_URL}/oidc/logout?id_token_hint=${logoutToken}&post_logout_redirect_uri=${ssoRedirectUrl}&state=${state}`;
    }, 300);
  }

  if (state) {
    fromSSO.value = true;

    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({ logoutSuccess: 'success' }, '*');
      }
    }, 300);
  }

  // LOGIN
  if (!logoutToken) {
    // success
    if (session_state) {
      showLoader();
      fromSSO.value = true;

      try {
        const ssoResult = await ssoLogin(code);

        if (ssoResult) {
          const { access_token: token } = ssoResult;
          const result = await loginWithToken({ token });
          const { status, sessionInfo, message }: any = result;

          setTimeout(() => {
            if (window.opener) {
              const tobePassed = status ? { sessionInfo: JSON.stringify(sessionInfo), ssoResult } : { message };

              window.opener.postMessage({ ...tobePassed }, '*');
              self.close();
            }
          }, 300);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const ori = ref();

    // sso login try
    if (!session_state) {
      if (window.opener) {
        if (!window.opener.location.pathname.includes('login'))
          window.opener.postMessage({ logoutSuccess: 'success' }, '*');
      }

      setTimeout(() => {
        location.href = `${SSO_URL}/oauth2/authorize?scope=openid&response_type=code&redirect_uri=${ssoRedirectUrl}&client_id=${SSO_KEY}`;
      }, 300);

      ori.value = window.location.origin;
    }
  }

  onMounted(() => {
    opener.value = window.opener;
  });
</script>
<template>
  <div class="loading" id="loading">
    <div class="d-flex justify-content-center mb-3">
      <span data-v-e4d156ea="" class="spinner-border text-warning" role="status">
        <span class="visually-hidden"></span>
      </span>
    </div>
  </div>
</template>
<style scoped>
  .loading .d-flex {
    position: fixed;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
  }
  .loading .spinner-border {
    --bs-spinner-width: 4rem;
    --bs-spinner-height: 4rem;
    --bs-spinner-border-width: 0.4em;
  }
</style>
