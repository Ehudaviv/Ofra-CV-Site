import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.scss';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Navigation } from './components/Navigation';
import { AboutPage } from './pages/AboutPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ExhibitionsPage } from './pages/ExhibitionsPage';
import { StudentArtworkPage } from './pages/StudentArtworkPage';
import { LinksPage } from './pages/LinksPage';
import { getI18nService } from './services/I18nService';
import { NavigationProvider } from './context/NavigationContext';

function AppContent() {
  const i18nService = getI18nService();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const location = useLocation();

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
    });

    return unsubscribe;
  }, [i18nService]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const direction = language === 'he' ? 'rtl' : 'ltr';
  
  // Get section-specific class based on current route
  const getSectionClass = () => {
    const path = location.pathname;
    if (path === '/' || path === '') {
      return 'section-about';
    } else if (path.includes('/articles')) {
      return 'section-articles';
    } else if (path.includes('/exhibitions')) {
      return 'section-exhibitions';
    } else if (path.includes('/student-artwork')) {
      return 'section-student-artwork';
    } else if (path.includes('/links')) {
      return 'section-links';
    }
    return 'section-about';
  };

  return (
    <div className={`app ${getSectionClass()}`} dir={direction} data-language={language}>
      <header className="app-header">
        <LanguageSwitcher />
        <h1>{i18nService.translate('header.title')}</h1>
      </header>

      <Navigation />

      <main id="main-content" className="app-content">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
            <Route path="/student-artwork" element={<StudentArtworkPage />} />
            <Route path="/links" element={<LinksPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </BrowserRouter>
  );
}

export default App;
