/**
 * Unit tests for I18nService
 * Requirements: 6.1, 6.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { I18nService, Language } from './I18nService';

describe('I18nService - Unit Tests', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.clear();
    service = new I18nService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Language Switching', () => {
    it('should initialize with default language (Hebrew)', () => {
      expect(service.getLanguage()).toBe('he');
    });

    it('should switch to English', () => {
      service.setLanguage('en');
      expect(service.getLanguage()).toBe('en');
    });

    it('should switch to Hebrew', () => {
      service.setLanguage('en');
      service.setLanguage('he');
      expect(service.getLanguage()).toBe('he');
    });

    it('should notify listeners when language changes', () => {
      let notifiedLanguage: Language | null = null;
      service.subscribe((lang) => {
        notifiedLanguage = lang;
      });

      service.setLanguage('en');
      expect(notifiedLanguage).toBe('en');
    });

    it('should allow unsubscribing from language changes', () => {
      let callCount = 0;
      const unsubscribe = service.subscribe(() => {
        callCount++;
      });

      service.setLanguage('en');
      expect(callCount).toBe(1);

      unsubscribe();
      service.setLanguage('he');
      expect(callCount).toBe(1); // Should not increment
    });
  });

  describe('Translation Lookup', () => {
    beforeEach(async () => {
      await service.loadTranslations('en', {
        navigation: {
          about: 'About',
          articles: 'Articles'
        },
        greeting: 'Hello {{name}}'
      });

      await service.loadTranslations('he', {
        navigation: {
          about: 'אודות',
          articles: 'מאמרים'
        },
        greeting: 'שלום {{name}}'
      });
    });

    it('should translate simple keys', async () => {
      service.setLanguage('en');
      expect(service.translate('navigation.about')).toBe('About');
    });

    it('should translate nested keys', async () => {
      service.setLanguage('en');
      expect(service.translate('navigation.articles')).toBe('Articles');
    });

    it('should translate in Hebrew', async () => {
      service.setLanguage('he');
      expect(service.translate('navigation.about')).toBe('אודות');
    });

    it('should fallback to English when key not found in current language', async () => {
      await service.loadTranslations('he', {
        navigation: {
          about: 'אודות'
          // Missing 'articles' key
        }
      });

      service.setLanguage('he');
      expect(service.translate('navigation.articles')).toBe('Articles');
    });

    it('should return key when translation not found in any language', () => {
      service.setLanguage('en');
      expect(service.translate('nonexistent.key')).toBe('nonexistent.key');
    });

    it('should replace parameters in translations', () => {
      service.setLanguage('en');
      expect(service.translate('greeting', { name: 'Ofra' })).toBe('Hello Ofra');
    });

    it('should replace parameters in Hebrew translations', () => {
      service.setLanguage('he');
      expect(service.translate('greeting', { name: 'עופרה' })).toBe('שלום עופרה');
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist language selection to localStorage', () => {
      service.setLanguage('en');
      expect(localStorage.getItem('portfolio_language')).toBe('en');
    });

    it('should load language from localStorage on initialization', () => {
      localStorage.setItem('portfolio_language', 'en');
      const newService = new I18nService();
      expect(newService.getLanguage()).toBe('en');
    });

    it('should use default language when localStorage is empty', () => {
      const newService = new I18nService('he');
      expect(newService.getLanguage()).toBe('he');
    });

    it('should ignore invalid values in localStorage', () => {
      localStorage.setItem('portfolio_language', 'invalid');
      const newService = new I18nService('he');
      expect(newService.getLanguage()).toBe('he');
    });

    it('should update localStorage when language changes', () => {
      service.setLanguage('en');
      expect(localStorage.getItem('portfolio_language')).toBe('en');
      
      service.setLanguage('he');
      expect(localStorage.getItem('portfolio_language')).toBe('he');
    });
  });

  describe('Text Direction', () => {
    it('should return RTL for Hebrew', () => {
      service.setLanguage('he');
      expect(service.getDirection()).toBe('rtl');
    });

    it('should return LTR for English', () => {
      service.setLanguage('en');
      expect(service.getDirection()).toBe('ltr');
    });
  });
});
