const compareDatas = id => {
  const tid = id.replace('#', '');

  window.setTimeout(() => {
    // status 초기화
    for (const [index, item] of tableDatas[tid].entries()) {
      if (item.status !== 'N' && item.status !== 'D') item.status = 'R';
    }

    for (const [index, item] of originalDatas[tid].entries()) {
      if (item._rowVariant) delete item._rowVariant;
      if (item._cellVariants) delete item._cellVariants;

      // 원본 data key 와 변경된 data key 비교
      for (const tgt in item) {
        if (tgt !== 'isChecked' && tgt !== 'status' && typeof item[tgt] !== 'object') {
          // window.setTimeout(() => {
          // 원본값과 다른 item 검색
          if (item[tgt] !== toRaw(tableDatas[tid][index][tgt])) {
            // 삭제 상태가 아닌 status 변경
            if (tableDatas[tid][index].status !== 'D') tableDatas[tid][index].status = 'U';
          }
          // }, 100);
        }
      }
    }
  }, 100);
};

// TODO : type 작성
const targetTable: any = ref(null);
const dispatchTarget: any = ref(null);
const updateEvents = id => {
  targetTable.value = document.querySelector(id);
  const nodeList = targetTable?.value?.querySelectorAll('input, select, button, svg');

  const addEvents = (node, events, callback) => {
    events.split(' ').forEach(e => node.addEventListener(e, callback, false));
  };

  for (const node of nodeList) {
    addEvents(node, 'change input blur', e => {
      // console.log('ee', id);
      targetTable.value = document.querySelector(id);
      // TODO : throttling 추가
      window.setTimeout(() => {
        compareDatas(id);
      }, 100);
    });
  }
};

// 서버 원본 데이터
const serverData: Record<string, any>[] = reactive([]);
// 변경 후 반환할 데이터 - 삭제 예정
const receivedData: Record<string, any>[] = reactive([]);

const originalDatas = reactive({});
// 변경 후 반환할 데이터
const tableDatas = reactive({});

export const useDispatchEvent = () => {
  const blurEvent = new Event('blur');

  window.setTimeout(() => {
    targetTable?.value?.querySelector('input[type=text]').dispatchEvent(blurEvent);
  }, 100);
};

export const useUpdateEvents = param => {
  const { table, data } = param;
  const tid = table.replace('#', '');

  if (!table || !data) return false;

  Object.assign(originalDatas[tid], JSON.parse(JSON.stringify(data)));
  Object.assign(tableDatas[tid], data);

  setTimeout(() => {
    updateEvents(table);
  }, 300);
};

// TODO : clear method 작성

export const useUpdatedData = tid => {
  if (!tableDatas[tid]) tableDatas[tid] = [];
  if (!originalDatas[tid]) originalDatas[tid] = [];

  return tableDatas[tid];
};

const changedDataObj = reactive({});

export const useCompareData = (name, data) => {
  if (!data) return false;

  watch(
    () => data.value,
    (newValue, oldValue) => {
      const changed = newValue.filter(item => !oldValue.includes(item))[0];
      const idx = newValue.indexOf(changed);
      const updatedObj = { [name]: { idx, changedData: changed } };

      Object.assign(changedDataObj, updatedObj);
    },
    { deep: true },
  );

  return changedDataObj;
};

export const useClearCompareData = () => {
  for (const item in changedDataObj) delete changedDataObj[item];

  console.log('changedDataObj cleared : ', changedDataObj);
};
