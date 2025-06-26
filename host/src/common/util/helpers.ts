import dayjs from 'dayjs';
import empty from 'is-empty';
import { useCommonStore } from '@/store/common/';
import { storeToRefs } from 'pinia';
import { modalInstances } from '@/composables/usePopup';

const initObject = targetObject => {
  let objectKeys = Object.keys(targetObject);
  for (let i = 0; i < objectKeys.length; i++) {
    targetObject[objectKeys[i]] = '';
  }
};

const trimObject = (to, from) => {
  const newObj = {};

  if (!to || !from) return;

  for (const a in to) {
    for (const b in from) {
      if (a === b) {
        newObj[a] = from[b];
      }
    }
  }

  return newObj;
};

const clearCommas = number => {
  if (!number) return '';
  if (number) {
    const cleared = number.replace(/,/gi, '');

    return cleared;
  }
};

const adjNclearCommas = number => {
  if (!number) return '';
  if (number) {
    const intg = String(number);
    const sIntg = intg?.split('.')[0].replace(/,/gi, '');
    const fixed = intg?.split('.')[1];

    if (fixed) return sIntg + '.' + fixed;
    if (!fixed) return sIntg;
  }
};

const clearChars = number => {
  const cleared = number.replace(/[^0-9.]/g, '');

  return cleared;
};

const numberWithCommas = (number, fixed?) => {
  const splittedNum = number.toString().split('.');
  const belowNum = splittedNum[1] ? '.' + splittedNum[1] : '';
  let paddNum = '';

  if (number && fixed) {
    if (belowNum) {
      let gap = 0;
      const belowNumLen = belowNum.replace('.', '').length;
      if (fixed > belowNumLen) gap = fixed - belowNumLen;

      for (let i = 0; i < gap; i++) paddNum += '0';
    }
    if (!belowNum) {
      paddNum = '.';
      for (let i = 0; i < fixed; i++) paddNum += '0';
    }
  }

  // const removeLeadingZero = splittedNum[0] ? parseInt(splittedNum[0].replace(/,/gi, '')) + '' : '';
  const removeLeadingZero = splittedNum[0] ? splittedNum[0].replace(/,/gi, '') + '' : '';
  return removeLeadingZero.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + belowNum + paddNum;
};

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const parseDateInfo = str => {
  const m = str?.match(/^(\d{4})(\d{1,2})(\d{1,2})$/);
  return m ? new Date(m[1], m[2] - 1, m[3]) : null;
};

const parseDateLoan = str => {
  const m = str?.match(/^(\d{1,2})(\d{1,2})(\d{4})$/);
  return m ? new Date(m[3], m[2] - 1, m[1]) : null;
};

const dateToDDMMMYYYY = str => {
  if (!str) return '';
  return dayjs(parseDateLoan(str)).format('DD-MMM-YYYY');
};

const dateToDDMMMYYYYInfo = str => {
  if (!str) return '';
  return dayjs(parseDateInfo(str)).format('DD-MMM-YYYY');
};

const diffDatesLoan = (dateStarts: string, dateEnds: string) => {
  if (!dateStarts || !dateEnds) return false;

  const parsedDateStart = parseDateLoan(dateStarts);
  const parsedDateEnd = parseDateLoan(dateEnds);

  const compDateStart = dayjs(parsedDateStart);
  const compDateEnd = dayjs(parsedDateEnd);

  const diff = compDateEnd.diff(compDateStart, 'day', true);

  return diff;
};

const diffDatesInfo = (dateStarts: string, dateEnds: string) => {
  if (!dateStarts || !dateEnds) return false;

  const compDateStart = dayjs(dateStarts);
  const compDateEnd = dayjs(dateEnds);

  const diff = compDateEnd.diff(compDateStart, 'day', true);

  return diff;
};

const allowNumberOnly = e => {
  const char = String.fromCharCode(e.keyCode);

  if (/^[-0-9.]+$/.test(char)) return true;
  else e.preventDefault();
};

const allowEngOnly = e => {
  const char = String.fromCharCode(e.keyCode);

  if (/^[a-zA-Z]+$/.test(char)) return true;
  else e.preventDefault();
};

const allowNumberOnlyWithoutFullstop = e => {
  const char = String.fromCharCode(e.keyCode);

  if (/^[0-9]+$/.test(char)) return true;
  else e.preventDefault();
};

const getSessionInfo = () => {
  const strSessionInfo = window.sessionStorage.getItem('sessionInfo');
  const sessionInfo = strSessionInfo ? JSON.parse(strSessionInfo) : null;

  return sessionInfo;
};

