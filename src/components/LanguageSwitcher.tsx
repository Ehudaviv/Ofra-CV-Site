/**
 * LanguageSwitcher Component
 * 
 * Provides a toggle button to switch between Hebrew and English languages.
 * Connected to I18nService for language state management.
 * Styled with Yemenite-inspired theme colors.
 */

import { useState, useEffect } from 'react';
import { getI18nService, Language } from '../services/I18nService';
import styles from './LanguageSwitcher.module.scss';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const i18nService = getI18nService();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18nService.getLanguage());

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((language) => {
      setCurrentLanguage(language);
    });

    return unsubscribe;
  }, [i18nService]);

  const handleToggle = () => {
    const newLanguage: Language = currentLanguage === 'he' ? 'en' : 'he';
    i18nService.setLanguage(newLanguage);
  };

  return (
    <button
      className={`${styles.languageSwitcher} ${className || ''}`}
      onClick={handleToggle}
      aria-label={`Switch to ${currentLanguage === 'he' ? 'English' : 'Hebrew'}`}
      type="button"
      data-active-language={currentLanguage}
    >
      <span className={`${styles.option} ${currentLanguage === 'en' ? styles.active : ''}`}>
        EN
      </span>
      <span className={styles.separator}>|</span>
      <span className={`${styles.option} ${currentLanguage === 'he' ? styles.active : ''}`}>
        עב
      </span>
    </button>
  );
};
