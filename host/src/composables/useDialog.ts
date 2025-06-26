import { useCommonStore } from '@/store/common';

export const useDialog = (options?) => {
  const commonStore = useCommonStore();

  commonStore.showDialog(options);
};
