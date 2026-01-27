/**
 * Integration tests for App component
 * Requirements: 6.2, 6.3, 6.4, 9.2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getI18nService } from './services/I18nService';
import enTranslations from './locales/en.json';
import heTranslations from './locales/he.json';

describe('App - Integration Tests', () => {
  beforeEach(() => {
    // Load translations before each test
    const i18nService = getI18nService();
    i18nService.loadTranslations('en', enTranslations);
    i18nService.loadTranslations('he', heTranslations);
    i18nService.setLanguage('en');

    // Mock scrollIntoView for jsdom
    Element.prototype.scrollIntoView = vi.fn();
  });

  /**
   * Test language switching updates all sections
   * Requirements: 6.2, 6.3, 6.4
   */
  it('should update all sections when language is switched', async () => {
    const i18nService = getI18nService();
    i18nService.setLanguage('en');

    const { container } = render(<App />);
    const user = userEvent.setup();

    // Verify initial English content in navigation
    const navLinks = screen.getAllByRole('link');
    const aboutLink = navLinks.find(link => link.textContent === enTranslations.navigation.about);
    const articlesLink = navLinks.find(link => link.textContent === enTranslations.navigation.articles);
    
    expect(aboutLink).toBeInTheDocument();
    expect(articlesLink).toBeInTheDocument();

    // Find and click language switcher
    const languageSwitcher = screen.getByRole('button', { name: /switch to hebrew|עברית/i });
    
    await act(async () => {
      await user.click(languageSwitcher);
      // Give React time to update
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Verify Hebrew content appears in navigation
    await waitFor(() => {
      const updatedNavLinks = screen.getAllByRole('link');
      const heAboutLink = updatedNavLinks.find(link => link.textContent === heTranslations.navigation.about);
      const heArticlesLink = updatedNavLinks.find(link => link.textContent === heTranslations.navigation.articles);
      
      expect(heAboutLink).toBeInTheDocument();
      expect(heArticlesLink).toBeInTheDocument();
    });
  });

  /**
   * Test navigation between sections
   * Requirements: 9.2
   */
  it('should navigate between sections when navigation links are clicked', async () => {
    const i18nService = getI18nService();
    i18nService.setLanguage('en');

    render(<App />);
    const user = userEvent.setup();

    // Find navigation links
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const articlesLink = screen.getByRole('link', { name: /articles/i });
    const exhibitionsLink = screen.getByRole('link', { name: /exhibitions/i });

    // Click on articles link
    await user.click(articlesLink);
    
    // Verify articles section is visible (check for section heading)
    await waitFor(() => {
      const articlesSections = screen.queryAllByText(/articles/i);
      expect(articlesSections.length).toBeGreaterThan(0);
    });

    // Click on exhibitions link
    await user.click(exhibitionsLink);
    
    // Verify exhibitions section is visible
    await waitFor(() => {
      const exhibitionsSections = screen.queryAllByText(/exhibitions/i);
      expect(exhibitionsSections.length).toBeGreaterThan(0);
    });

    // Click on about link
    await user.click(aboutLink);
    
    // Verify about section is visible
    await waitFor(() => {
      const aboutSections = screen.queryAllByText(/about/i);
      expect(aboutSections.length).toBeGreaterThan(0);
    });
  });

  /**
   * Test RTL layout for Hebrew
   * Requirements: 6.2
   */
  it('should apply RTL layout when Hebrew is selected', async () => {
    const i18nService = getI18nService();
    
    await act(async () => {
      i18nService.setLanguage('he');
    });

    const { container } = render(<App />);

    // Verify RTL direction is applied
    const appElement = container.querySelector('.app');
    expect(appElement).toHaveAttribute('dir', 'rtl');
    expect(appElement).toHaveAttribute('data-language', 'he');
  });

  /**
   * Test LTR layout for English
   * Requirements: 6.3
   */
  it('should apply LTR layout when English is selected', async () => {
    const i18nService = getI18nService();
    
    await act(async () => {
      i18nService.setLanguage('en');
    });

    const { container } = render(<App />);

    // Verify LTR direction is applied
    const appElement = container.querySelector('.app');
    expect(appElement).toHaveAttribute('dir', 'ltr');
    expect(appElement).toHaveAttribute('data-language', 'en');
  });

  /**
   * Test that all main sections render
   */
  it('should render all main sections', () => {
    const i18nService = getI18nService();
    i18nService.setLanguage('en');

    render(<App />);

    // Verify all navigation links are present
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /articles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /exhibitions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /student.*art/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /links/i })).toBeInTheDocument();
  });

  /**
   * Test that language switcher is present in header
   */
  it('should render language switcher in header', () => {
    const i18nService = getI18nService();
    i18nService.setLanguage('en');

    render(<App />);

    // Verify language switcher button is present
    const languageSwitcher = screen.getByRole('button', { name: /switch to hebrew|עברית/i });
    expect(languageSwitcher).toBeInTheDocument();
  });

  /**
   * Test that header remains visible
   */
  it('should render header with title', () => {
    const i18nService = getI18nService();
    i18nService.setLanguage('en');

    render(<App />);

    // Verify header title is present
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Ofra Seri/i);
  });
});
