/**
 * Unit tests for AboutSection component
 * Requirements: 1.1, 1.2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';
import { getI18nService } from '../services/I18nService';

describe('AboutSection - Unit Tests', () => {
  let i18nService: ReturnType<typeof getI18nService>;

  beforeEach(() => {
    localStorage.clear();
    i18nService = getI18nService();
    i18nService.setLanguage('he');
    
    // Load translations
    i18nService.loadTranslations('en', {
      about: {
        title: 'About Ofra Seri',
        biography: ''
      }
    });
    i18nService.loadTranslations('he', {
      about: {
        title: 'אודות עופרה סרי',
        biography: ''
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Photo Placeholder Rendering', () => {
    it('should render photo placeholder', () => {
      render(<AboutSection />);
      
      const photoPlaceholder = screen.getByRole('img', { name: /photo placeholder/i });
      expect(photoPlaceholder).toBeInTheDocument();
    });

    it('should render photo placeholder with proper structure', () => {
      const { container } = render(<AboutSection />);
      
      const photoPlaceholder = container.querySelector('[role="img"]');
      expect(photoPlaceholder).toBeInTheDocument();
      
      // Check for SVG icon inside placeholder
      const svg = photoPlaceholder?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Biography Text Area Rendering', () => {
    it('should render biography text area', () => {
      const { container } = render(<AboutSection />);
      
      // Biography container should exist
      const biographyContainer = container.querySelector('[class*="biographyContainer"]');
      expect(biographyContainer).toBeInTheDocument();
    });

    it('should display biography text when provided', () => {
      // Set biography content
      i18nService.loadTranslations('en', {
        about: {
          title: 'About Ofra Seri',
          biography: 'This is a test biography.'
        }
      });
      i18nService.setLanguage('en');
      
      render(<AboutSection />);
      
      expect(screen.getByText('This is a test biography.')).toBeInTheDocument();
    });

    it('should display biography in Hebrew when language is Hebrew', () => {
      i18nService.loadTranslations('he', {
        about: {
          title: 'אודות עופרה סרי',
          biography: 'זוהי ביוגרפיה לדוגמה.'
        }
      });
      i18nService.setLanguage('he');
      
      render(<AboutSection />);
      
      expect(screen.getByText('זוהי ביוגרפיה לדוגמה.')).toBeInTheDocument();
    });
  });

  describe('Empty Biography State', () => {
    it('should display placeholder text when biography is empty in Hebrew', () => {
      i18nService.setLanguage('he');
      
      render(<AboutSection />);
      
      expect(screen.getByText('ביוגרפיה תתווסף בקרוב')).toBeInTheDocument();
    });

    it('should display placeholder text when biography is empty in English', () => {
      i18nService.setLanguage('en');
      
      render(<AboutSection />);
      
      expect(screen.getByText('Biography coming soon')).toBeInTheDocument();
    });

    it('should not display biography text when empty', () => {
      const { container } = render(<AboutSection />);
      
      // Empty biography message should be shown instead
      expect(screen.getByText(/coming soon|תתווסף בקרוב/i)).toBeInTheDocument();
    });
  });

  describe('Section Structure', () => {
    it('should render section with proper id', () => {
      const { container } = render(<AboutSection />);
      
      const section = container.querySelector('#about');
      expect(section).toBeInTheDocument();
    });

    it('should render title', () => {
      i18nService.setLanguage('en');
      
      render(<AboutSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('About Ofra Seri');
    });

    it('should render title in Hebrew', () => {
      i18nService.setLanguage('he');
      
      render(<AboutSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('אודות עופרה סרי');
    });
  });

  describe('RTL/LTR Support', () => {
    it('should set dir attribute to rtl for Hebrew', () => {
      i18nService.setLanguage('he');
      
      const { container } = render(<AboutSection />);
      
      const section = container.querySelector('#about');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should set dir attribute to ltr for English', () => {
      i18nService.setLanguage('en');
      
      const { container } = render(<AboutSection />);
      
      const section = container.querySelector('#about');
      expect(section).toHaveAttribute('dir', 'ltr');
    });

    it('should update direction when language changes', () => {
      i18nService.setLanguage('he');
      
      const { container, rerender } = render(<AboutSection />);
      
      let section = container.querySelector('#about');
      expect(section).toHaveAttribute('dir', 'rtl');
      
      // Change language
      i18nService.setLanguage('en');
      rerender(<AboutSection />);
      
      section = container.querySelector('#about');
      expect(section).toHaveAttribute('dir', 'ltr');
    });
  });

  describe('Custom className prop', () => {
    it('should apply custom className when provided', () => {
      const { container } = render(<AboutSection className="custom-class" />);
      
      const section = container.querySelector('#about');
      expect(section?.className).toContain('custom-class');
    });

    it('should work without custom className', () => {
      const { container } = render(<AboutSection />);
      
      const section = container.querySelector('#about');
      expect(section).toBeInTheDocument();
    });
  });
});
