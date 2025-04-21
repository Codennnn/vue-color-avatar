import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './styles/reset.css'
import './styles/global.scss'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'

const app = createApp(App)

app.use(createPinia())

app.use(i18n)

app.mount('#app')
