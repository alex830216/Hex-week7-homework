import { createApp } from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

import './assets/all.scss'
import { currency, date } from './methods/filters'
const app = createApp(App)
app.config.globalProperties.$filters = { currency, date }

app.use(VueAxios, axios)

app.use(router)
app.mount('#app')
