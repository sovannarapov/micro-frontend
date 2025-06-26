type TdEntries = { [key: string]: any };

export const useFilterColumn = async (fields, excelTable) => {
  return new Promise((res, rej) => {
    window.setTimeout(() => {
      const fieldsLabel = fields.map(field => field.label);
      const filedsExcluded = fields
        .map((field, index) => ({
          excludeImport: field.excludeImport,
          label: field.label,
          index,
        }))
        .filter(field => field.excludeImport === true)
        .map(field => field.label);
      const excludedFromLabel: number[] = [];
      const excludedFromField: number[] = [];
      const final: { value: number[] } = ref([]);
      const theadRow = excelTable?.value?.querySelector('table tr');
      const theadTds: TdEntries = theadRow.querySelectorAll('td');

      for (const [index, td] of Object.entries(theadTds)) {
        if (!fieldsLabel.includes(td.innerText)) excludedFromLabel.push(parseInt(index));
      }

      for (const [index, td] of Object.entries(theadTds)) {
        if (filedsExcluded.includes(td.innerText)) excludedFromField.push(parseInt(index));
      }

      final.value = [...excludedFromLabel, ...excludedFromField].sort();

      for (const index of final.value) {
        const tobeHidden = excelTable?.value?.querySelectorAll(`table tr td:nth-child(${index + 1})`);

        for (const td of tobeHidden) {
          td.style.display = 'none';
        }
      }

      res(true);
    }, 300);
  });
};
