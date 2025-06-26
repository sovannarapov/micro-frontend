import { federation } from '@module-federation/vite'
// import federation from '@originjs/vite-plugin-federation' // not support vite4+
import vue from '@vitejs/plugin-vue'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import { resolve } from 'path'
import IconsResolve from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  ssr: false,
  plugins: [
    vue(),
    Components({
      resolvers: [
        BootstrapVueNextResolver({
          importStyle: 'sass',
        }),
        IconsResolve(),
      ],
      dirs: ['src/components', 'src/icons', 'src/views/**/components/*.{vue|tsx}'],
      extensions: ['vue', 'tsx', 'svg'],
      dts: 'src/components.d.ts',
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './pages/App': './src/App.vue',
        './components/CNav': './src/components/CNav.vue',
        './components/RCounter': './src/components/RCounter.vue',
      },
      shared: [
        'vue',
        'vue-router',
        //'pinia'
      ],
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'ProjectName',
          description: 'A single page application created using Vue.js 3',
        },
      },
    }),
  ],
  define: {
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    target: 'esnext',
    // minify: false,
  },
  // optimizeDeps: {
  //   include: ['pinia'],
  // },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~bootstrap': 'bootstrap',
      '~bootstrap-vue': 'bootstrap-vue',
    },
    preserveSymlinks: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/scss/variables" as *;`,
        // https://github.com/twbs/bootstrap/issues/40962#issuecomment-2448214806
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
      },
    },
  },
  // test: {
  //   globals: true,
  //   globalSetup: './tests/vitest.global-setup.js',
  //   setupFiles: ['./tests/vitest.globals.js'],
  //   environment: 'jsdom',
  //   reporters: ['default'],
  //   coverage: {
  //     reporter: ['text', 'json'],
  //   },
  // },
  server: {
    hmr: {
      overlay: false,
    },
    port: 3001,
    open: false,
    https: false,
  },
})
