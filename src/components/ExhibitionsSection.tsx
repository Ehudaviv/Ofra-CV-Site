/**
 * ExhibitionsSection Component
 * 
 * Displays exhibition and event photos curated by Ofra Seri.
 * Loads 15 images from the תמונות folder using ContentManager.
 * Renders Gallery component with exhibition images.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { useState, useEffect } from 'react';
import { getI18nService } from '../services/I18nService';
import { getContentManager, GalleryImage } from '../services/ContentManager';
import { Gallery } from './Gallery';
import styles from './ExhibitionsSection.module.scss';

interface ExhibitionsSectionProps {
  className?: string;
}

export const ExhibitionsSection: React.FC<ExhibitionsSectionProps> = ({ className }) => {
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
    // Load exhibition images
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const exhibitionImages = await contentManager.loadExhibitionImages();
        setImages(exhibitionImages);
      } catch (err) {
        console.error('Failed to load exhibition images:', err);
        setError(i18nService.translate('errors.contentLoadFailed') || 'Failed to load exhibition images');
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [contentManager, i18nService]);

  const title = i18nService.translate('exhibitions.title');

  return (
    <section 
      id="exhibitions"
      className={`${styles.exhibitionsSection} ${className || ''}`}
      dir={direction}
      aria-labelledby="exhibitions-title"
    >
      <div className={styles.container}>
        <h2 id="exhibitions-title" className={styles.title}>{title}</h2>
        
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
            <p>{i18nService.translate('exhibitions.noContent') || 'No exhibition images available'}</p>
          </div>
        )}
      </div>
    </section>
  );
};
