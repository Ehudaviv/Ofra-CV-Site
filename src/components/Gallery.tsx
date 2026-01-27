/**
 * Gallery Component
 * 
 * Displays image collections with lightbox functionality.
 * Supports loading placeholders and error fallbacks.
 * Requirements: 3.2, 3.3, 3.4, 3.5, 10.1, 10.2, 10.3
 */

import { useState, useEffect, useCallback } from 'react';
import { getI18nService } from '../services/I18nService';
import { LazyImage } from './LazyImage';
import styles from './Gallery.module.scss';

export interface GalleryImage {
  id: string;
  filename: string;
  thumbnailUrl: string;
  fullUrl: string;
  captionKey: string;
  alt: string;
  width?: number;
  height?: number;
}

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ images, className }) => {
  const i18nService = getI18nService();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
    });

    return unsubscribe;
  }, [i18nService]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleClose, handleNext, handlePrevious]);

  // Initialize loading states for all images
  useEffect(() => {
    const initialLoadingStates: Record<string, boolean> = {};
    images.forEach(image => {
      initialLoadingStates[image.id] = true;
    });
    setLoadingStates(initialLoadingStates);
  }, [images]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, images.length]);

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleImageLoad = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
    setErrorStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleLightboxOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <div className={`${styles.gallery} ${className || ''}`} data-testid="gallery">
      {/* Thumbnail Grid */}
      <div className={styles.grid} data-testid="gallery-grid">
        {images.map((image, index) => (
          <div key={image.id} className={styles.thumbnailWrapper}>
            <button
              className={styles.thumbnail}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View ${image.alt || i18nService.translate(image.captionKey)}`}
              type="button"
              data-testid={`thumbnail-${index}`}
            >
              <LazyImage
                src={image.thumbnailUrl}
                alt={image.alt || i18nService.translate(image.captionKey)}
                className={styles.thumbnailImage}
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
                data-testid={`thumbnail-image-${index}`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedImage && (
        <div
          className={styles.lightbox}
          onClick={handleLightboxOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-caption"
        >
          <div className={styles.lightboxContent}>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label={i18nService.translate('common.close') || 'Close'}
              type="button"
            >
              ×
            </button>

            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              disabled={selectedIndex === 0}
              aria-label={i18nService.translate('common.previous') || 'Previous'}
              type="button"
            >
              ‹
            </button>

            <div className={styles.imageContainer}>
              <img
                src={selectedImage.fullUrl}
                alt={selectedImage.alt || i18nService.translate(selectedImage.captionKey)}
                className={styles.lightboxImage}
              />
              <div id="lightbox-caption" className={styles.caption}>
                {i18nService.translate(selectedImage.captionKey)}
              </div>
            </div>

            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              disabled={selectedIndex === images.length - 1}
              aria-label={i18nService.translate('common.next') || 'Next'}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
