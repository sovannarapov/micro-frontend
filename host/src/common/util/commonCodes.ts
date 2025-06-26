import { useCommonStore } from '@/store/common';

// 전체 공통 코드 호출
const setCodes = async (param?) => {
  const commonStore = useCommonStore();
  const { fetchCommonCodes } = commonStore;

  if (!localStorage.getItem('commonCodes')) {
    try {
      const codes = await fetchCommonCodes({});

      if (codes) {
        localStorage.setItem('commonCodes', JSON.stringify(codes));

        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  if (localStorage.getItem('commonCodes')) return true;
};

// 특정 코드 비동기 호출
const getCodes = async (param?) => {
  const { key, value } = param ? param : { key: '', value: '' };
  const payLoad = { [key]: value };
  const commonStore = useCommonStore();
  const { fetchCommonCodes } = commonStore;

  try {
    const codes = await fetchCommonCodes({ ...payLoad });

    if (codes) return codes;
  } catch (e) {
    console.warn(e);
  }
};

const clearCodes = async () => {
  if (localStorage.getItem('commonCodes')) localStorage.removeItem('commonCodes');
};

// 로컬스토리지에서 특정 코드 호출
const getCodesFromStorage = (param?) => {
  const commonCodes = localStorage.getItem('commonCodes');

  if (commonCodes) {
    const parsedCommonCodes = JSON.parse(commonCodes);

    if (param) {
      const { key, value } = param;
      const result = parsedCommonCodes.filter(item => item[key] === value);
      const finalCommonCodes = [].concat(result);

      return finalCommonCodes;
    }

    if (!param) {
      const finalCommonCodes = [].concat(parsedCommonCodes);

      return finalCommonCodes;
    }
  }
};

const checkCommonCode = () => {
  const flag = localStorage.getItem('commonCodes') ? true : false;

  return flag;
};

const getComCodes = val => {
  return getCodesFromStorage({ key: 'bzwkInstncIdnfr', value: val });
};

export { setCodes, getCodes, clearCodes, getCodesFromStorage, checkCommonCode, getComCodes };
