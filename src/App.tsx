import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Navigation items for swipe navigation
  const navigationPaths = ['/', '/articles', '/exhibitions', '/student-artwork', '/links'];
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  // Touch handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const currentIndex = navigationPaths.indexOf(location.pathname);
    
    if (isLeftSwipe && currentIndex < navigationPaths.length - 1) {
      // Swipe left - go to next page
      navigate(navigationPaths[currentIndex + 1]);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right - go to previous page
      navigate(navigationPaths[currentIndex - 1]);
    }
  };

  return (
    <div 
      className={`app ${getSectionClass()}`} 
      dir={direction} 
      data-language={language}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
