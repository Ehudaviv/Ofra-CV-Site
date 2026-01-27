/**
 * Property-based tests for Typography Consistency
 * Feature: portfolio-website
 * 
 * Property 7: Typography Consistency
 * Validates: Requirements 7.3
 * 
 * For any two text elements of the same type (e.g., all headings, all body text),
 * they should use the same font family and styling configuration.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// Import theme styles to ensure CSS custom properties are available
import '../styles/index.scss';

describe('Typography Consistency - Property-Based Tests', () => {
  beforeEach(() => {
    // Ensure clean DOM for each test
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Helper function to get computed styles for an element
   */
  const getTypographyStyles = (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    return {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
      letterSpacing: styles.letterSpacing,
    };
  };

  /**
   * Helper function to normalize font family strings for comparison
   * Different browsers may return font families in different formats
   */
  const normalizeFontFamily = (fontFamily: string): string => {
    // Remove quotes and extra whitespace, convert to lowercase
    return fontFamily
      .replace(/["']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };

  /**
   * Property 7: Typography Consistency
   * **Validates: Requirements 7.3**
   * 
   * Test that all heading elements of the same level use consistent typography
   */
  it('Property 7: All headings of the same level have consistent typography', () => {
    fc.assert(
      fc.property(
        // Generate arrays of heading levels (h1-h6) with multiple instances
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
        fc.integer({ min: 2, max: 5 }), // Number of elements to test
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 2, maxLength: 5 }), // Content for each element
        (headingLevel, count, contents) => {
          // Create multiple heading elements of the same type
          const headings: HTMLElement[] = [];
          
          // Render multiple headings
          for (let i = 0; i < Math.min(count, contents.length); i++) {
            const TestComponent = () => {
              return React.createElement(headingLevel, {}, contents[i]);
            };
            
            const { container } = render(React.createElement(TestComponent));
            const heading = container.querySelector(headingLevel);
            if (heading) {
              headings.push(heading as HTMLElement);
            }
          }

          // Verify we have at least 2 headings to compare
          expect(headings.length).toBeGreaterThanOrEqual(2);

          // Get typography styles for the first heading as reference
          const referenceStyles = getTypographyStyles(headings[0]);
          const referenceFontFamily = normalizeFontFamily(referenceStyles.fontFamily);

          // Verify all other headings have the same typography
          for (let i = 1; i < headings.length; i++) {
            const currentStyles = getTypographyStyles(headings[i]);
            const currentFontFamily = normalizeFontFamily(currentStyles.fontFamily);

            // Font family should be consistent
            expect(currentFontFamily).toBe(referenceFontFamily);
            
            // Font size should be consistent for same heading level
            expect(currentStyles.fontSize).toBe(referenceStyles.fontSize);
            
            // Font weight should be consistent
            expect(currentStyles.fontWeight).toBe(referenceStyles.fontWeight);
            
            // Line height should be consistent
            expect(currentStyles.lineHeight).toBe(referenceStyles.lineHeight);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Typography Consistency
   * **Validates: Requirements 7.3**
   * 
   * Test that all paragraph elements use consistent typography
   */
  it('Property 7: All paragraph elements have consistent typography', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }), // Number of paragraphs
        fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 2, maxLength: 5 }), // Content
        (count, contents) => {
          const paragraphs: HTMLElement[] = [];
          
          // Render multiple paragraphs
          for (let i = 0; i < Math.min(count, contents.length); i++) {
            const TestComponent = () => React.createElement('p', {}, contents[i]);
            const { container } = render(React.createElement(TestComponent));
            const paragraph = container.querySelector('p');
            if (paragraph) {
              paragraphs.push(paragraph as HTMLElement);
            }
          }

          // Verify we have at least 2 paragraphs to compare
          expect(paragraphs.length).toBeGreaterThanOrEqual(2);

          // Get typography styles for the first paragraph as reference
          const referenceStyles = getTypographyStyles(paragraphs[0]);
          const referenceFontFamily = normalizeFontFamily(referenceStyles.fontFamily);

          // Verify all other paragraphs have the same typography
          for (let i = 1; i < paragraphs.length; i++) {
            const currentStyles = getTypographyStyles(paragraphs[i]);
            const currentFontFamily = normalizeFontFamily(currentStyles.fontFamily);

            // Font family should be consistent
            expect(currentFontFamily).toBe(referenceFontFamily);
            
            // Font size should be consistent
            expect(currentStyles.fontSize).toBe(referenceStyles.fontSize);
            
            // Font weight should be consistent
            expect(currentStyles.fontWeight).toBe(referenceStyles.fontWeight);
            
            // Line height should be consistent
            expect(currentStyles.lineHeight).toBe(referenceStyles.lineHeight);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Typography Consistency
   * **Validates: Requirements 7.3**
   * 
   * Test that all link elements use consistent typography
   */
  it('Property 7: All link elements have consistent typography', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }), // Number of links
        fc.array(fc.string({ minLength: 5, maxLength: 30 }), { minLength: 2, maxLength: 5 }), // Link text
        (count, contents) => {
          const links: HTMLElement[] = [];
          
          // Render multiple links
          for (let i = 0; i < Math.min(count, contents.length); i++) {
            const TestComponent = () => React.createElement('a', { href: '#' }, contents[i]);
            const { container } = render(React.createElement(TestComponent));
            const link = container.querySelector('a');
            if (link) {
              links.push(link as HTMLElement);
            }
          }

          // Verify we have at least 2 links to compare
          expect(links.length).toBeGreaterThanOrEqual(2);

          // Get typography styles for the first link as reference
          const referenceStyles = getTypographyStyles(links[0]);
          const referenceFontFamily = normalizeFontFamily(referenceStyles.fontFamily);

          // Verify all other links have the same typography
          for (let i = 1; i < links.length; i++) {
            const currentStyles = getTypographyStyles(links[i]);
            const currentFontFamily = normalizeFontFamily(currentStyles.fontFamily);

            // Font family should be consistent
            expect(currentFontFamily).toBe(referenceFontFamily);
            
            // Font size should be consistent
            expect(currentStyles.fontSize).toBe(referenceStyles.fontSize);
            
            // Font weight should be consistent
            expect(currentStyles.fontWeight).toBe(referenceStyles.fontWeight);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Typography Consistency
   * **Validates: Requirements 7.3**
   * 
   * Test that headings use the heading font family (Georgia)
   * and body text uses the body font family
   */
  it('Property 7: Headings use heading font, body text uses body font', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
        fc.string({ minLength: 5, maxLength: 50 }),
        (headingLevel, content) => {
          // Render a heading
          const HeadingComponent = () => React.createElement(headingLevel, {}, content);
          const { container: headingContainer } = render(React.createElement(HeadingComponent));
          const heading = headingContainer.querySelector(headingLevel);

          // Render a paragraph
          const ParagraphComponent = () => React.createElement('p', {}, content);
          const { container: paragraphContainer } = render(React.createElement(ParagraphComponent));
          const paragraph = paragraphContainer.querySelector('p');

          expect(heading).toBeTruthy();
          expect(paragraph).toBeTruthy();

          if (heading && paragraph) {
            const headingFontFamily = window.getComputedStyle(heading).fontFamily;
            const paragraphFontFamily = window.getComputedStyle(paragraph).fontFamily;

            // Headings should use the heading font (either the CSS variable or Georgia)
            // In test environment, it might be the CSS variable reference
            const isHeadingFontCorrect = 
              headingFontFamily.includes('--font-heading') || 
              normalizeFontFamily(headingFontFamily).includes('georgia');
            expect(isHeadingFontCorrect).toBe(true);

            // Paragraphs should use the body font (either the CSS variable or system fonts)
            const isParagraphFontCorrect = 
              paragraphFontFamily.includes('--font-body') || 
              (!normalizeFontFamily(paragraphFontFamily).includes('georgia'));
            expect(isParagraphFontCorrect).toBe(true);
            
            // The font families should be different
            expect(headingFontFamily).not.toBe(paragraphFontFamily);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Typography Consistency
   * **Validates: Requirements 7.3**
   * 
   * Test that code elements use monospace font consistently
   */
  it('Property 7: All code elements use consistent monospace typography', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }), // Number of code elements
        fc.array(fc.string({ minLength: 5, maxLength: 30 }), { minLength: 2, maxLength: 5 }), // Code content
        (count, contents) => {
          const codeElements: HTMLElement[] = [];
          
          // Render multiple code elements
          for (let i = 0; i < Math.min(count, contents.length); i++) {
            const TestComponent = () => React.createElement('code', {}, contents[i]);
            const { container } = render(React.createElement(TestComponent));
            const code = container.querySelector('code');
            if (code) {
              codeElements.push(code as HTMLElement);
            }
          }

          // Verify we have at least 2 code elements to compare
          expect(codeElements.length).toBeGreaterThanOrEqual(2);

          // Get typography styles for the first code element as reference
          const referenceStyles = getTypographyStyles(codeElements[0]);
          const referenceFontFamily = referenceStyles.fontFamily;

          // Code elements should use monospace font (either CSS variable or actual font)
          const isMonospaceFont = 
            referenceFontFamily.includes('--font-code') || 
            normalizeFontFamily(referenceFontFamily).match(/courier|monospace/);
          expect(isMonospaceFont).toBeTruthy();

          // Verify all other code elements have the same typography
          for (let i = 1; i < codeElements.length; i++) {
            const currentStyles = getTypographyStyles(codeElements[i]);
            const currentFontFamily = currentStyles.fontFamily;

            // Font family should be consistent
            expect(currentFontFamily).toBe(referenceFontFamily);
            
            // Font size should be consistent
            expect(currentStyles.fontSize).toBe(referenceStyles.fontSize);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
