import { defineStore } from 'pinia';

export const useCSM0012M00 = defineStore({
  id: 'CSM0012M00',
  state: () => {
    return {
      // 테이블 데이터
      notiListData: {
        totalCnt: 0,
        notiList: [],
        fileList: [],
        mainNotiList: [],
        mainNotiFileList: [],
      },
    };
  },
  actions: {
    // 테이블 조회
    async fetchListNotice(body) {
      try {
        const data = await useDefaultFetch('/csm/selectListNotice', {
          method: 'post',
          body: body,
        });

        if (data && data.resultCd === '0000') {
          const { list, fileList, totalCnt } = data.resultData;
          //callPath: 'main';
          if (data.resultData?.totalCnt === 0 && body.callPath && body.callPath !== 'main') {
            useAlert({ title: 'Info', contents: 'No Records Found.' });
          }
          // console.log('body.callPath: ', body.callPath);
          if (body.callPath && body.callPath == 'main') {
            this.notiListData.mainNotiList = list ? list : [];
            this.notiListData.mainNotiFileList = fileList ? fileList : [];
          } else {
            this.notiListData.totalCnt = totalCnt;
            this.notiListData.notiList = list ? list : [];
            this.notiListData.fileList = fileList ? fileList : [];
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },
    // 실행버튼 클릭시
    async fetchExecution(uri, body) {
      try {
        const data = await useDefaultFetch(`/csm/${uri}`, {
          method: 'post',
          body: body,
        });
        if (data && data.resultCd === '0000') {
          return true;
        }
      } catch (e) {
        console.warn(e);
      }
    },
  },
  getters: {},
});
