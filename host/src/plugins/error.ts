export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('vue:error', (..._args) => {
    console.error('vue:error', ..._args);
    if (process.client) {
      console.log(..._args);
    }
  });
  nuxtApp.hook('app:error', (..._args) => {
    console.error('app:error', ..._args);
    if (process.client) {
      console.log(..._args);
    }
  });
  nuxtApp.vueApp.config.errorHandler = (..._args) => {
    console.error('global error handler', ..._args);
    if (process.client) {
      console.log(..._args);
    }
  };
});
