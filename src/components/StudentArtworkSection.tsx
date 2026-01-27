/**
 * StudentArtworkSection Component
 * 
 * Displays artwork created by students under Ofra Seri's guidance.
 * Loads 16 images from the ציורים בהנחייתי folder using ContentManager.
 * Renders Gallery component with student artwork.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { useState, useEffect } from 'react';
import { getI18nService } from '../services/I18nService';
import { getContentManager, GalleryImage } from '../services/ContentManager';
import { Gallery } from './Gallery';
import styles from './StudentArtworkSection.module.scss';

interface StudentArtworkSectionProps {
  className?: string;
}

export const StudentArtworkSection: React.FC<StudentArtworkSectionProps> = ({ className }) => {
  const i18nService = getI18nService();
  const contentManager = getContentManager();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [direction, setDirection] = useState(i18nService.getDirection());
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
      setDirection(i18nService.getDirection());
    });

    return unsubscribe;
  }, [i18nService]);

  useEffect(() => {
    // Load student artwork images
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const studentArtImages = await contentManager.loadStudentArtImages();
        setImages(studentArtImages);
      } catch (err) {
        console.error('Failed to load student artwork images:', err);
        setError(i18nService.translate('errors.contentLoadFailed') || 'Failed to load student artwork images');
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [contentManager, i18nService]);

  const title = i18nService.translate('studentArt.title');

  return (
    <section 
      id="student-artwork"
      className={`${styles.studentArtworkSection} ${className || ''}`}
      dir={direction}
      aria-labelledby="student-artwork-title"
    >
      <div className={styles.container}>
        <h2 id="student-artwork-title" className={styles.title}>{title}</h2>
        
        {isLoading && (
          <div className={styles.loading} role="status">
            <p>{i18nService.translate('common.loading') || 'Loading...'}</p>
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && images.length > 0 && (
          <Gallery images={images} />
        )}

        {!isLoading && !error && images.length === 0 && (
          <div className={styles.empty}>
            <p>{i18nService.translate('studentArt.noContent') || 'No student artwork available'}</p>
          </div>
        )}
      </div>
    </section>
  );
};
