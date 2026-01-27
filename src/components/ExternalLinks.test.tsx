/**
 * Unit tests for ExternalLinks component
 * Requirements: 5.1, 5.2, 5.4, 5.3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExternalLinks, externalLinks } from './ExternalLinks';
import { getI18nService } from '../services/I18nService';

describe('ExternalLinks - Unit Tests', () => {
  let i18nService: ReturnType<typeof getI18nService>;

  beforeEach(() => {
    localStorage.clear();
    i18nService = getI18nService();
    i18nService.setLanguage('he');
    
    // Load translations
    i18nService.loadTranslations('en', require('../locales/en.json'));
    i18nService.loadTranslations('he', require('../locales/he.json'));
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Link Count - Requirement 5.1', () => {
    it('should render exactly 11 links', () => {
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      expect(links.length).toBe(11);
    });

    it('should render all 11 links from externalLinks data', () => {
      const { container } = render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        // Use CSS.escape to handle special characters in URLs
        const escapedUrl = CSS.escape(link.url);
        const anchorElement = container.querySelector(`a[href="${link.url}"]`) || 
                             Array.from(container.querySelectorAll('a[href]')).find(
                               a => a.getAttribute('href') === link.url
                             );
        expect(anchorElement).not.toBeNull();
      });
    });

    it('should render 11 article cards', () => {
      const { container } = render(<ExternalLinks />);
      
      const articleCards = container.querySelectorAll('article');
      expect(articleCards.length).toBe(11);
    });
  });

  describe('Target Attribute - Requirement 5.2', () => {
    it('should have target="_blank" on all links', () => {
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    it('should have rel="noopener noreferrer" on all links for security', () => {
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should open each specific link in new tab', () => {
      const { container } = render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        // Find link by matching href attribute directly
        const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
          a => a.getAttribute('href') === link.url
        );
        expect(anchorElement).not.toBeNull();
        expect(anchorElement).toHaveAttribute('target', '_blank');
      });
    });
  });

  describe('ARIA Labels - Requirement 5.4', () => {
    it('should have proper ARIA labels on all links', () => {
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).not.toBe('');
      });
    });

    it('should include link title in ARIA label in Hebrew', () => {
      i18nService.setLanguage('he');
      const { container } = render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        // Find link by matching href attribute directly
        const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
          a => a.getAttribute('href') === link.url
        );
        const ariaLabel = anchorElement?.getAttribute('aria-label');
        const linkTitle = i18nService.translate(link.titleKey);
        
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel).toContain(linkTitle);
      });
    });

    it('should include link title in ARIA label in English', () => {
      i18nService.setLanguage('en');
      const { container } = render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        // Find link by matching href attribute directly
        const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
          a => a.getAttribute('href') === link.url
        );
        const ariaLabel = anchorElement?.getAttribute('aria-label');
        const linkTitle = i18nService.translate(link.titleKey);
        
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel).toContain(linkTitle);
      });
    });

    it('should indicate new tab in ARIA label in Hebrew', () => {
      i18nService.setLanguage('he');
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toContain('נפתח בחלון חדש');
      });
    });

    it('should indicate new tab in ARIA label in English', () => {
      i18nService.setLanguage('en');
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toContain('opens in new tab');
      });
    });
  });

  describe('Link Titles in Both Languages - Requirement 5.3', () => {
    it('should display link titles in Hebrew', () => {
      i18nService.setLanguage('he');
      render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        const linkTitle = i18nService.translate(link.titleKey);
        expect(screen.getByText(linkTitle)).toBeInTheDocument();
      });
    });

    it('should display link titles in English', () => {
      i18nService.setLanguage('en');
      render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        const linkTitle = i18nService.translate(link.titleKey);
        expect(screen.getByText(linkTitle)).toBeInTheDocument();
      });
    });

    it('should update link titles when language changes', () => {
      i18nService.setLanguage('he');
      const { rerender } = render(<ExternalLinks />);
      
      const hebrewTitle = i18nService.translate('links.link1.title');
      expect(screen.getByText(hebrewTitle)).toBeInTheDocument();
      
      // Change language
      i18nService.setLanguage('en');
      rerender(<ExternalLinks />);
      
      const englishTitle = i18nService.translate('links.link1.title');
      expect(screen.getByText(englishTitle)).toBeInTheDocument();
    });
  });

  describe('Section Structure', () => {
    it('should render section with proper id', () => {
      const { container } = render(<ExternalLinks />);
      
      const section = container.querySelector('#links');
      expect(section).toBeInTheDocument();
    });

    it('should render section title in Hebrew', () => {
      i18nService.setLanguage('he');
      render(<ExternalLinks />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('קישורים חיצוניים');
    });

    it('should render section title in English', () => {
      i18nService.setLanguage('en');
      render(<ExternalLinks />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('External Links');
    });

    it('should render article cards structure', () => {
      const { container } = render(<ExternalLinks />);
      
      const linksList = container.querySelector('[class*="linksList"]');
      expect(linksList).toBeInTheDocument();
    });
  });

  describe('RTL/LTR Support', () => {
    it('should set dir attribute to rtl for Hebrew', () => {
      i18nService.setLanguage('he');
      const { container } = render(<ExternalLinks />);
      
      const section = container.querySelector('#links');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should set dir attribute to ltr for English', () => {
      i18nService.setLanguage('en');
      const { container } = render(<ExternalLinks />);
      
      const section = container.querySelector('#links');
      expect(section).toHaveAttribute('dir', 'ltr');
    });

    it('should update direction when language changes', () => {
      i18nService.setLanguage('he');
      const { container, rerender } = render(<ExternalLinks />);
      
      let section = container.querySelector('#links');
      expect(section).toHaveAttribute('dir', 'rtl');
      
      // Change language
      i18nService.setLanguage('en');
      rerender(<ExternalLinks />);
      
      section = container.querySelector('#links');
      expect(section).toHaveAttribute('dir', 'ltr');
    });
  });

  describe('External Icon', () => {
    it('should render external icon for each link', () => {
      const { container } = render(<ExternalLinks />);
      
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBe(11);
    });

    it('should have aria-hidden on external icons', () => {
      const { container } = render(<ExternalLinks />);
      
      const icons = container.querySelectorAll('svg');
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Custom className prop', () => {
    it('should apply custom className when provided', () => {
      const { container } = render(<ExternalLinks className="custom-class" />);
      
      const section = container.querySelector('#links');
      expect(section?.className).toContain('custom-class');
    });

    it('should work without custom className', () => {
      const { container } = render(<ExternalLinks />);
      
      const section = container.querySelector('#links');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Link URLs', () => {
    it('should have correct href attributes', () => {
      const { container } = render(<ExternalLinks />);
      
      externalLinks.forEach((link) => {
        // Find link by matching href attribute directly
        const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
          a => a.getAttribute('href') === link.url
        );
        expect(anchorElement).not.toBeNull();
        expect(anchorElement).toHaveAttribute('href', link.url);
      });
    });

    it('should have unique URLs for each link', () => {
      const { container } = render(<ExternalLinks />);
      
      const links = container.querySelectorAll('a[href]');
      const urls = Array.from(links).map(link => link.getAttribute('href'));
      const uniqueUrls = new Set(urls);
      
      expect(uniqueUrls.size).toBe(11);
    });
  });
});
