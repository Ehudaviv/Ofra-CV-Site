/**
 * Property-based tests for I18nService
 * Feature: portfolio-website
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { I18nService, Language } from './I18nService';

describe('I18nService - Property-Based Tests', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.clear();
    service = new I18nService();
  });

  /**
   * Property 1: Language-Direction Mapping
   * Validates: Requirements 1.4, 1.5
   * 
   * For any language selection, when Hebrew is selected the text direction 
   * should be RTL, and when English is selected the text direction should be LTR.
   */
  it('Property 1: Language-Direction Mapping - Hebrew maps to RTL, English maps to LTR', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Language>('he', 'en'),
        (language) => {
          service.setLanguage(language);
          const direction = service.getDirection();
          
          if (language === 'he') {
            expect(direction).toBe('rtl');
          } else {
            expect(direction).toBe('ltr');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
