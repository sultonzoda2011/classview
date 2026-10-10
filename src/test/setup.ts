import '@testing-library/jest-dom/vitest'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../../public/locales/en/translation.json'
import ru from '../../public/locales/ru/translation.json'
import tj from '../../public/locales/tj/translation.json'

// В тестах используем реальные файлы переводов напрямую (без HTTP-backend, которого нет в jsdom).
i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru', 'tj'],
  resources: { en: { translation: en }, ru: { translation: ru }, tj: { translation: tj } },
  interpolation: { escapeValue: false },
})