const innerFns = {
  numberWithCommas,
  dateToDDMMMYYYY,
};

// TODO : type 작성
interface IGType {
  [key: string | number]: any;
}

/*
 * OZ report 팝업 전송 jsparam
 *
 */
const generateOZparam = (included, items) => {
  const generaeted = items?.reduce((acc, current) => {
    const fldObj = {};

    for (const item in current) {
      // 기본값 입력
      fldObj[item] = current[item];
      // 포맷팅이 필요한 경우 변환 처리
      for (const mthd in included) {
        // item내 키와 적용시킬 메서드 목록 비교하여 추출
        if (item === mthd) {
          fldObj[item] = current[item];
          // 해당 formatting 메서드 존재 시 적용
          if (typeof included[mthd] === 'string' && innerFns[included[mthd]]) {
            fldObj[item] = innerFns[included[mthd]](current[item]);
          }
          // select box 처리
          if (typeof included[mthd] === 'object') {
            const { target, option } = included[mthd];

            // 선택된 option값 추출
            const fullValue = target?.filter(v => v.value === current[item])[0]?.name;

            if (option) fldObj[item] = `${fldObj[item]} : ${fullValue}`;
            if (!option) fldObj[item] = fullValue;
          }
        }
      }
    }

    return [...acc, fldObj];
  }, []);

  return generaeted;
};

const getCodeNameByValue = (codeList, value) => {
  const itemName = codeList.filter(item => {
    if (item.value === value) {
      return item.name;
    }
  });

  return itemName[0].name;
};

const isEmpty = param => empty(param);

const maskName = name => {
  if (name.length < 4) return false;

  const masked = name.slice(0, name.length - 4) + '*'.repeat(4);

  return masked;
};

const formatHHMMSS = time => {
  const cleared = time.replace(/:/gi, '').slice(0, 6);

  if (cleared.length < 6) return false;

  const formattedTime = cleared.replace(/(..)/g, '$1:').slice(0, -1);

  return formattedTime;
};

const procDownload = async (url: string, param: Record<string, unknown>, callback?) => {
  try {
    const result = await useDefaultFetch(url, {
      method: 'get',
      responseType: 'blob',
      params: {
        ...param,
      },
    });

    if (result) {
      const { data, fileName } = result;
      const url = window.URL.createObjectURL(data);

      const a = document.createElement('a');
      const clickHandler = () => {
        window.setTimeout(() => {
          window.URL.revokeObjectURL(url);
          removeEventListener('click', clickHandler);
          if (typeof callback === 'function') callback();
        }, 100);
      };

      a.href = url;
      a.download = fileName || 'download';

      a.addEventListener('click', clickHandler, false);
      a.click();
    }
  } catch (e) {}
};

const convertImg = async (url: string, param: Record<string, unknown>, callback?) => {
  try {
    const result = await useDefaultFetch(url, {
      method: 'get',
      params: {
        ...param,
      },
      responseType: 'blob',
    });

    const { type } = result;

    if (type) {
      const blob = new Blob([result.data], { type });
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result;
        if (typeof callback === 'function') callback(base64data);
      };
      reader.readAsDataURL(blob);
    }
  } catch (e) {}
};

const setCurrentApprYN = flag => {
  const commonStore = useCommonStore();
  const { currentApprovalYn } = storeToRefs(commonStore);

  currentApprovalYn.value = flag;
};

const getCurrentApprYN = () => {
  const commonStore = useCommonStore();
  const { searchableLnb } = commonStore;

  // 레이어팝업에서 확인 시
  if (createdIds.length) {
    const lastId = createdIds[createdIds.length - 1];
    const lyComp = modalInstances[lastId];
    const { options } = lyComp;
    const compName = options?.attrs?.component;
    const fltdMenu = searchableLnb?.filter(menu => menu.menuUrl.includes(compName))[0];

    if (fltdMenu) return fltdMenu.approvalYn;
  }

  // 본문에서 확인 시
  if (!createdIds.length) {
    const route = useRoute();
    const trimmedPath = computed(() => route?.path.replace(/\/+$/, ''));
    const fltdMenu = searchableLnb?.filter(menu => menu.menuUrl === trimmedPath.value)[0];

    if (fltdMenu) return fltdMenu.approvalYn;
  }
};
const getDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(mm, 10) - 1; // convert "06" to 5
  const monthEnglish = monthNames[monthIndex];
   return `${dd}-${monthEnglish}-${yyyy} `;
}
// dd-mm-yy
function formatDateStr(dateString) {
   // Ensure the date string is in the correct format
  if (dateString.length !== 14) {
    return "Invalid date format";
  }
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4);
  let year = dateString.substring(4, 8);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(month, 10) - 1; // convert "06" to 5
  const monthEnglish = monthNames[monthIndex];
  // const date = new Date(`${year}-${month}-${day}`);
  const hours = dateString.substring(8, 10);  
  const minutes = dateString.substring(10, 12);   
  const seconds = dateString.substring(12, 14);
  return `${day}-${monthEnglish}-${year} `;
}

