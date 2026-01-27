/**
 * Property-based tests for Color Contrast Accessibility
 * Feature: portfolio-website
 * 
 * Property 8: Color Contrast Accessibility
 * **Validates: Requirements 7.5**
 * 
 * For any text element and its background, the color contrast ratio should meet
 * WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { theme } from '../types/theme';

describe('Color Contrast Accessibility - Property-Based Tests', () => {
  /**
   * Helper function to convert hex color to RGB
   */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  /**
   * Helper function to calculate relative luminance
   * Based on WCAG 2.1 specification
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  const getRelativeLuminance = (rgb: { r: number; g: number; b: number }): number => {
    // Convert RGB values to sRGB
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;
    
    // Apply gamma correction
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  /**
   * Helper function to calculate contrast ratio between two colors
   * Based on WCAG 2.1 specification
   * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
   */
  const getContrastRatio = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const lum1 = getRelativeLuminance(rgb1);
    const lum2 = getRelativeLuminance(rgb2);
    
    // Ensure lighter color is in numerator
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    // Calculate contrast ratio
    return (lighter + 0.05) / (darker + 0.05);
  };

  /**
   * Helper function to check if contrast ratio meets WCAG AA standards
   */
  const meetsWCAGAA = (contrastRatio: number, isLargeText: boolean = false): boolean => {
    const minimumRatio = isLargeText ? 3.0 : 4.5;
    return contrastRatio >= minimumRatio;
  };

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that text colors used for normal body text meet WCAG AA standards
   * Only tests combinations that are actually used in the design
   */
  it('Property 8: Body text colors on backgrounds meet WCAG AA contrast standards (normal text)', () => {
    // Define text colors that are actually used for normal body text
    // Primary, accent, and other decorative colors are NOT used for body text
    const textColors = [
      { name: 'text', color: theme.colors.text },
      { name: 'textLight', color: theme.colors.textLight },
      { name: 'textMuted', color: theme.colors.textMuted },
      { name: 'secondary (links)', color: theme.colors.secondary },
      { name: 'error', color: theme.colors.error },
      { name: 'success', color: theme.colors.success },
    ];

    // Define background colors from theme
    const backgroundColors = [
      { name: 'background', color: theme.colors.background },
      { name: 'backgroundLight', color: theme.colors.backgroundLight },
      { name: 'backgroundDark', color: theme.colors.backgroundDark },
      { name: 'white', color: theme.colors.white },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...textColors),
        fc.constantFrom(...backgroundColors),
        (textColor, backgroundColor) => {
          const contrastRatio = getContrastRatio(textColor.color, backgroundColor.color);
          const meetsStandard = meetsWCAGAA(contrastRatio, false);

          // Log the combination for debugging
          if (!meetsStandard) {
            console.log(
              `Contrast issue: ${textColor.name} (${textColor.color}) on ${backgroundColor.name} (${backgroundColor.color}) = ${contrastRatio.toFixed(2)}:1`
            );
          }

          // Assert that the contrast ratio meets WCAG AA standards for normal text (4.5:1)
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
          expect(meetsStandard).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that text colors used for large text (headings) meet WCAG AA standards
   * Only tests combinations that are actually used in the design
   */
  it('Property 8: Large text colors on backgrounds meet WCAG AA contrast standards', () => {
    // Define text colors that are actually used for large text (headings)
    // Accent color is decorative and not used for text
    const textColors = [
      { name: 'text', color: theme.colors.text },
      { name: 'textLight', color: theme.colors.textLight },
      { name: 'primary', color: theme.colors.primary },
      { name: 'secondary', color: theme.colors.secondary },
    ];

    // Define background colors from theme
    const backgroundColors = [
      { name: 'background', color: theme.colors.background },
      { name: 'backgroundLight', color: theme.colors.backgroundLight },
      { name: 'backgroundDark', color: theme.colors.backgroundDark },
      { name: 'white', color: theme.colors.white },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...textColors),
        fc.constantFrom(...backgroundColors),
        (textColor, backgroundColor) => {
          const contrastRatio = getContrastRatio(textColor.color, backgroundColor.color);
          const meetsStandard = meetsWCAGAA(contrastRatio, true);

          // Log the combination for debugging
          if (!meetsStandard) {
            console.log(
              `Large text contrast issue: ${textColor.name} (${textColor.color}) on ${backgroundColor.name} (${backgroundColor.color}) = ${contrastRatio.toFixed(2)}:1`
            );
          }

          // Assert that the contrast ratio meets WCAG AA standards for large text (3:1)
          expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
          expect(meetsStandard).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that primary text color on all background variants meets standards
   */
  it('Property 8: Primary text color meets contrast standards on all backgrounds', () => {
    const primaryTextColor = theme.colors.text;
    
    const backgrounds = [
      theme.colors.background,
      theme.colors.backgroundLight,
      theme.colors.backgroundDark,
      theme.colors.white,
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...backgrounds),
        (backgroundColor) => {
          const contrastRatio = getContrastRatio(primaryTextColor, backgroundColor);
          
          // Primary text should meet normal text standards (4.5:1)
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that interactive elements (links) have sufficient contrast
   * Buttons use white text on colored backgrounds, tested separately
   */
  it('Property 8: Interactive link colors meet contrast standards', () => {
    // Link colors (text on background)
    const linkColors = [
      { name: 'secondary (links)', color: theme.colors.secondary },
      { name: 'secondaryLight (hover)', color: theme.colors.secondaryLight },
      { name: 'secondaryDark (active)', color: theme.colors.secondaryDark },
    ];

    const backgrounds = [
      { name: 'background', color: theme.colors.background },
      { name: 'backgroundLight', color: theme.colors.backgroundLight },
      { name: 'white', color: theme.colors.white },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...linkColors),
        fc.constantFrom(...backgrounds),
        (linkColor, backgroundColor) => {
          const contrastRatio = getContrastRatio(linkColor.color, backgroundColor.color);
          
          // Links should meet normal text standards (4.5:1)
          const meetsStandard = contrastRatio >= 4.5;
          
          if (!meetsStandard) {
            console.log(
              `Link contrast issue: ${linkColor.name} (${linkColor.color}) on ${backgroundColor.name} (${backgroundColor.color}) = ${contrastRatio.toFixed(2)}:1`
            );
          }
          
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
          expect(meetsStandard).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that the contrast calculation functions work correctly with known values
   */
  it('Property 8: Contrast calculation produces correct ratios for known color pairs', () => {
    // Test with known contrast ratios
    const knownPairs = [
      { fg: '#000000', bg: '#ffffff', expectedRatio: 21 }, // Black on white (maximum contrast)
      { fg: '#ffffff', bg: '#000000', expectedRatio: 21 }, // White on black (maximum contrast)
      { fg: '#777777', bg: '#ffffff', expectedRatio: 4.47 }, // Gray on white (approximately 4.5:1)
    ];

    knownPairs.forEach(pair => {
      const calculatedRatio = getContrastRatio(pair.fg, pair.bg);
      
      // Allow small tolerance for floating point calculations
      expect(calculatedRatio).toBeCloseTo(pair.expectedRatio, 1);
    });
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that contrast ratio calculation is symmetric (order doesn't matter)
   */
  it('Property 8: Contrast ratio is symmetric regardless of color order', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        (color1Hex, color2Hex) => {
          const color1 = `#${color1Hex}`;
          const color2 = `#${color2Hex}`;
          
          const ratio1 = getContrastRatio(color1, color2);
          const ratio2 = getContrastRatio(color2, color1);
          
          // Ratios should be identical regardless of order
          expect(ratio1).toBeCloseTo(ratio2, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Color Contrast Accessibility
   * **Validates: Requirements 7.5**
   * 
   * Test that all theme color combinations actually used in the design meet standards
   */
  it('Property 8: All documented theme color combinations meet WCAG AA standards', () => {
    // Document the actual color combinations used in the design
    const designCombinations = [
      // Body text on backgrounds
      { text: theme.colors.text, bg: theme.colors.background, type: 'normal', usage: 'Body text' },
      { text: theme.colors.text, bg: theme.colors.backgroundLight, type: 'normal', usage: 'Body text on light bg' },
      { text: theme.colors.text, bg: theme.colors.backgroundDark, type: 'normal', usage: 'Body text on dark bg' },
      
      // Secondary text
      { text: theme.colors.textLight, bg: theme.colors.background, type: 'normal', usage: 'Secondary text' },
      { text: theme.colors.textMuted, bg: theme.colors.background, type: 'normal', usage: 'Muted text' },
      
      // Links
      { text: theme.colors.secondary, bg: theme.colors.background, type: 'normal', usage: 'Links' },
      { text: theme.colors.secondaryLight, bg: theme.colors.background, type: 'normal', usage: 'Links hover' },
      
      // Headings (large text)
      { text: theme.colors.text, bg: theme.colors.background, type: 'large', usage: 'Headings' },
      { text: theme.colors.primary, bg: theme.colors.background, type: 'large', usage: 'Primary headings' },
      
      // Buttons (white text on colored backgrounds)
      { text: theme.colors.white, bg: theme.colors.primary, type: 'large', usage: 'Primary button' },
      { text: theme.colors.white, bg: theme.colors.secondary, type: 'large', usage: 'Secondary button' },
      
      // Error messages
      { text: theme.colors.error, bg: theme.colors.background, type: 'normal', usage: 'Error text' },
      
      // Success messages
      { text: theme.colors.success, bg: theme.colors.background, type: 'normal', usage: 'Success text' },
    ];

    designCombinations.forEach(combo => {
      const contrastRatio = getContrastRatio(combo.text, combo.bg);
      const isLargeText = combo.type === 'large';
      const minimumRatio = isLargeText ? 3.0 : 4.5;
      const meetsStandard = meetsWCAGAA(contrastRatio, isLargeText);

      if (!meetsStandard) {
        console.log(
          `Design combination issue: ${combo.usage} - ${combo.text} on ${combo.bg} = ${contrastRatio.toFixed(2)}:1 (needs ${minimumRatio}:1)`
        );
      }

      expect(contrastRatio).toBeGreaterThanOrEqual(minimumRatio);
      expect(meetsStandard).toBe(true);
    });
  });
});
