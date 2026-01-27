import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration'
import { getI18nService } from './services/I18nService'
import enTranslations from './locales/en.json'
import heTranslations from './locales/he.json'

// Load translations before rendering
async function initializeApp() {
  const i18nService = getI18nService();
  await i18nService.loadTranslations('en', enTranslations);
  await i18nService.loadTranslations('he', heTranslations);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  // Register service worker for content caching
  serviceWorkerRegistration.register({
    onSuccess: () => {
      console.log('Content is cached for offline use.');
    },
    onUpdate: () => {
      console.log('New content is available; please refresh.');
    },
    onError: (error) => {
      console.error('Service worker registration failed:', error);
    },
  });
}

initializeApp();
