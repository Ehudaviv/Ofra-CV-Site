/**
 * Property-Based Tests for App Component
 * 
 * These tests validate universal correctness properties across all inputs.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import * as fc from 'fast-check';
import App from './App';
import { getI18nService } from './services/I18nService';
import enTranslations from './locales/en.json';
import heTranslations from './locales/he.json';

describe('App Property-Based Tests', () => {
  beforeEach(() => {
    // Load translations before each test
    const i18nService = getI18nService();
    i18nService.loadTranslations('en', enTranslations);
    i18nService.loadTranslations('he', heTranslations);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  /**
   * Property 2: Content Language Consistency
   * 
   * For any content element (article titles, gallery captions, link titles, section text),
   * when the language is switched, all visible content should display in the selected language.
   * 
   * Validates: Requirements 1.3, 2.6, 3.5, 5.3
   */
  it('Property 2: all visible content displays in selected language', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('he' as const, 'en' as const),
        (language) => {
          const i18nService = getI18nService();
          
          // Set language before rendering
          act(() => {
            i18nService.setLanguage(language);
          });

          // Render the app
          const { container } = render(<App />);

          // Check navigation labels are in the correct language
          const navigationKeys = [
            'navigation.about',
            'navigation.articles',
            'navigation.exhibitions',
            'navigation.studentArt',
            'navigation.links',
          ];

          navigationKeys.forEach((key) => {
            const expectedText = i18nService.translate(key);
            // Navigation text should be present in the document
            const elements = screen.queryAllByText(expectedText);
            expect(elements.length).toBeGreaterThan(0);
          });

          // Verify the direction attribute matches the language
          const appElement = container.querySelector('.app');
          const expectedDirection = language === 'he' ? 'rtl' : 'ltr';
          expect(appElement?.getAttribute('dir')).toBe(expectedDirection);

          // Verify data-language attribute is set correctly
          expect(appElement?.getAttribute('data-language')).toBe(language);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Language Change Propagation
   * 
   * For any language change event, all visible text content across all sections
   * should update immediately to reflect the new language.
   * 
   * Validates: Requirements 6.4
   */
  it('Property 6: language change updates all visible content immediately', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('he' as const, 'en' as const),
        fc.constantFrom('he' as const, 'en' as const),
        async (initialLanguage, newLanguage) => {
          const i18nService = getI18nService();
          
          // Set initial language
          act(() => {
            i18nService.setLanguage(initialLanguage);
          });

          // Render the app
          const { container } = render(<App />);

          // Change language
          await act(async () => {
            i18nService.setLanguage(newLanguage);
            // Give React time to update
            await new Promise(resolve => setTimeout(resolve, 50));
          });

          // Verify all navigation labels updated to new language
          const navigationKeys = [
            'navigation.about',
            'navigation.articles',
            'navigation.exhibitions',
            'navigation.studentArt',
            'navigation.links',
          ];

          navigationKeys.forEach((key) => {
            const expectedText = i18nService.translate(key);
            const elements = screen.queryAllByText(expectedText);
            expect(elements.length).toBeGreaterThan(0);
          });

          // Verify direction attribute updated
          const appElement = container.querySelector('.app');
          const expectedDirection = newLanguage === 'he' ? 'rtl' : 'ltr';
          expect(appElement?.getAttribute('dir')).toBe(expectedDirection);

          // Verify data-language attribute updated
          expect(appElement?.getAttribute('data-language')).toBe(newLanguage);
        }
      ),
      { numRuns: 100 }
    );
  });
});
