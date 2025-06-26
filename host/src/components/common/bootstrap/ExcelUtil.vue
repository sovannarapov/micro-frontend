<script setup lang="ts">
  import { writeFileXLSX, read, readFile, utils, writeFile } from 'xlsx-js-style';
  import { useCommonStore } from '@/store/common/';

  interface IClear {
    clear: Boolean;
  }

  const commonStore = useCommonStore();
  const { showLoader, hideLoader } = commonStore;
  const props = defineProps({
    mode: {
      type: String,
      default: () => 'all',
    },
    name: {
      type: String,
      default: () => 'file',
    },
    styledAoAData: {
      type: Array,
      default: () => [],
    },
    mergeOption: {
      type: Array,
      default: () => [],
    },
    targetTable: { type: [Object, String], default: null },
    buttonName: {
      type: String,
      default: () => 'Select File',
    },
    rowRange: {
      type: Object,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['onImport', 'onUpdate']);

  // TODO : type 작성
  const { mode, styledAoAData, mergeOption }: any = props;
  const formFile = ref();
  const wb = utils.book_new();
  const html = ref('');
  const data = ref();
  const keyedData = ref();
  const importedFileName = ref('');
  const exportFileName = computed(() =>
    mode === 'export' && props.buttonName !== 'Select File' ? props.buttonName : 'Export File',
  );
  const worksheetWithStyle = styledAoAData && styledAoAData.length ? utils.aoa_to_sheet(styledAoAData) : null;

  // merge 실행
  if (worksheetWithStyle) worksheetWithStyle['!merges'] = mergeOption;
  if (styledAoAData.length && worksheetWithStyle) {
    const htmlWithStyle = utils.sheet_to_html(worksheetWithStyle);

    emit('onUpdate', { html: htmlWithStyle });
  }

  const exportFile = () => {
    const { name, targetTable } = props;
    const fileName = name || 'file';
    const targetHtmlTable = ref();

    if (typeof targetTable === 'string') targetHtmlTable.value = document.querySelector(`#${targetTable}`);
    if (typeof targetTable !== 'string') targetHtmlTable.value = targetTable;

    // export html table
    if (targetHtmlTable.value) {
      const copied = targetHtmlTable.value.getElementsByTagName('TABLE')[0];
      const tempWrap = document.createElement('div.temp');
      const clone = ref(copied.cloneNode(true));
      const hiddenTds = clone.value.querySelectorAll('.b-table-selection-column');
      const forms = clone.value.querySelectorAll('select, input');

      tempWrap.appendChild(clone.value);

      for (const el of hiddenTds) {
        el.remove();
      }

      for (const el of forms) {
        el.remove();
      }

      const wbhtml = utils.table_to_book(clone.value, { raw: true });
      writeFileXLSX(wbhtml, `${fileName}.xlsx`);
    }

    // export aoa table
    if (styledAoAData.length && worksheetWithStyle) {
      utils.book_append_sheet(wb, worksheetWithStyle, '');

      writeFile(wb, `${fileName}.xlsx`);
    }
  };

  const onChange = event => {
    const file = event?.target?.files ? event.target.files[0] : null;

    if (file) {
      showLoader();

      importedFileName.value = file.name;

      const reader = new FileReader();
      // TODO : type 작성
      reader.onload = (readerEvent: any) => {
        const bstr = readerEvent.target.result;
        const wbs = read(bstr, { type: 'binary' });
        const sheetName = wbs.SheetNames[0];
        const sheetData = wbs.Sheets[sheetName] as any;
        const userRange = props.rowRange;
        const orgRange = utils.decode_range(sheetData['!ref']);

        if (userRange) {
          const { start: startNum, end: endNum } = userRange;
          const start = parseInt(startNum);
          const end = parseInt(endNum);

          if (start < -1 || end > orgRange.e.r) {
            const options = {
              title: 'Error',
              contents: `출력 범위 초과 [시작 : ${orgRange.s.r} 종료 : ${orgRange.e.r}]`,
            };
            useAlert(options);

            data.value = null;
            keyedData.value = null;
            html.value = '';

            formFile.value.clearForm();
            hideLoader();

            return false;
          }

          orgRange.s.r = isNaN(start) ? orgRange.s.r : start;
          orgRange.e.r = isNaN(end) ? orgRange.e.r : end;
        }

        const interim = utils.sheet_to_json(sheetData, { range: orgRange, defval: '' });
        keyedData.value = interim.map((row: any) => {
          Object.keys(row).forEach((h, i) => {
            row[i] = row[h];
            delete row[h];
          });
          return row;
        });

        data.value = utils.sheet_to_json(sheetData, { range: orgRange, defval: '' });
        html.value = utils.sheet_to_html(sheetData);

        emit('onImport', { html: html.value, json: data.value, keyedJson: keyedData.value });

        window.setTimeout(() => {
          data.value = null;
          keyedData.value = null;
          html.value = '';

          formFile.value.clearForm();

          hideLoader();
        }, 300);
      };

      reader.readAsBinaryString(file);
    }
  };

  useEmitListen('excel', param => {
    const { clear } = param as IClear;

    if (clear) importedFileName.value = '';
  });
</script>

<template>
  <div>
    <b-button v-if="mode === 'export'" @click="exportFile" :disabled="isDisabled">{{ exportFileName }}</b-button>
    <b-form-file
      v-if="mode === 'import'"
      ref="formFile"
      @change="onChange"
      :fileName="importedFileName"
      :button-name="buttonName"
      :disabled="isDisabled"
    ></b-form-file>
  </div>
</template>
