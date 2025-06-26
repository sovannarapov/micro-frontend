export const useFixedColumn = (field, tid, pos?) => {
  watch(
    () => field,
    data => {
      window.setTimeout(() => {
        const isComplex = document.querySelector<any>(`#${tid}`)?.parentNode.classList.contains('complex-head');
        const tgtTrs = document.querySelectorAll(`#${tid} ${isComplex ? 'tbody' : 'thead'} tr`);
        const locs = ref<number[]>([]);
        const newLocs = ref<number[]>([]);

        // TODO : type 작성
        // fix 시킬 column의 너비 저장
        for (const [trkey, tr] of Object.entries(tgtTrs)) {
          const tgtThs = tr.querySelectorAll<any>(`${isComplex ? 'td' : 'th'}.b-table-sticky-column`);

          for (const [thkey, td] of Object.entries(tgtThs)) {
            locs.value.push(tgtThs[thkey].offsetWidth);
          }
        }

        if (pos === 'right') locs.value.reverse();

        // fix 시킬 column들의 위치 계산
        for (let i = 0; i < locs.value.length - 1; i++) {
          if (i === 0) newLocs.value.push(0);
          newLocs.value.push(newLocs.value[i] + locs.value[i]);
        }

        if (pos === 'right') newLocs.value.reverse();

        if (isComplex) {
          const firstHeadTR = document.querySelector<any>(`#${tid} thead tr:nth-child(1)`);
          const hasEmptyTH = firstHeadTR
            .querySelector('th:nth-child(1)')
            .classList.contains('b-table-selection-column');

          if (!hasEmptyTH) {
            const t = document.createElement('th');

            t.classList.add('b-table-selection-column');
            firstHeadTR.prepend(t);
          }
        }

        const tgtUpdatedTrs = document.querySelectorAll(`#${tid} tr`);

        for (const [trkey, tr] of Object.entries(tgtUpdatedTrs)) {
          const tgtThs = tr.querySelectorAll<any>('th.b-table-sticky-column');
          const tgtTds = tr.querySelectorAll<any>('td.b-table-sticky-column');

          const tgtThsTop = document.querySelectorAll<any>(`#${tid} thead tr:nth-child(1) th`);

          for (const [thkey, th] of Object.entries(tgtThs)) {
            const newPos = newLocs.value[parseInt(thkey)] + 'px';

            if (isComplex) {
              tgtThsTop[parseInt(thkey) + 1].classList.add('b-table-sticky-column');
              tgtThsTop[parseInt(thkey) + 1].style[pos] = newPos;
            }
            th.style[pos] = newPos;
          }
          for (const [tdkey, td] of Object.entries(tgtTds)) {
            td.style[pos] = newLocs.value[parseInt(tdkey)] + 'px';
          }
        }
      }, 300);
    },
    { deep: true, immediate: true },
  );
};
