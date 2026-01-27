/**
 * Navigation Component
 * 
 * Provides navigation between pages with active state indication.
 * Supports responsive mobile hamburger menu.
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getI18nService } from '../services/I18nService';
import { useNavigation } from '../context/NavigationContext';
import styles from './Navigation.module.scss';
import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';

export interface NavigationItem {
  id: string;
  labelKey: string;
  path: string;
  index: number;
}

interface NavigationProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'about', labelKey: 'navigation.about', path: '/', index: 0 },
  { id: 'articles', labelKey: 'navigation.articles', path: '/articles', index: 1 },
  { id: 'exhibitions', labelKey: 'navigation.exhibitions', path: '/exhibitions', index: 2 },
  { id: 'studentArt', labelKey: 'navigation.studentArt', path: '/student-artwork', index: 3 },
  { id: 'links', labelKey: 'navigation.links', path: '/links', index: 4 },
];

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const i18nService = getI18nService();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { setDirection } = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load translations
    i18nService.loadTranslations('en', enTranslations);
    i18nService.loadTranslations('he', heTranslations);

    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
    });

    return unsubscribe;
  }, [i18nService]);

  // Update current index when location changes
  useEffect(() => {
    const item = navigationItems.find(item => item.path === location.pathname);
    if (item) {
      setCurrentIndex(item.index);
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (item: NavigationItem) => {
    // Determine direction based on index comparison
    if (item.index > currentIndex) {
      setDirection('forward');
    } else if (item.index < currentIndex) {
      setDirection('backward');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`${styles.navigation} ${className || ''}`} role="navigation" aria-label="Main navigation">
      {/* Mobile hamburger button */}
      <button
        className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        type="button"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Navigation links */}
      <ul className={`${styles.navList} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        {navigationItems.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              onClick={() => handleNavClick(item)}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {i18nService.translate(item.labelKey)}
              <span className={styles.indicator} aria-hidden="true" />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
