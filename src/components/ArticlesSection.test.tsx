/**
 * Unit tests for ArticlesSection component
 * Requirements: 2.2, 2.6
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticlesSection } from './ArticlesSection';
import { getI18nService } from '../services/I18nService';
import { getContentManager } from '../services/ContentManager';

describe('ArticlesSection - Unit Tests', () => {
  let i18nService: ReturnType<typeof getI18nService>;
  let contentManager: ReturnType<typeof getContentManager>;

  beforeEach(() => {
    localStorage.clear();
    i18nService = getI18nService();
    contentManager = getContentManager();
    i18nService.setLanguage('he');
    
    // Load translations
    i18nService.loadTranslations('en', {
      articles: {
        title: 'Academic Articles',
        afya: 'Afya',
        palestinianArt: 'Analysis of Palestinian Art',
        religiousArt: 'Religious Art in the Postmodern Era: From Exclusion to Acceptance',
        yemenitePortrait: 'Yemenite Portrait - Ofra Seri-Romia'
      },
      common: {
        loading: 'Loading...',
        open: 'Open'
      },
      errors: {
        noContent: 'No content available'
      }
    });
    i18nService.loadTranslations('he', {
      articles: {
        title: 'מאמרים אקדמיים',
        afya: 'עפיה',
        palestinianArt: 'ניתוח אמנות פלסטינית',
        religiousArt: 'אמנות דתית בעידן הפוסט-מודרני',
        yemenitePortrait: 'דיוקן תימני'
      },
      common: {
        loading: 'טוען...',
        open: 'פתח'
      },
      errors: {
        noContent: 'אין תוכן זמין'
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
    contentManager.clearCache();
  });

  describe('Article List Display', () => {
    it('should display article list after loading', async () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      // Wait for articles to load
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Check that articles are displayed with full titles
      expect(screen.getByText('Afya: Exploring Yemenite Cultural Identity Through Contemporary Art')).toBeInTheDocument();
      expect(screen.getByText('Contemporary Palestinian Art: Cultural Resistance and Identity Formation')).toBeInTheDocument();
      expect(screen.getByText('Religious Art in the Postmodern Era: From Exclusion to Acceptance')).toBeInTheDocument();
      expect(screen.getByText('The Yemenite Portrait: Tradition, Identity, and Representation in Modern Art')).toBeInTheDocument();
    });

    it('should display exactly 4 articles', async () => {
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText(/טוען|Loading/)).not.toBeInTheDocument();
      });
      
      const articleButtons = screen.getAllByRole('button');
      expect(articleButtons).toHaveLength(4);
    });

    it('should display loading state initially', () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display section title', async () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Academic Articles');
    });
  });

  describe('Article Titles in Both Languages', () => {
    it('should display article titles in English', async () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Afya: Exploring Yemenite Cultural Identity Through Contemporary Art')).toBeInTheDocument();
      expect(screen.getByText('Contemporary Palestinian Art: Cultural Resistance and Identity Formation')).toBeInTheDocument();
      expect(screen.getByText('Religious Art in the Postmodern Era: From Exclusion to Acceptance')).toBeInTheDocument();
      expect(screen.getByText('The Yemenite Portrait: Tradition, Identity, and Representation in Modern Art')).toBeInTheDocument();
    });

    it('should display article titles in Hebrew', async () => {
      i18nService.setLanguage('he');
      
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('טוען...')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('עפיה: חקר הזהות התרבותית התימנית דרך אמנות עכשווית')).toBeInTheDocument();
      expect(screen.getByText('אמנות פלסטינית עכשווית: התנגדות תרבותית ועיצוב זהות')).toBeInTheDocument();
      expect(screen.getByText('אמנות דתית בעידן הפוסט-מודרני: מהדרה לקבלה')).toBeInTheDocument();
      expect(screen.getByText('הדיוקן התימני: מסורת, זהות וייצוג באמנות מודרנית')).toBeInTheDocument();
    });

    it('should update article titles when language changes', async () => {
      i18nService.setLanguage('en');
      
      const { rerender } = render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Afya: Exploring Yemenite Cultural Identity Through Contemporary Art')).toBeInTheDocument();
      
      // Change language
      i18nService.setLanguage('he');
      rerender(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.getByText('עפיה: חקר הזהות התרבותית התימנית דרך אמנות עכשווית')).toBeInTheDocument();
      });
    });

    it('should display section title in Hebrew', async () => {
      i18nService.setLanguage('he');
      
      render(<ArticlesSection />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('מאמרים אקדמיים');
    });
  });

  describe('Article Click Interaction', () => {
    it('should have download buttons for articles', async () => {
      const user = userEvent.setup();
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Check that download buttons exist
      const downloadButtons = screen.getAllByRole('button');
      expect(downloadButtons.length).toBe(4);
      
      // Verify each button has proper aria-label
      downloadButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button.getAttribute('aria-label')).toContain('Download');
      });
    });

    it('should display article summaries', async () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Check that summaries are displayed
      expect(screen.getByText(/This article examines the intersection/)).toBeInTheDocument();
      expect(screen.getByText(/An in-depth scholarly analysis/)).toBeInTheDocument();
      expect(screen.getByText(/This comprehensive study traces/)).toBeInTheDocument();
      expect(screen.getByText(/A scholarly investigation into/)).toBeInTheDocument();
    });

    it('should have proper article card structure', async () => {
      i18nService.setLanguage('en');
      
      const { container } = render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      // Check that article cards exist
      const articleCards = container.querySelectorAll('article');
      expect(articleCards.length).toBe(4);
      
      // Each card should have title, summary, and download button
      articleCards.forEach(card => {
        expect(card.querySelector('h3')).toBeInTheDocument();
        expect(card.querySelector('p')).toBeInTheDocument();
        expect(card.querySelector('button')).toBeInTheDocument();
      });
    });
  });

  describe('Section Structure', () => {
    it('should render section with proper id', async () => {
      const { container } = render(<ArticlesSection />);
      
      const section = container.querySelector('#articles');
      expect(section).toBeInTheDocument();
    });

    it('should have proper ARIA structure', async () => {
      i18nService.setLanguage('en');
      
      render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('RTL/LTR Support', () => {
    it('should set dir attribute to rtl for Hebrew', async () => {
      i18nService.setLanguage('he');
      
      const { container } = render(<ArticlesSection />);
      
      const section = container.querySelector('#articles');
      expect(section).toHaveAttribute('dir', 'rtl');
    });

    it('should set dir attribute to ltr for English', async () => {
      i18nService.setLanguage('en');
      
      const { container } = render(<ArticlesSection />);
      
      const section = container.querySelector('#articles');
      expect(section).toHaveAttribute('dir', 'ltr');
    });

    it('should display Hebrew content in RTL', async () => {
      i18nService.setLanguage('he');
      
      const { container } = render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('טוען...')).not.toBeInTheDocument();
      });
      
      const section = container.querySelector('#articles');
      expect(section).toHaveAttribute('dir', 'rtl');
      
      // Verify Hebrew titles are displayed
      expect(screen.getByText('עפיה: חקר הזהות התרבותית התימנית דרך אמנות עכשווית')).toBeInTheDocument();
    });

    it('should display English content in LTR', async () => {
      i18nService.setLanguage('en');
      
      const { container } = render(<ArticlesSection />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      const section = container.querySelector('#articles');
      expect(section).toHaveAttribute('dir', 'ltr');
      
      // Verify English titles are displayed
      expect(screen.getByText('Afya: Exploring Yemenite Cultural Identity Through Contemporary Art')).toBeInTheDocument();
    });
  });

  describe('Custom className prop', () => {
    it('should apply custom className when provided', async () => {
      const { container } = render(<ArticlesSection className="custom-class" />);
      
      const section = container.querySelector('#articles');
      expect(section?.className).toContain('custom-class');
    });
  });
});