//08-oct-2024
function formatDateDDMMYYYY(dateString) {
  // Ensure the date string is in the correct format
  if (dateString.length !== 14) {
    return "Invalid date format";
  }
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4);
  let year = dateString.substring(4, 8);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(month, 10) - 1; // convert "06" to 5
  const monthEnglish = monthNames[monthIndex];
  // const date = new Date(`${year}-${month}-${day}`);
  const hours = dateString.substring(8, 10);  
  const minutes = dateString.substring(10, 12);
  // check AM/PM
  const chkTime = hours >= "12" ? "PM" : "AM"; 
  return `${day}-${monthEnglish}-${year}`;
}

// const timestamp = "2024-10-08T03:59:04.000+00:00";
function formatDate(dateString) {

const timestamp = dateString;
const date = new Date(timestamp);

// Format the date to ddmmyyyy
const dd = String(date.getUTCDate()).padStart(2, '0');
const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
const yyyy = date.getUTCFullYear();

const formattedDate = dd + mm + yyyy;
  // Ensure the date string is in the correct format
  if (formattedDate.length !== 8) {
    return "Invalid date format";
  }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(mm, 10) - 1; // convert "06" to 5
  const monthEnglish = monthNames[monthIndex];
  // const date = new Date(`${year}-${month}-${day}`);
  const hours = dateString.substring(8, 10);  
  const minutes = dateString.substring(10, 12);
  // check AM/PM
  const chkTime = hours >= "12" ? "PM" : "AM"; 
  return `${dd}-${monthEnglish}-${yyyy}`;
}

const checkPayment = (val) => {
  if(val === "A") {
    return "Account";
  }else if(val === "C") {
    return "Cash"
  }else {
    return "Cheque";
  }
}

// dd-mm-yy H:s
function formatDateTime(dateStr) {
    // Extract parts of the date string
    const day = dateStr.substring(0, 2);    // "03"
    const month = dateStr.substring(2, 4);  // "09"
    const year = dateStr.substring(4, 8);   // "2024"

    // Create a Date object
    const date = new Date(`${year}-${month}-${day}`);

    // Extract the time components
    const hours = date.getHours();    // 0, since no time was provided
    const minutes = date.getMinutes(); // 0, since no time was provided
    const seconds = date.getSeconds(); // 0, since no time was provided

    // Format date into dd-mm-yy :H:s
    const formattedDate = `${day}-${month}-${year.substring(2)} :${hours}:${seconds}`;
    return formattedDate;
}
const formatAmountList = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: "KHR",
  }).format(value);
};

const formatCrditAmount = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: "KHR",
  }).format(value);
};

const formatAmountBalance = (value,ccy) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: ccy=="USD" ? ccy : "KHR",
  }).format(value);
};

const  checkPermission = (el, binding) => {
  const {authCode} = getSessionInfo();
  const { value } = binding
 // const roles = store.getters && store.getters.roles
 
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = authCode.some(code => {
        return permissionRoles.includes(code)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']`)
  }
}

export {
  initObject,
  trimObject,
  allowNumberOnly,
  allowNumberOnlyWithoutFullstop,
  allowEngOnly,
  numberWithCommas,
  clearCommas,
  adjNclearCommas,
  clearChars,
  formatBytes,
  diffDatesLoan,
  diffDatesInfo,
  parseDateInfo,
  parseDateLoan,
  dateToDDMMMYYYY,
  dateToDDMMMYYYYInfo,
  getSessionInfo,
  generateOZparam,
  getCodeNameByValue,
  isEmpty,
  maskName,
  formatHHMMSS,
  procDownload,
  convertImg,
  setCurrentApprYN,
  getCurrentApprYN,
  getDate,
  checkPayment,
  formatDate,
  formatDateTime,
  formatCrditAmount,
  formatAmountBalance,
  formatDateStr,
  formatAmountList,
  checkPermission,
  formatDateDDMMYYYY
};
