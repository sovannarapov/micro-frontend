import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/store/common/';
import { setCodes } from '@/common/util/commonCodes';

const handleLogout = ref(false);

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp: any = useNuxtApp();
  const commonStore = useCommonStore();
  const {
    alert,
    dialog,
    fetchLnb,
    hideAlert,
    hideDialog,
    healthCheck,
    clearSession,
    setPageLoad,
    toggleBussinessError,
    updateErrorCode,
    errorMessage,
    searchableLnb,
  } = commonStore;
  const { menuLnbList } = storeToRefs(commonStore);
  const sessionData = window.sessionStorage.getItem('sessionInfo');
  const lnbData = window.sessionStorage.getItem('menuLnbList');
  const commonCodeData = window.localStorage.getItem('commonCodes');

  const redirectToLogin = () => {
    const piniaStore = nuxtApp.$pinia as any;

    for (const [key, value] of piniaStore._s) {
      if (key !== 'common') {
        piniaStore._s.get(key).$reset();
      }
    }

    handleLogout.value = false;
    navigateTo({ path: '/login/', query: { redirect: to.path } });
  };

  const alertOption = {
    title: 'alert',
    contents: 'The session has expired. please login again.',
    status: 'error',
    callback: redirectToLogin,
  };

  // network 연결 유실 시
  if (!navigator.onLine) {
    const options = {
      title: '알림',
      contents: 'Network disconnected',
      status: 'error',
    };

    useAlert(options);
    console.error('ERR_INTERNET_DISCONNECTED');

    return abortNavigation();
  }

  if (alert.stat) {
    hideAlert();
  }
  if (dialog.stat) {
    hideDialog();
  }

  updateErrorCode('');
  for (const item in errorMessage) delete errorMessage[item];

  clearPopup();
  toggleBussinessError('');

  if (to.path !== from.path) setPageLoad(false);

  /*
   * 로그인 전 로그인 이외 페이지 접근 시도
   */
  if (!sessionData && !to.path.includes('login')) {
    clearSession();
    nuxtApp.$global.sessionInfo = {};

    // sso popup 접근 허용
    if (to.path.includes('ssoLogin')) return true;

    if (to.path === '/' || to.path === from.path)
      // 메인으로 접근 시 로그인 페이지로 이동
      return navigateTo({ path: '/login/', query: { redirect: to.path } });

    // 메인 페이지 이외의 페이지로 접근 시 컨펌 노출 후 로그인 페이지로 이동
    if (to.path !== '/') {
      handleLogout.value = true;

      window.setTimeout(() => {
        setPageLoad(true);
        useAlert(alertOption);
      }, 300);

      return navigateTo({ path: from.path });
    }
  }

  /*
   * 로그인 후
   */
  if (sessionData && typeof sessionData === 'string') {
    // 세션 존재 시 세션정보 저장
    Object.assign(nuxtApp.$global.sessionInfo, JSON.parse(sessionData));

    // 로그인 페이지로 접근 시 메인으로 이동
    if (to.path.includes('login')) {
      setPageLoad(true);
      return navigateTo({ path: '/' });
    }

    // lnb 데이터가 없을 경우 로드 후 이동
    if (!lnbData || !menuLnbList.value.length) {
      await fetchLnb();
    }

    // 공통코드가 없을 경우 공통코드 로드 후 이동
    if (!commonCodeData) {
      await setCodes();
    }

    // 로그인 이외의 페이지로 접근 시 세션 확인 후 이동
    if (!to.path.includes('login')) {
      /* 2024.01.22 화면 접근 제어 소스 시작 --
      if (lnbData) {
        const routeHisStr = window.sessionStorage.getItem('routeHistory');
        const parsedLnbData = JSON.parse(lnbData);
        const trimmedPath = to.path.replace(/\/+$/, '');
        const screenNo = trimmedPath?.substring(trimmedPath?.lastIndexOf('/') + 1);
        const notBlocked = parsedLnbData?.filter(menu => menu?.menuUrl?.includes(screenNo));

        if (!notBlocked.length && !to.path.includes('guide')) {
          window.setTimeout(() => {
            useAlert({
              title: 'alert',
              contents: `You do not have permission for this screen (${screenNo}).`,
              status: 'error',
              callback: () => {
                setPageLoad(true);
              },
            });
          }, 500);

          if (routeHisStr) {
            const routeBack = routeHisStr.split('?')[0];
            const urlParams = new URLSearchParams(routeHisStr.split('?')[1]);
            const query = Object.fromEntries(urlParams);

            return navigateTo({ path: routeBack, query });
          }

          if (!routeHisStr) {
            return navigateTo({ path: '/' });
          }
        }
      }
      -- 2024.01.22 화면 접근 제어 소스 끝 */

      const result = await healthCheck();

      if (!result) {
        handleLogout.value = true;
        clearSession();
        nuxtApp.$global.sessionInfo = {};

        window.setTimeout(() => {
          setPageLoad(true);
          useAlert(alertOption);
        }, 300);

        return false;
      }
    }
  }
});
