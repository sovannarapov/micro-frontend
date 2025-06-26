// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../src/scss/app.scss'
import { createBootstrap } from 'bootstrap-vue-next'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Default from './layouts/default/Default.vue'
import { router } from './router'

const app = createApp(App)

app.component('LayoutDefault', Default)
app.use(createBootstrap())
app.use(createPinia())
app.use(router)

app.mount('#app')
