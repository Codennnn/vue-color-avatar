import { createI18n } from 'vue-i18n'

import { Locale } from '@/enums'

import { en } from './locales/en'
import { zh } from './locales/zh'

const messages = { en, zh }

const [locale, fallbackLocale] = /^zh\b/.test(window.navigator.language)
  ? [Locale.ZH, Locale.EN]
  : [Locale.EN, Locale.ZH]

export const i18n = createI18n({
  locale,
  fallbackLocale,
  messages,
})
