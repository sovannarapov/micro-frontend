export const useMergeRow = async options => {
  return new Promise((res, rej) => {
    const flag = ref(false);
    const { id, data, exclude } = options;
    const mappedIndexes = data
      .map((item, key) => {
        if (!exclude.includes(key))
          return {
            index: key,
          };
      })
      .filter(item => item !== undefined);

    window.setTimeout(() => {
      window.$(id).margetable({
        colindex: mappedIndexes,
      });

      flag.value = true;
      res(true);
    }, 100);
  });
};
