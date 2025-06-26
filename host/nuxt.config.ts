import { defineNuxtConfig } from 'nuxt/config';

import { fileURLToPath } from 'url';
import path from 'path';
// import { federation } from '@module-federation/vite'; // Not working
import federation from '@originjs/vite-plugin-federation';
import customRoutes from './src/configs/routes';
import progress from 'vite-plugin-progress';

// import i18nConfig from './src/configs/i18n';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=100, initial-scale=1',
      title: `KB PRASAC - Host ${process.env.ENV !== 'PRD' ? `(${process.env.ENV})` : ''}`,
      meta: [
        { 'http-equiv': 'Cache-Control', content: 'no-cache,no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        { rel: 'stylesheet', type: 'text/css', href: '/css/jquery-ui.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/css/ui.dynatree.css' },
      ],
      script: [
        { src: '/js/jquery.table.merge.js', type: 'text/javascript', defer: true, tagPosition: 'bodyClose' },
        { src: '/js/gstatic.com_charts_loader.js', type: 'text/javascript', async: true },
      ],
    },
    rootId: 'kbp',
  },
  sourcemap: {
    server: false,
    client: false,
  },
  alias: {
    '~images': fileURLToPath(new URL('/public/images', import.meta.url)),
    '~assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
  },
  build: {
    transpile: [],
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    // 'bootstrap-table/dist/bootstrap-table.css',
    'vue-final-modal/style.css',
    '@vuepic/vue-datepicker/dist/main.css',
    '/assets/css/bootstrap.css',
    '/assets/css/style.css',
  ],
  components: [
    { path: '~/components/common/bootstrap', prefix: 'B' },
    { path: '~/components/common', prefix: 'Common' },
    { path: '~/components/common/business', prefix: 'Business' },
    '~/components',
  ],
  imports: {
    dirs: ['stores'],
  },
  debug: false,
  ignore: process.env.ENV !== 'LOCAL' ? ['src/pages/template'] : [],
  // https://nitro.unjs.io/guide/community/contributing
  nitro: {
    rootDir: 'src/',
    devServer: {
      watch: [],
    },
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
    },
    noPublicDir: false,
    output: {
      dir: path.join(__dirname, 'dist'),
      serverDir: path.join(__dirname, 'dist'),
      publicDir: path.join(__dirname, 'dist'),
    },
    rollupConfig: {
      // https://rollupjs.org/configuration-options/
      onwarn({ code, message }) {
        if (code?.includes('CIRCULAR_DEPENDENCY') || code?.includes('CYCLIC_CROSS_CHUNK_REEXPORT')) {
          return;
        }
        console.warn(`${message}`);
      },
    },
  },
  dir: { public: 'public' },
  vite: {
    build: {
      target: 'esnext',
      minify: false,
    },
    esbuild: {
      drop: process.env.ENV === 'PRD' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      exclude: [],
      include: [],
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/'),
      },
    },
    server: {
      hmr: {
        port: 2000,
        protocol: 'ws',
      },
      watch: {
        usePolling: true,
      },
      proxy: {
        '/backend': {
          target: process.env.API_URL_DEFAULT,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env.DEBUG': false,
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    plugins: [
      progress({
        format: 'building [:bar] :percent',
        total: 200,
        width: 60,
        complete: '=',
        incomplete: '',
      }),
      federation({
        name: 'host_app',
        remotes: {
          remote_app: 'http://localhost:3001/remoteEntry.js',
          // remote_app: 'http://localhost:4173/remoteEntry.js',
        },
      }),
    ],
  },
  router: {
    options: {},
  },
  hooks: {
    'pages:extend'(routes) {
      customRoutes(routes);
    },
  },

  modules: [
    ['@bootstrap-vue-next/nuxt', {}],
    // [
    //   '@nuxtjs/i18n',
    //   {
    //     vueI18nLoader: true,
    //     defaultLocale: 'en',
    //     vueI18n: i18nConfig,
    //   },
    // ],
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', ['defineStore', 'definePiniaStore'], 'acceptHMRUpdate'],
      },
    ],
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {});
    },
  ],
  plugins: [],
  runtimeConfig: {
    public: {
      TITLE: 'Host',
      ENV: process.env.ENV,
      API_URL_TEST: process.env.API_URL_TEST,
      API_URL_DEFAULT: process.env.API_URL_DEFAULT,
      SSO_URL: process.env.SSO_URL,
      SSO_REDIRECT_URL: process.env.SSO_REDIRECT_URL,
      SSO_KEY: process.env.SSO_KEY,
      SSO_CLIENT: process.env.SSO_CLIENT,
    },
  },
  routeRules: {},
  srcDir: 'src/',
  generate: {},
  telemetry: false,
  typescript: {
    shim: false,
    // typeCheck: true,
  },
  experimental: {
    payloadExtraction: false,
  },
  devServer: {
    port: 3000,
  },
});
