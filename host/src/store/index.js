import { defineStore } from 'pinia';

export const useRootStore = defineStore({
  id: 'root',
  state: () => {
    return {
      authData: null,
    };
  },
  actions: {},
  getters: {},
});
