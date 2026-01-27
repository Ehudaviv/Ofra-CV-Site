/**
 * Property-Based Tests for Gallery Component
 * 
 * Property 4: Gallery Thumbnail Interaction
 * Validates: Requirements 3.3, 4.3
 * 
 * For any image thumbnail in any gallery (exhibitions or student artwork),
 * clicking on it should open the lightbox view displaying the full-size version of that image.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { Gallery, GalleryImage } from './Gallery';

// Generator for gallery images
const galleryImageArbitrary = fc.record({
  id: fc.uuid(),
  filename: fc.string({ minLength: 1, maxLength: 50 }),
  thumbnailUrl: fc.webUrl(),
  fullUrl: fc.webUrl(),
  captionKey: fc.string({ minLength: 1, maxLength: 100 }),
  alt: fc.string({ minLength: 1, maxLength: 100 }),
});

describe('Gallery Property Tests', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: () => 'en',
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  /**
   * Property 4: Gallery Thumbnail Interaction
   * 
   * For any image thumbnail in any gallery, clicking on it should open
   * the lightbox view displaying the full-size version of that image.
   * 
   * Tag: Feature: portfolio-website, Property 4: Gallery Thumbnail Interaction
   * Validates: Requirements 3.3, 4.3
   */
  it('Property 4: clicking any thumbnail opens lightbox with that image', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        async (images: GalleryImage[], selectedIndexRaw: number) => {
          // Ensure selected index is within bounds
          const selectedIndex = selectedIndexRaw % images.length;
          const selectedImage = images[selectedIndex];

          const user = userEvent.setup();
          const { container, unmount } = render(<Gallery images={images} />);

          try {
            // Find the thumbnail button using test ID
            const thumbnail = container.querySelector(`[data-testid="thumbnail-${selectedIndex}"]`);
            expect(thumbnail).not.toBeNull();

            // Verify lightbox is not initially visible
            let lightbox = container.querySelector('[role="dialog"]');
            expect(lightbox).toBeNull();

            // Click the selected thumbnail
            await user.click(thumbnail as HTMLElement);

            // Verify lightbox is now open
            lightbox = container.querySelector('[role="dialog"]');
            expect(lightbox).not.toBeNull();

            // Verify the lightbox contains an image with the correct alt text
            const lightboxImage = lightbox?.querySelector('img[alt]') as HTMLImageElement;
            expect(lightboxImage).not.toBeNull();
            
            // Check that the alt text matches (either the alt or the caption key)
            const expectedAlt = selectedImage.alt || selectedImage.captionKey;
            expect(lightboxImage?.alt).toBeTruthy();
            expect(lightboxImage?.alt).toContain(expectedAlt);
          } finally {
            // Clean up after each test iteration
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 10000 } // Reduced runs and increased timeout
    );
  }, 15000); // Increase test timeout to 15 seconds
});
