/**
 * Property-based tests for ExternalLinks component
 * Feature: portfolio-website
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, cleanup } from '@testing-library/react';
import { ExternalLinks, externalLinks } from './ExternalLinks';
import { getI18nService } from '../services/I18nService';

describe('ExternalLinks - Property-Based Tests', () => {
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
    cleanup();
    localStorage.clear();
  });

  /**
   * Property 5: External Links Target Behavior
   * Validates: Requirements 5.2
   * 
   * For any external link in the links section, clicking on it should 
   * open the URL in a new browser tab (target="_blank").
   */
  it('Property 5: External Links Target Behavior - all links open in new tab with security attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...externalLinks),
        (link) => {
          // Clean up before each iteration
          cleanup();
          
          try {
            const { container } = render(<ExternalLinks />);
            
            // Find the specific link by matching href attribute directly
            const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
              a => a.getAttribute('href') === link.url
            );
            
            // Verify the link exists
            expect(anchorElement).not.toBeNull();
            
            // Verify target="_blank" attribute (Requirement 5.2)
            expect(anchorElement).toHaveAttribute('target', '_blank');
            
            // Verify rel="noopener noreferrer" for security
            expect(anchorElement).toHaveAttribute('rel', 'noopener noreferrer');
            
            // Verify the link has proper ARIA label (Requirement 5.4)
            const ariaLabel = anchorElement?.getAttribute('aria-label');
            expect(ariaLabel).not.toBeNull();
            expect(ariaLabel).toContain(i18nService.translate(link.titleKey));
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: All external links have consistent security attributes
   * 
   * For any external link, it should have both target="_blank" and 
   * rel="noopener noreferrer" to prevent security vulnerabilities.
   */
  it('Property: All external links have consistent security attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('he', 'en'),
        (language) => {
          // Clean up before each iteration
          cleanup();
          
          try {
            i18nService.setLanguage(language);
            const { container } = render(<ExternalLinks />);
            
            // Get all anchor elements
            const allLinks = container.querySelectorAll('a[href]');
            
            // Verify we have exactly 11 links (Requirement 5.1)
            expect(allLinks.length).toBe(11);
            
            // Verify each link has proper security attributes
            allLinks.forEach((link) => {
              expect(link).toHaveAttribute('target', '_blank');
              expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: All external links have proper ARIA labels
   * 
   * For any external link and any language, the link should have an 
   * aria-label that includes the link title and indicates it opens in a new tab.
   */
  it('Property: All external links have proper ARIA labels in both languages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('he', 'en'),
        fc.constantFrom(...externalLinks),
        (language, link) => {
          // Clean up before each iteration
          cleanup();
          
          try {
            i18nService.setLanguage(language);
            const { container } = render(<ExternalLinks />);
            
            // Find the specific link by matching href attribute directly
            const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
              a => a.getAttribute('href') === link.url
            );
            expect(anchorElement).not.toBeNull();
            
            // Get the aria-label
            const ariaLabel = anchorElement?.getAttribute('aria-label');
            expect(ariaLabel).not.toBeNull();
            
            // Verify it contains the translated title
            const linkTitle = i18nService.translate(link.titleKey);
            expect(ariaLabel).toContain(linkTitle);
            
            // Verify it indicates new tab in the appropriate language
            if (language === 'he') {
              expect(ariaLabel).toContain('נפתח בחלון חדש');
            } else {
              expect(ariaLabel).toContain('opens in new tab');
            }
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Link count is always 11
   * 
   * For any rendering of the ExternalLinks component, exactly 11 links 
   * should be displayed (Requirement 5.1).
   */
  it('Property: Exactly 11 external links are always rendered', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('he', 'en'),
        (language) => {
          // Clean up before each iteration
          cleanup();
          
          try {
            i18nService.setLanguage(language);
            const { container } = render(<ExternalLinks />);
            
            // Count all anchor elements
            const allLinks = container.querySelectorAll('a[href]');
            expect(allLinks.length).toBe(11);
            
            // Verify all 11 links from our data are present
            externalLinks.forEach((link) => {
              // Find link by matching href attribute directly
              const anchorElement = Array.from(container.querySelectorAll('a[href]')).find(
                a => a.getAttribute('href') === link.url
              );
              expect(anchorElement).not.toBeNull();
            });
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
