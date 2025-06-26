import { defineStore } from 'pinia';

export const useCSM0017P01 = defineStore({
  id: 'CSM0017P01',
  state: () => {
    return {
      fileInfo: {
        totalCnt: 0,
        fileList: [],
      },
    };
  },
  actions: {
    async fetchUploadFiles(payload) {
      try {
        const result = await useDefaultFetch('/csm/fileupload', {
          method: 'post',
          body: payload,
        });

        if (result && result.resultCd === '0000') {
          return result;
        }
      } catch (e) {
        console.warn('e', e);
      }
    },
  },
  getters: {},
});
