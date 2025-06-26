import jquery from 'jquery';
import { Toast } from 'bootstrap';
import bootstrapTable from 'bootstrap-table';
import VueDatePicker from '@vuepic/vue-datepicker';
import VueEasyLightbox from 'vue-easy-lightbox';
import { createVfm } from 'vue-final-modal';

declare global {
  interface Window {
    $: any;
    jQuery: any;
    bootstrapTable: any;
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vfm = createVfm() as any;

  window.$ = jquery;
  window.jQuery = jquery;
  window.bootstrapTable = bootstrapTable;

  nuxtApp.vueApp.use(vfm);
  nuxtApp.vueApp.component('vue-date-picker', VueDatePicker);
  nuxtApp.vueApp.component('vue-easy-lightbox', VueEasyLightbox);
  nuxtApp.provide('global', { sessionInfo: {} });
  nuxtApp.provide('toast', Toast);
});
