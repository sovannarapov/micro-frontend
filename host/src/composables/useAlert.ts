import { useCommonStore } from '@/store/common';

export const useAlert = (options?) => {
  const commonStore = useCommonStore();

  commonStore.showAlert(options);
};
