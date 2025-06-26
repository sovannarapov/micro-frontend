import dayjs from 'dayjs';
import { useCommonStore } from '@/store/common/';
import { getSessionInfo } from '@/common/util/helpers';

const config = useRuntimeConfig();
const {
  public: { ENV },
} = config;
const currentEnv = ENV.toLowerCase();
const router = useRouter();
const ozViewer = [
  { name: 'HTML', value: '/oz/viewer/ozhviewer.jsp' },
  { name: 'EXE', value: '/oz/viewer/ozexeviewer.jsp' },
];

export default {
  async callApi(uri, restMethod, body, callBack, param) {
    const commonStore = useCommonStore();
    const { toggleBussinessError } = commonStore;

    try {
      toggleBussinessError('');

      if (typeof callBack === 'function') {
        const data = await useDefaultFetch(`${uri}`, {
          method: restMethod,
          disableErrorMsg: param?.disableErrorMsg,
          body: body,
        });

        if (data && data.resultCd === '0000') {
          data.uri = uri;
          if (param?.noDataChkYn === 'N') {
            //조회 데이터 없어도 메시지 출력 X
          } else {
            if (data.resultData?.totalCnt === 0) {
              useAlert({ title: 'Info', contents: 'No Records Found.' });
            }
          }

          if (param?.noDataChkYn !== 'N') toggleBussinessError('success');

          return callBack(data, param);
        }

        if (!data) {
          if (param?.noDataChkYn !== 'N') toggleBussinessError('fail');
        }
      } else {
        const options = { title: 'Error', contents: 'Callback function is not defined.' };

        useAlert(options);

        return false;
      }
    } catch (e) {
      console.warn(e);
    }
  },
  callOzReport(pOzrName, pJsondata, pOzType, pOzService, pViewerMode) {
    const pOdidata = {};
    this.callOzOdiReport(pOzrName, pJsondata, pOdidata, pOzType, pOzService, pViewerMode);
  },
  callOzOdiReport(pOzrName, pJsondata, pOdidata, pOzType, pOzService, pViewerMode) {
    const sessionInfo = getSessionInfo();

    if (!sessionInfo) {
      const { currentRoute } = router;
      const { path } = currentRoute.value;
      const redirectToLogin = () => {
        router.push({ path: '/login/', query: { redirect: path } });
      };
      const alertOptions = {
        title: 'alert',
        contents: 'The session has expired. please login again.',
        status: 'error',
        callback: redirectToLogin,
      };

      useAlert(alertOptions);

      return false;
    }

    const delimiter = '^';
    const sysdate = dayjs(new Date()).format('DD/MM/YYYY HH:MM:ss');
    const viewer = ozViewer.filter(item => item.name === pOzType)[0];
    if (pViewerMode === undefined || pViewerMode === '') pViewerMode = 'preview';
    const defaultParam = {
      report: pOzrName,
      jsondata: pJsondata,
      odidata: pOdidata,
    };
    const loanParam = {
      delimiter: '^',
      taildata:
        sessionInfo.brnCode +
        delimiter +
        sessionInfo.uno +
        delimiter +
        sessionInfo.operGroupCd +
        delimiter +
        sessionInfo.brnName +
        delimiter +
        sessionInfo.langDstcd +
        delimiter +
        sysdate +
        delimiter +
        sysdate,
    };
    console.log('currentEnv', currentEnv);
    console.log(window.location.origin + viewer.value);
    const ozParam = computed(() => ({
      url:
        (currentEnv === 'local' ? 'https://dev-loan.kbprasacbank.com.kh:8443/' : window.location.origin) + viewer.value,
      // url: JSON.parse(window.sessionStorage.getItem('sessionInfo')).ozServerUrl, // + viewer.value,
      service: pOzService,
      viewerMode: pViewerMode,
      params:
        pOzService === 'loan' || undefined
          ? {
              ...defaultParam,
              ...loanParam,
            }
          : defaultParam,
    }));
    const options = {
      title: 'OZ Report',
      width: 1300,
      height: 800,
      component: 'Report',
      datas: ozParam.value,
      callback: null,
    };
    console.log('ozParam', ozParam);
    console.log('sysdate : ', sysdate);

    usePopup(options);
  },
  lovPopup(title, functionId, lovId, fnCallBack) {
    const options = {
      title: title,
      component: 'LNE0000P01',
      datas: {
        functionId: functionId,
        lovId: lovId,
      },
      callback: fnCallBack,
    };

    usePopup(options);
  },
};
