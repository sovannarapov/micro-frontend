import { useCommonStore } from '@/store/common/';
import { storeToRefs } from 'pinia';

export const useDetectTab = () => {
  const commonStore = useCommonStore();
  const { isTab }: any = storeToRefs(commonStore);

  return isTab.value;
};
