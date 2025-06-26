import { useCommonStore } from '@/store/common/';

const handleSession = () => {
  const router = useRouter();
  const commonStore = useCommonStore();
  const initTimer = ref();
  const sessionTimer = ref();

  const redirectToLogin = () => {
    router.push({ path: '/login/' });
  };

  const checkSession = async () => {
    try {
      const sessionCheck = await commonStore.healthCheck();

      if (sessionCheck) {
        initTimer.value = window.setTimeout(waitForNextCheck, 1000);
      }

      if (!sessionCheck) {
        window.clearTimeout(sessionTimer.value);
        window.clearTimeout(initTimer.value);

        sessionTimer.value = null;
        initTimer.value = null;

        commonStore.clearSession();

        const options = {
          title: 'alert',
          contents: 'The session has expired. please login again.',
          callback: redirectToLogin,
        };

        useAlert(options);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const waitForNextCheck = () => {
    console.log('waitForNextCheck >>>>');
    sessionTimer.value = window.setTimeout(checkSession, 9000);
  };

  // checkSession();
};

export default handleSession;
