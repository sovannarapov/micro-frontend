import { defineStore } from 'pinia';

export const useCSM0049M00 = defineStore({
  id: 'CSM0049M00',
  state: () => {
    return {
      // 테이블 데이터
      issueListData: {
        totalCnt: 0,
        issueList: [],
        fileList: [],
        mainIssueList: [],
        mainIssueFileList: [],
      },
    };
  },
  actions: {
    // 테이블 조회.
    async fetchListIssue(body) {
      try {
        const data = await useDefaultFetch('/defects/selectListDefects', {
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
            this.issueListData.mainIssueList = list ? list : [];
            this.issueListData.mainIssueFileList = fileList ? fileList : [];
          } else {
            this.issueListData.totalCnt = totalCnt;
            this.issueListData.issueList = list ? list : [];
            this.issueListData.fileList = fileList ? fileList : [];
          }
        }
      } catch (e) {
        console.warn(e);
      }
    },
    // 실행버튼 클릭시
    async fetchExecution(uri, body) {
      try {
        const data = await useDefaultFetch(`/defects/${uri}`, {
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
