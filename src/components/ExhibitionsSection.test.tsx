/**
 * Unit tests for ExhibitionsSection component
 * Requirements: 3.1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ExhibitionsSection } from './ExhibitionsSection';
import { getI18nService } from '../services/I18nService';
import { getContentManager, GalleryImage } from '../services/ContentManager';

describe('ExhibitionsSection - Unit Tests', () => {
  let i18nService: ReturnType<typeof getI18nService>;
  let contentManager: ReturnType<typeof getContentManager>;

  beforeEach(() => {
    localStorage.clear();
    i18nService = getI18nService();
    contentManager = getContentManager();
    i18nService.setLanguage('he');
    
    // Load translations
    i18nService.loadTranslations('en', {
      exhibitions: {
        title: 'Exhibitions and Events'
      },
      common: {
        loading: 'Loading...'
      },
      errors: {
        contentLoadFailed: 'Failed to load content'
      }
    });
    i18nService.loadTranslations('he', {
      exhibitions: {
        title: 'תערוכות ואירועים'
      },
      common: {
        loading: 'טוען...'
      },
      errors: {
        contentLoadFailed: 'טעינת התוכן נכשלה'
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
    contentManager.clearCache();
    vi.restoreAllMocks();
  });

  describe('Image Loading', () => {
    it('should load exhibition images', async () => {
      render(<ExhibitionsSection />);
      
      // Wait for images to load
      await waitFor(() => {
        const gallery = screen.queryByTestId('gallery');
        expect(gallery).toBeInTheDocument();
      });
    });

    it('should load exhibition images from folder', async () => {
      const loadSpy = vi.spyOn(contentManager, 'loadExhibitionImages');
      
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        expect(loadSpy).toHaveBeenCalled();
      });
      
      const images = await contentManager.loadExhibitionImages();
      // Verify images are loaded (actual count is 11 from תמונות folder)
      expect(images.length).toBeGreaterThan(0);
      expect(images.length).toBe(11);
    });

    it('should display loading state initially', () => {
      render(<ExhibitionsSection />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/loading|טוען/i)).toBeInTheDocument();
    });

    it('should hide loading state after images load', async () => {
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        // The section loading state should be gone (not the gallery image placeholders)
        expect(screen.queryByText(/loading|טוען/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Gallery Rendering', () => {
    it('should render gallery with images', async () => {
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        const gallery = screen.getByTestId('gallery');
        expect(gallery).toBeInTheDocument();
      });
    });

    it('should render gallery grid', async () => {
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        const grid = screen.getByTestId('gallery-grid');
        expect(grid).toBeInTheDocument();
      });
    });

    it('should pass images to Gallery component', async () => {
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        const gallery = screen.getByTestId('gallery');
        expect(gallery).toBeInTheDocument();
      });
      
      // Gallery should have thumbnails
      const thumbnails = screen.queryAllByTestId(/thumbnail-\d+/);
      expect(thumbnails.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when loading fails', async () => {
      // Mock loadExhibitionImages to throw error
      vi.spyOn(contentManager, 'loadExhibitionImages').mockRejectedValueOnce(
        new Error('Failed to load')
      );
      
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/failed to load|נכשלה/i)).toBeInTheDocument();
      });
    });

    it('should not render gallery when error occurs', async () => {
      vi.spyOn(contentManager, 'loadExhibitionImages').mockRejectedValueOnce(
        new Error('Failed to load')
      );
      
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      expect(screen.queryByTestId('gallery')).not.toBeInTheDocument();
    });
  });

  describe('Section Structure', () => {
    it('should render section with proper id', () => {
      const { container } = render(<ExhibitionsSection />);
      
      const section = container.querySelector('#exhibitions');
      expect(section).toBeInTheDocument();
    });

    it('should render title', () => {
      i18nService.setLanguage('en');
      
      render(<ExhibitionsSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Exhibitions and Events');
    });

    it('should render title in Hebrew', () => {
      i18nService.setLanguage('he');
      
      render(<ExhibitionsSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('תערוכות ואירועים');
    });
  });

  describe('RTL/LTR Support', () => {
    it('should set dir attribute to rtl for Hebrew', () => {
      i18nService.setLanguage('he');
      
      const { container } = render(<ExhibitionsSection />);
      
      const section = container.querySelector('#exhibitions');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should set dir attribute to ltr for English', () => {
      i18nService.setLanguage('en');
      
      const { container } = render(<ExhibitionsSection />);
      
      const section = container.querySelector('#exhibitions');
      expect(section).toHaveAttribute('dir', 'ltr');
    });
  });

  describe('Custom className prop', () => {
    it('should apply custom className when provided', () => {
      const { container } = render(<ExhibitionsSection className="custom-class" />);
      
      const section = container.querySelector('#exhibitions');
      expect(section?.className).toContain('custom-class');
    });

    it('should work without custom className', () => {
      const { container } = render(<ExhibitionsSection />);
      
      const section = container.querySelector('#exhibitions');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no images available', async () => {
      // Mock loadExhibitionImages to return empty array
      vi.spyOn(contentManager, 'loadExhibitionImages').mockResolvedValueOnce([]);
      
      i18nService.loadTranslations('en', {
        exhibitions: {
          title: 'Exhibitions and Events',
          noContent: 'No exhibition images available'
        }
      });
      i18nService.setLanguage('en');
      
      render(<ExhibitionsSection />);
      
      await waitFor(() => {
        expect(screen.getByText('No exhibition images available')).toBeInTheDocument();
      });
    });
  });
});
