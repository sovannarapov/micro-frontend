import { defineStore } from 'pinia';

export const useGuideStore = defineStore({
  id: 'guide',
  state: () => {
    return {
      tempData: {},
      tableDataList: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        {
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
        },
        {
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
        },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ],
      tableDataListSelectable: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        {
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
        },
        {
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
        },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ],
      cellColorTableDataList: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        {
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
        },
        {
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
          tdClass: 'nameOfTheClass',
        },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ],
      cellTextTrimTableDataList: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        {
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
        },
        {
          age: 89,
          first_name: 'Geneva',
          last_name:
            'WilsonWilsonWilsonWilsonWilsonWilsonWilsonWilsonWilsonWilson WilsonWilsonWilsonWilson WilsonWilson WilsonWilsonWilson',
        },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ],
      cellDisabledTableDataList: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald', amount: '12312415' },
        {
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
          amount: '333324324',
        },
        {
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
          amount: '3333',
        },
        { age: 11, first_name: 'Jami', last_name: 'Carney', amount: '444412312415' },
        { age: 22, first_name: 'x Jami', last_name: 'Carney', amount: '3333' },
        { age: 33, first_name: 'y Jami', last_name: 'Carney', amount: '666612312415' },
        { age: 44, first_name: 'z Jami', last_name: 'Carney', amount: '777712312415' },
      ],
      comboTableDataList: [
        {
          isActive: false,
          age: 40,
          first_name: 'Dickerson',
          last_name: '1',
          last_names: [
            { name: 'Kennedy', value: '1' },
            { name: 'Shaw', value: '2' },
            { name: 'Wilson', value: '3' },
            { name: 'Carney', value: '4' },
          ],
        },
        {
          isActive: false,
          age: 21,
          first_name: 'Larsen',
          last_name: '2',
          last_names: [
            { name: 'Kennedy', value: '1' },
            { name: 'Shaw', value: '2' },
            { name: 'Wilson', value: '3' },
            { name: 'Carney', value: '4' },
          ],
        },
        {
          isActive: false,
          age: 89,
          first_name: 'Geneva',
          last_name: '3',
          last_names: [
            { name: 'Kennedy', value: '1' },
            { name: 'Shaw', value: '2' },
            { name: 'Wilson', value: '3' },
            { name: 'Carney', value: '4' },
          ],
        },
        {
          isActive: false,
          age: 38,
          first_name: 'Jami',
          last_name: '4',
          last_names: [
            { name: 'Kennedy', value: '1' },
            { name: 'Shaw', value: '2' },
            { name: 'Wilson', value: '3' },
            { name: 'Carney', value: '4' },
          ],
        },
      ],
    };
  },
  actions: {
    async uploadFiles(payload) {
      try {
        const result = await useDefaultFetch('/csm/fileupload', {
          method: 'post',
          body: payload,
        });

        if (result && result.resultCd === '0000') {
          return result.resultData;
        }
      } catch (e) {
        console.warn('e', e);
      }
    },
    saveTempData(payload) {
      Object.assign(this.tempData, payload);
    },
    deleteTempData() {
      this.tempData = {};
    },
    selectRow(payload) {
      this.tableDataList = this.tableDataList.map(v =>
        v.age === payload.age ? { ...v, _rowVariant: 'selected' } : { ...v, _rowVariant: '' },
      );
    },
    addRow() {
      // object 참조 제거
      const copiedTable = JSON.parse(JSON.stringify(this.comboTableDataList));
      const newRow = copiedTable[copiedTable.length - 1];

      newRow.visible = true;
      newRow.isActive = false;
      this.comboTableDataList = [...this.comboTableDataList, newRow];
    },
    removeRow() {
      this.comboTableDataList = this.comboTableDataList.filter(v => !v.isActive);
    },
    hideRow() {
      this.comboTableDataList = this.comboTableDataList.map(v =>
        v.isActive ? { ...v, visible: false } : { ...v, visible: true },
      );
    },
    clearRow() {
      this.comboTableDataList = [];
    },
  },
  getters: {
    // 선택 된 행 반환
    selectedRow(state) {
      return state.tableDataList.filter(v => v._rowVariant === 'selected');
    },
    // Remove, hide
    selectedComboRow(state) {
      return state.comboTableDataList.filter(v => v.isActive);
    },
    // Cell 색상 지정 테스트용
    highlightCell(state) {
      const key = 'age';
      // age key의 값이 40이 넘을 경우
      return state.cellColorTableDataList.map(v =>
        v[key] > 40 ? { ...v, _cellVariants: { [key]: 'warning' } } : { ...v, _cellVariants: { [key]: 'info' } },
      );
    },
    // Cell disable 테스트용
    disableCell(state) {
      const key = 'amount';
      // last_name key의 값이 Wilson인 경우
      return state.cellDisabledTableDataList.map(v =>
        v[key] === '3333' ? { ...v, _cellVariants: { [key]: 'disabled' } } : { ...v },
      );
    },
    // Table row add, remove 테스트용
    addRemoveRows(state) {
      // vislble이 false가 아닌 경우
      return state.comboTableDataList.filter(v => v.visible !== false);
    },
  },
});
