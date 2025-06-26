import { defineStore } from 'pinia';

export const useCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      tempData: {},
      alert: {
        stat: false,
        title: '',
        status: '',
        contents: '', 
        callback: null,
        param: {},
      },
      dialog: {
        stat: false,
        title: '',
        contents: '',
        callback: null,
        cancelCallback: null,
        param: {},
        cancelParam: {},
      },
      popup: {
        stat: false,
        title: '',
        width: 1000,
        height: 600,
        component: '',
        datas: { fileGroup: '', idnfiNo: '', files: [] },
        attachedFiles: {},
        callback: null,
        type: '',
      },
      toast: {
        stat: false,
        title: '',
        contents: '',
        callBackFn: null,
      },
      businessError: {
        stat: '',
        messages: {
          success: 'The transaction has been successfully completed.',
          fail: 'The transaction has failed.',
        },
      },
      loaderStatus: false,
      menuLnbList: [],
      tabHistory: [],
      tabQueryHistory: {},
      session: false,
      sessionInfo: {},
      pageLoaded: true,
      isTab: false,
      currentApprovalYn: '',
      errorCode: '',
      errorMessage: {},
    };
  },
  actions: {
    showAlert(options) {
      if (options) {
        Object.assign(this.alert, options);
      }
      this.alert.stat = true;
    },
    hideAlert(options) {
      if (options && options.flag) {
        if (this.alert.callback !== null) this.alert.callback(this.alert.param);
      }
      Object.assign(this.alert, { stat: false, title: '', status: '', contents: '', callback: null, param: {} });
    },
    showDialog(options) {
      if (options) {
        Object.assign(this.dialog, options);
      }
      this.dialog.stat = true;
    },
    hideDialog(options) {
      // confirm 시
      if (options) {
        if (options.flag) {
          if (this.dialog.callback !== null) this.dialog.callback(this.dialog.param);
        }
      }
      // cancel 시
      if (!options) {
        if (this.dialog.cancelCallback !== null) this.dialog.cancelCallback(this.dialog.cancelParam);
      }

      Object.assign(this.dialog, {
        stat: false,
        title: '',
        contents: '',
        callback: null,
        cancelCallback: null,
        param: {},
        cancelParam: {},
      });
    },
    clearPopup() {
      Object.assign(this.popup, {
        stat: false,
        title: '',
        component: '',
        width: 1000,
        height: 600,
        datas: { fileGroup: '', idnfiNo: '', files: [] },
        callBackFn: null,
      });
    },
    showPopup(options) {
      if (options) {
        Object.assign(this.popup, options);
      }
    },
    hidePopup(param) {
      Object.assign(this.popup, {
        stat: false,
        title: '',
        component: '',
        width: 1000,
        height: 600,
        datas: { fileGroup: '', idnfiNo: '', files: [] },
      });
    },
    saveTempData(payload) {
      Object.assign(this.tempData, payload);
    },
    deleteTempData() {
      this.tempData = {};
    },
    attachFiles(params) {
      // this.popup.attachedFiles
    },
    showToast(options) {
      if (options) {
        Object.assign(this.toast, options);

        if (options.callback && typeof options.callback === 'function') {
          this.toast.callBackFn = options.callback;
        }
      }
      this.toast.stat = true;
    },
    hideToast(options) {
      if (options && options.flag) {
        if (this.toast.callBackFn !== null) this.toast.callBackFn();
      }

      Object.assign(this.toast, { stat: false, title: '', contents: '', callBackFn: null });
    },
    toggleBussinessError(flag) {
      this.businessError.stat = flag;
    },
    showLoader() {
      this.loaderStatus = true;
    },
    hideLoader() {
      this.loaderStatus = false;
    },
    updateErrorCode(code) {
      this.errorCode = code;
    },
    async healthCheck() {
      try {
        const data = await useDefaultFetch('/auth/healthCheck ', {
          method: 'post',
          disableLoader: true,
        });
        if (data && data.resultCd === '0000') {
          const { session } = data.resultData;

          this.session = session;

          if (!session) {
            if (sessionStorage.getItem('sessionInfo')) {
              sessionStorage.removeItem('sessionInfo');
            }
          }
          return session;
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async login(body) {
      try {
        const data = await useDefaultFetch('/auth/actionLoginForIdPw', {
          method: 'post',
          body: body,
        });
        if (data) {
          if (data.resultCd === '0000') {
            const { result, sessionInfo } = data.resultData;

            this.session = result;

            if (result) {
              Object.assign(this.sessionInfo, sessionInfo);
              sessionStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));

              return true;
            }
          }
          if (data.resultCd !== '0000') {
            const alertOptions = {
              title: 'alert',
              contents: data.resultData.errorMsg,
              status: 'error',
            };

            useAlert(alertOptions);

            return false;
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async ssoLogin(code) {
      const config = useRuntimeConfig();
      const {
        public: { SSO_REDIRECT_URL, SSO_KEY, SSO_CLIENT },
      } = config;

      const ssoRedirectUrl = window.location.origin + SSO_REDIRECT_URL;
      const basicAuthCode = window.btoa(`${SSO_KEY}:${SSO_CLIENT}`);

      try {
        const data = await useAuthFetch('/oauth2/token', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuthCode}`,
          },
          method: 'post',
          params: {
            grant_type: 'authorization_code',
            scope: 'openid',
            redirect_uri: ssoRedirectUrl,
            code,
          },
        });

        if (data) {
          return data;
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async loginWithToken(body) {
      try {
        const data = await useDefaultFetch('/auth/actionLoginForIdPw', {
          method: 'post',
          body: body,
        });
        if (data) {
          if (data.resultCd === '0000') {
            const { result, sessionInfo } = data.resultData;

            this.session = result;

            if (result) {
              Object.assign(this.sessionInfo, sessionInfo);
              sessionStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));

              return { status: true, sessionInfo: this.sessionInfo };
            }
          }

          if (data.resultCd !== '0000') {
            return {
              status: false,
              message: data.resultData.errorMsg,
            };
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async logout() {
      if (!sessionStorage.getItem('sessionInfo')) {
        return false;
      }

      try {
        const data = await useDefaultFetch('/auth/actionLogOut', {
          method: 'post',
        });
        if (data) {
          if (sessionStorage.getItem('sessionInfo')) {
            this.session = false;
            sessionStorage.removeItem('sessionInfo');
          }
          if (sessionStorage.getItem('ssoIdToken')) {
            sessionStorage.removeItem('ssoIdToken');
          }
          return true;
        }
      } catch (e) {
        console.warn(e);
      }
    },
    clearSession() {
      try {
        this.sessionInfo = {};
        this.session = false;
        if (sessionStorage.getItem('sessionInfo')) {
          sessionStorage.removeItem('sessionInfo');
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async fetchLnb() {
      try {
        // if (!sessionStorage.getItem('menuLnbList')) {
        const lnb = await useDefaultFetch('/main/selectListLnb', { method: 'post', body: {} });

        if (lnb && lnb.resultCd === '0000') {
          sessionStorage.setItem('menuLnbList', JSON.stringify(lnb.resultData.menuLnbList));
          this.menuLnbList = lnb.resultData.menuLnbList;

          return true;
        }
        // }
        // if (sessionStorage.getItem('menuLnbList')) {
        //   this.menuLnbList = JSON.parse(sessionStorage.getItem('menuLnbList'));

        //   return true;
        // }
      } catch (e) {
        console.warn(e);
      }
    },
    updateLnb(list) {
      this.menuLnbList = list;
    },
    async fetchCommonCodes(payload) {
      try {
        const result = await useDefaultFetch('/csm/selectListComCodeDtailSimple', {
          method: 'post',
          body: payload,
        });

        if (result && result.resultCd === '0000') {
          return result.resultData.list;
        }
      } catch (e) {
        console.warn('e', e);
      }
    },
    async fetchFilesInfo(payload) {
      try {
        const result = await useDefaultFetch('/csm/getFileInfos', {
          method: 'get',
          params: payload,
        });

        if (result && result.resultCd === '0000') {
          return result.resultData.fileList;
        }
      } catch (e) {
        console.warn('e', e);
      }
    },
    async uploadFiles(payload) {
      try {
        const result = await useDefaultFetch('/csm/fileupload', {
          method: 'post',
          body: payload,
        });

        if (result && result.resultCd === '0000') {
          return result.resultData;
        }
      } catch (e) {
        console.warn('e', e);
      }
    },
    setPageLoad(payload) {
      this.pageLoaded = payload;
    },
    addTab(payload, query) {
      const tabLength = 9;
      if (!this.tabHistory.includes(payload)) {
        if (this.tabHistory.length < tabLength) this.tabHistory.push(payload);
        if (this.tabHistory.length >= tabLength) this.tabHistory.shift();
      }
      /* 기존 탭 처리
      if (!this.tabHistory.includes(payload)) {
        if (this.tabHistory.length < 11) this.tabHistory.push(payload);
        if (this.tabHistory.length >= 11) this.tabHistory.shift();
      }
      */

      if (!Object.keys(query).length > 0) {
        if (this.tabQueryHistory[payload]) delete this.tabQueryHistory[payload];
      }

      if (Object.keys(query).length > 0) {
        this.tabQueryHistory[payload] = query;
      }
    },
    shiftTab(payload) {
      try {
        if (this.tabHistory.includes(payload)) {
          const pos = this.tabHistory.indexOf(payload);
          const extracted = this.tabHistory.splice(pos, 1)[0];

          this.tabHistory.unshift(extracted);

          return true;
        }
      } catch (e) {
        console.warn(e);

        return false;
      }
    },
    deleteTab(payload) {
      try {
        this.tabHistory = this.tabHistory.filter(path => path !== payload);

        for (const q in this.tabQueryHistory) {
          if (q === payload) delete this.tabQueryHistory[q];
        }

        return true;
      } catch (e) {
        console.warn(e);
        return false;
      }
    },
    deleteAllTabs() {
      try {
        this.tabHistory = [];
        this.tabQueryHistory = {};

        return true;
      } catch (e) {
        console.warn(e);
        return false;
      }
    },
    deleteAllHiddenTabs() {
      try {
        const tabs = this.searchableLnb?.reduce((ac, cr) => {
          return this.tabHistory.includes(cr.menuUrl) ? [...ac, cr] : ac;
        }, []);

        const newTabs = tabs?.filter(tab => tab.parentMenuId !== 'H')?.map(tab => tab.menuUrl);
        const hiddenTabs = tabs.filter(tab => tab.parentMenuId === 'H')?.map(tab => tab.menuUrl);

        this.tabHistory = newTabs;

        return hiddenTabs;
      } catch (e) {
        console.warn(e);
        return false;
      }
    },
    setIsTab(payload) {
      this.isTab = payload;
    },
  },
  getters: {
    // lnb menu
    mappedLnb() {
      const lnbRaw = this.menuLnbList;
      const mdLnb = [];

      if (lnbRaw) {
        // depth 1
        for (const depth1 of lnbRaw) {
          if (depth1.menuLev === 1) {
            const tgt = {
              ...depth1,
              // visible: false,
              child: [],
            };

            if (tgt.useYn === '1') mdLnb.push(tgt);
          }
          // depth 2
          for (const depth2 of mdLnb) {
            if (depth1.parentMenuId === depth2.menuId) {
              const tgt = {
                ...depth1,
                // visible: false,
                child: [],
              };
              if (tgt.useYn === '1') depth2.child.push(tgt);
            }
            // depth 3
            for (const depth3 of depth2.child) {
              if (depth1.parentMenuId === depth3.menuId) {
                const tgt = {
                  ...depth1,
                };
                if (tgt.useYn === '1') depth3.child.push(tgt);
              }
            }
          }
        }
      }

      return mdLnb;
    },
    searchableLnb() {
      const lnbRaw = this.menuLnbList;
      const schbLnb = lnbRaw?.filter(menu => (menu.menuLev === 3 && menu.useYn === '1') || menu.parentMenuId === 'H');
      // lnbRaw.filter(hh => {
      //   if (hh.useYn === '0') console.log('hh', hh.menuLev, hh.menuUrl, hh.menuEngName, hh.useYn);
      // });
      return schbLnb;
    },
  },
});
