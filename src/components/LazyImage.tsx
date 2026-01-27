/**
 * LazyImage Component
 * 
 * Image component with lazy loading support using Intersection Observer.
 * Only loads images when they enter the viewport.
 * Requirements: 10.1, 10.2, 10.3
 */

import { useState, useEffect } from 'react';
import { useLazyLoad } from '../hooks/useLazyLoad';
import styles from './LazyImage.module.scss';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholderClassName?: string;
  errorClassName?: string;
  'data-testid'?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  onLoad,
  onError,
  placeholderClassName,
  errorClassName,
  'data-testid': dataTestId,
}) => {
  const { ref, hasIntersected } = useLazyLoad({ rootMargin: '50px', threshold: 0.01 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Only start loading when the element has intersected the viewport
    if (hasIntersected && !imageSrc) {
      setImageSrc(src);
    }
  }, [hasIntersected, src, imageSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={styles.lazyImageContainer}>
      {isLoading && !hasError && (
        <div 
          className={`${styles.placeholder} ${placeholderClassName || ''}`}
          role="status"
          aria-label="Loading image"
        >
          <div className={styles.placeholderContent}>
            <span className={styles.loadingSpinner}></span>
          </div>
        </div>
      )}

      {hasError && (
        <div 
          className={`${styles.errorPlaceholder} ${errorClassName || ''}`}
          role="img"
          aria-label="Failed to load image"
        >
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠</span>
            <span className={styles.errorText}>Image failed to load</span>
          </div>
        </div>
      )}

      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading ? 'none' : 'block' }}
          data-testid={dataTestId}
        />
      )}
    </div>
  );
};
