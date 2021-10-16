import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './styles/reset.css'
import './styles/global.scss'

import { createApp } from 'vue'

import store, { storeKey } from '@/store'

import App from './App.vue'
import i18n from './i18n'

const app = createApp(App)

app.use(store, storeKey)

app.use(i18n)

app.mount('#app')
