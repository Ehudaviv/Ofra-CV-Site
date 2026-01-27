/**
 * Accessibility Audit Tests
 * 
 * Uses axe-core to check for WCAG AA compliance violations.
 * Requirements: 7.5, 5.4, 9.5
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AboutSection } from './AboutSection';
import { ExternalLinks } from './ExternalLinks';
import { Gallery } from './Gallery';
import { NavigationProvider } from '../context/NavigationContext';
import type { GalleryImage } from '../services/ContentManager';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Helper to wrap components with Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <NavigationProvider>
        {component}
      </NavigationProvider>
    </BrowserRouter>
  );
};

describe('Accessibility Audit', () => {
  describe('Navigation Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithRouter(<Navigation currentSection="about" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      const { container } = renderWithRouter(<Navigation currentSection="about" />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      expect(nav).toHaveAttribute('role', 'navigation');
    });
  });

  describe('LanguageSwitcher Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<LanguageSwitcher />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA label', () => {
      const { getByRole } = render(<LanguageSwitcher />);
      const button = getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  describe('AboutSection Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<AboutSection />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have semantic HTML', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'about');
      expect(section).toHaveAttribute('aria-labelledby', 'about-title');
    });
  });

  describe('ExternalLinks Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<ExternalLinks />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have semantic HTML', () => {
      const { container } = render(<ExternalLinks />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'links');
      expect(section).toHaveAttribute('aria-labelledby', 'links-title');
    });

    it('should have proper link attributes', () => {
      const { container } = render(<ExternalLinks />);
      const links = container.querySelectorAll('a[target="_blank"]');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Gallery Component', () => {
    const mockImages: GalleryImage[] = [
      {
        id: '1',
        filename: 'test1.jpg',
        thumbnailUrl: '/test1-thumb.jpg',
        fullUrl: '/test1.jpg',
        captionKey: 'test.caption1',
        alt: 'Test image 1',
      },
    ];

    it('should not have accessibility violations', async () => {
      const { container } = render(<Gallery images={mockImages} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels on thumbnails', () => {
      const { getByTestId } = render(<Gallery images={mockImages} />);
      const thumbnail = getByTestId('thumbnail-0');
      expect(thumbnail).toHaveAttribute('aria-label');
    });
  });
});
