import { ofetch } from 'ofetch';
import { useRootStore } from '@/store';
import { useCommonStore } from '@/store/common/';
import { createdIds, modalInstances } from '@/composables/usePopup';
import { RESULT_CODES } from '@/common/const';

const CONTEXT_PATH = '/backend';
const commonHeaderOptions = {
  Accept: '*',
  'Access-Control-Allow-Credentials': true,
  'Cache-Control': 'no-cache',
};
const { SUCCESS_CODE, SESSION_TIMEOUT } = RESULT_CODES;

let queues: string[] = [];

const clearQueue = req => {
  const trimmedReq = req.replace('/backend', '').split('?')[0];

  queues = queues.filter((item: string) => item.replace(/\//g, '') !== trimmedReq.replace(/\//g, ''));
};

const clearAllQueues = () => {
  queues.splice(0);
};

const newAbortSignal = (timeoutMs: number) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
};

export const useDefaultFetch = async (request, options?) => {
  const nuxtApp = useNuxtApp();
  // TODO : type 작성
  const { $router }: any = nuxtApp;
  const { currentRoute } = $router;
  const { fullPath, path } = currentRoute.value;
  const commonStore = useCommonStore();
  const { setPageLoad, showLoader, hideLoader, updateErrorCode, errorMessage } = commonStore;

  const redirectToLogin = () => {
    $router.push({ path: '/login/', query: { redirect: path } });
  };

  const alertOptions = {
    title: 'alert',
    contents: 'The session has expired. please login again.',
    status: 'error',
    callback: redirectToLogin,
  };

  return await ofetch(request, {
    withCredentials: true,
    baseURL: CONTEXT_PATH,
    headers: {
      ...commonHeaderOptions,
    },
    signal: newAbortSignal(20000000),
    ...options,
    async onRequest({ request, options }: any) {
      const currentPath = ref(path.substring(path.lastIndexOf('/') + 1));
      const lypopupId = createdIds.length ? createdIds[createdIds.length - 1] : undefined;
      const currentPopup = lypopupId ? modalInstances[lypopupId].options.attrs.component : undefined;
      const loginReq = '/auth/actionLoginForIdPw';
      const sessionReq = '/sso/getSessionId';
      const { body } = options;

      if (!options.disableLoader) showLoader();
      queues.push(request);

      // 로컬 세션 유실 시 로그인 페이지로 이동
      if (request !== loginReq && !sessionStorage.getItem('sessionInfo') && request !== sessionReq) {
        clearAllQueues();
        newAbortSignal(200);
        useAlert(alertOptions);

        return false;
      }

      if (currentPopup) currentPath.value = currentPopup;
      if (currentPath.value) {
        options.headers['Kbpb-Client-Info'] = JSON.stringify({ 'screen-No': currentPath.value, 'chnl-Dstcd': '01' });
      }
      if (body && body.token) {
        console.log('detect token', body.token);
        options.headers['Authorization'] = `Bearer ${body.token}`;
      }
    },
    async onRequestError({ request, options, error }: any) {
      console.log('onRequestError :: ', JSON.stringify(error));

      // clearAllQueues
      if (request.includes('healthCheck')) {
        useAlert(alertOptions);

        return false;
      }

      useAlert({ title: 'Request Error', contents: error });
      clearQueue(request);

      if (queues.length === 0) hideLoader();

      setPageLoad(true);
    },
    async onResponse({ request, response, options }: any) {
      const { status } = response;
      const { resultCd, resultData } = response?._data;
      const { disableErrorMsg } = options;

      clearQueue(request);

      // stream data download 예외 처리
      if (response?.headers?.get('content-disposition')) {
        if (queues.length === 0) hideLoader();

        const fileName =
          decodeURIComponent(response?.headers?.get('content-disposition').split(';'))
            .replace('attachment,filename=', '')
            .replace(/\"/gi, '')
            .trim() || 'download';

        const { type } = response?._data;

        if (type.includes('image')) {
          response._data = { data: response?._data, type };
        }

        if (!type.includes('image')) {
          const blobs = { data: response?._data, fileName };
          response._data = blobs;
        }

        return false;
      }

      if (queues.length === 0) {
        if (request.includes('actionLoginForIdPw')) {
          if (resultCd !== SUCCESS_CODE) hideLoader();
          return false;
        }
        hideLoader();
      }

      if (status !== 200) return;

      // 세션 만료 시 로그인 페이지로 이동
      if (resultCd === SESSION_TIMEOUT || resultCd === 'CSMA00008') {
        sessionStorage.removeItem('sessionInfo');

        clearAllQueues();
        newAbortSignal(200);
        useAlert(alertOptions);

        // response._data = null;
        return false;
      }

      if (resultCd !== SUCCESS_CODE) {
        const popupOptions = {
          title: 'Error Occurred',
          width: 1000,
          component: 'Error',
          datas: { resultCd, resultData },
        };

        updateErrorCode(resultCd);
        Object.assign(errorMessage, resultData);

        if (disableErrorMsg === undefined || !disableErrorMsg) {
          usePopup(popupOptions);
        }

        response._data = null;
        return false;
      }

      if (resultCd === SUCCESS_CODE) {
        response._data = { resultCd, resultData };
      }

      // console.log('response success >>>> ', response, queues);
    },
    async onResponseError({ request, response, options }: any) {
      const errorStat = { title: 'Server Error', contents: '' };

      if (response._data) {
        const { error, status } = response._data;

        errorStat.title = error;
        errorStat.contents = status ? `${status} error occurred` : 'Unknown server error occurred';
      }

      if (!response._data) {
        const { statusText, status } = response;

        errorStat.title = statusText;
        errorStat.contents = String(status);
      }

      if (response._data instanceof Blob) {
        const { status, statusText } = response;

        errorStat.title = statusText;
        errorStat.contents = status;
      }

      if (!(response._data instanceof Object)) {
        const { status, statusText } = response;

        errorStat.title = 'Error';
        errorStat.contents = status ? `${status}<br/><br/>${statusText}` : 'Unknown server error occurred';
      }

      useAlert(errorStat);
      clearQueue(request);
      setPageLoad(true);

      if (queues.length === 0) hideLoader();
    },
  });
};

export const useAuthFetch = async (request, options?) => {
  const config = useRuntimeConfig();
  const {
    public: { SSO_URL, SSO_REDIRECT_URL, SSO_KEY, SSO_CLIENT },
  } = config;
  const commonStore = useCommonStore();
  const { showLoader } = commonStore;

  return await ofetch(request, {
    withCredentials: true,
    baseURL: SSO_URL,
    headers: {
      ...commonHeaderOptions,
    },
    signal: newAbortSignal(20000000),
    ...options,
    async onRequest({ request, options }: any) {
      showLoader();
    },
    async onRequestError({ request, options, error }) {},
    async onResponse({ request, response, options }: any) {
      return response._data;
    },
    async onResponseError({ request, response, options }: any) {},
  });
};

export const useTestFetch = async (request, options?) => {
  const nuxtApp = useNuxtApp();
  // TODO : type 작성
  const { $router }: any = nuxtApp;
  const { currentRoute } = $router;
  const { fullPath, path } = currentRoute.value;
  const commonStore = useCommonStore();

  return await ofetch(request, {
    withCredentials: true,
    baseURL: '/api',
    headers: {
      ...commonHeaderOptions,
    },
    signal: newAbortSignal(20000000),
    ...options,
    async onRequest({ request, options }: any) {
      console.log('onRequest', request, options);
      // options.headers['Content-Type'] = 'image/png';
      // options.headers.responseType = 'blob';
    },
    async onRequestError({ request, options, error }) {},
    async onResponse({ request, response, options }: any) {
      const { status } = response;
      const { resultCd, resultData } = response?._data;
      console.log('response?.headers?', response?.headers?.get('content-disposition'));
      return response._data;
    },
    async onResponseError({ request, response, options }: any) {},
  });
};
