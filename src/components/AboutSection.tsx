/**
 * AboutSection Component
 * 
 * Displays Ofra Seri's biography and photo.
 * Supports RTL/LTR text direction based on selected language.
 * Styled with Yemenite-inspired theme.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { useState, useEffect } from 'react';
import { getI18nService } from '../services/I18nService';
import styles from './AboutSection.module.scss';
import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';

interface AboutSectionProps {
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  const i18nService = getI18nService();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [direction, setDirection] = useState(i18nService.getDirection());

  useEffect(() => {
    // Load translations if not already loaded
    i18nService.loadTranslations('en', enTranslations);
    i18nService.loadTranslations('he', heTranslations);

    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
      setDirection(i18nService.getDirection());
    });

    return unsubscribe;
  }, [i18nService]);

  const title = i18nService.translate('about.title');
  const biography = i18nService.translate('about.biography');

  return (
    <section 
      id="about"
      className={`${styles.aboutSection} ${className || ''}`}
      dir={direction}
      aria-labelledby="about-title"
    >
      <div className={styles.container}>
        <h2 id="about-title" className={styles.title}>{title}</h2>
        
        <div className={styles.content}>
          {/* Photo placeholder */}
          <div className={styles.photoContainer}>
            <div className={styles.photoPlaceholder} role="img" aria-label="Ofra Seri photo placeholder">
              <svg 
                className={styles.placeholderIcon}
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Biography text area */}
          <article className={styles.biographyContainer}>
            {biography ? (
              <div className={styles.biography}>
                {biography.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className={styles.emptyBiography}>
                {language === 'he' ? 'ביוגרפיה תתווסף בקרוב' : 'Biography coming soon'}
              </p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};
