/**
 * I18nService - Internationalization service for managing language switching,
 * translation lookup, and text direction detection.
 */

export type Language = 'he' | 'en';
export type TextDirection = 'rtl' | 'ltr';

interface TranslationData {
  [key: string]: string | TranslationData;
}

interface Translations {
  he: TranslationData;
  en: TranslationData;
}

const STORAGE_KEY = 'portfolio_language';

export class I18nService {
  private currentLanguage: Language;
  private translations: Translations;
  private listeners: Set<(language: Language) => void>;

  constructor(defaultLanguage: Language = 'he') {
    this.currentLanguage = this.loadLanguageFromStorage() || defaultLanguage;
    this.translations = { he: {}, en: {} };
    this.listeners = new Set();
  }

  /**
   * Load language preference from localStorage
   */
  private loadLanguageFromStorage(): Language | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'he' || stored === 'en') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load language from localStorage:', error);
    }
    return null;
  }

  /**
   * Save language preference to localStorage
   */
  private saveLanguageToStorage(language: Language): void {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
  }

  /**
   * Set the current language
   */
  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.saveLanguageToStorage(language);
    this.notifyListeners();
  }

  /**
   * Get the current language
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Get text direction for the current language
   */
  getDirection(): TextDirection {
    return this.currentLanguage === 'he' ? 'rtl' : 'ltr';
  }

  /**
   * Load translations for a specific language
   */
  async loadTranslations(language: Language, data: TranslationData): Promise<void> {
    this.translations[language] = data;
  }

  /**
   * Get a translation by key with fallback support
   * Supports nested keys using dot notation (e.g., 'navigation.about')
   */
  translate(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = this.translations['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            // Return key if not found in fallback either
            return key;
          }
        }
        break;
      }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (result, [paramKey, paramValue]) =>
          result.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue),
        value
      );
    }

    return value;
  }

  /**
   * Subscribe to language changes
   */
  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of language change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }
}

// Singleton instance
let instance: I18nService | null = null;

export function getI18nService(): I18nService {
  if (!instance) {
    instance = new I18nService();
  }
  return instance;
}
