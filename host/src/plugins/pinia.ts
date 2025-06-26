import type { PiniaPluginContext } from 'pinia';

const MyPiniaPlugin = ({ store }: PiniaPluginContext) => {
  store.$subscribe(mutation => {
    // console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`);
  });

  return { creationTime: new Date() };
};

export default defineNuxtPlugin(({ $pinia }) => {
  // $pinia.use(MyPiniaPlugin);
});
