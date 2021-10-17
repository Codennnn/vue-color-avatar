import localeEN from '../i18n/locales/en'
import localeZH from '../i18n/locales/zh'
import { highlightJSON } from '../utils'

test('highlightJSON', () => {
  const str = JSON.stringify({ a: 1, b: '2' })
  expect(highlightJSON(str)).toMatch('key')
  expect(highlightJSON(str)).toMatch('number')
  expect(highlightJSON(str)).toMatch('string')
})

test('check locales completeness', () => {
  const zh = Reflect.ownKeys(localeZH).sort()
  const en = Reflect.ownKeys(localeEN).sort()
  expect(zh).toEqual(en)
})
