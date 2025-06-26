import { defineStore } from 'pinia';

export const useCSM0008M00 = defineStore({
  id: 'CSM0008M00',
  state: () => {
    return {
      gridListData: {
        totalCnt: 0,
        list: [],
      },

      detailGridListData:{
        totalCnt: 0,
        list: [],
      }
    };
  },
  actions: {
    async fetchGridList(body) {
      try {
        const data = await useDefaultFetch('/csm/selectListComCodeMgt', {
          method: 'post',
          body: body,
        });

        if (data && data.resultCd === '0000') {
          const { list, totalCnt } = data.resultData;

          this.gridListData.totalCnt = totalCnt;
          this.gridListData.list = list ? list : [];
          if (data.resultData?.totalCnt === 0) {
            useAlert({ title: 'Info', contents: "No Records Found."});
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },

    async detailFetchGridList(body) {
      try {
        const data = await useDefaultFetch('/csm/selectListComCodeDtailMgt', {
          method: 'post',
          body: body,
        });

        if (data && data.resultCd === '0000') {
          const { list, totalCnt } = data.resultData;

          this.detailGridListData.totalCnt = totalCnt;
          this.detailGridListData.list = list ? list : [];
          if (data.resultData?.totalCnt === 0) {
            useAlert({ title: 'Info', contents: "No Records Found."});
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },

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
  getters: {
    
  },
});
