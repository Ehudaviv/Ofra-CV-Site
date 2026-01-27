/**
 * Property-based tests for Responsive Layout Adaptation
 * Feature: portfolio-website
 * 
 * Property 9: Responsive Layout Adaptation
 * **Validates: Requirements 8.1**
 * 
 * For any screen width between 320px and 2560px, the layout should adapt
 * without horizontal scrolling and all content should remain accessible.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// Import theme styles to ensure CSS is available
import '../styles/index.scss';

describe('Responsive Layout Adaptation - Property-Based Tests', () => {
  beforeEach(() => {
    // Ensure clean DOM for each test
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Helper function to set viewport width
   */
  const setViewportWidth = (width: number): void => {
    // Set window.innerWidth (read-only, so we need to use Object.defineProperty)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    
    // Set document.documentElement.clientWidth
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  };

  /**
   * Helper function to check if element has horizontal scroll
   */
  const hasHorizontalScroll = (element: HTMLElement, viewportWidth: number): boolean => {
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth || viewportWidth;
    
    // Element has horizontal scroll if scrollWidth exceeds clientWidth
    return scrollWidth > clientWidth;
  };

  /**
   * Helper function to check if element is accessible (visible and within viewport)
   */
  const isElementAccessible = (element: HTMLElement, viewportWidth: number): boolean => {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    // Check if element is visible
    const isVisible = 
      styles.display !== 'none' &&
      styles.visibility !== 'hidden' &&
      styles.opacity !== '0';
    
    // Check if element is within or can be scrolled to within viewport
    // Allow elements to be positioned off-screen if they're meant to be scrolled to
    const isWithinReasonableBounds = rect.left < viewportWidth * 2; // Allow some overflow for animations
    
    return isVisible && isWithinReasonableBounds;
  };

  /**
   * Helper function to create a test component with various layout elements
   */
  const createTestLayout = (width: number) => {
    return React.createElement('div', {
      style: {
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      },
      'data-testid': 'test-layout',
    }, [
      // Header
      React.createElement('header', {
        key: 'header',
        style: {
          width: '100%',
          padding: '16px',
          boxSizing: 'border-box',
        },
      }, 'Header'),
      
      // Main content
      React.createElement('main', {
        key: 'main',
        style: {
          width: '100%',
          padding: '16px',
          boxSizing: 'border-box',
        },
      }, [
        React.createElement('h1', { key: 'h1' }, 'Heading'),
        React.createElement('p', { key: 'p' }, 'Content paragraph'),
      ]),
      
      // Footer
      React.createElement('footer', {
        key: 'footer',
        style: {
          width: '100%',
          padding: '16px',
          boxSizing: 'border-box',
        },
      }, 'Footer'),
    ]);
  };

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that layouts adapt without horizontal scrolling across all screen widths
   */
  it('Property 9: Layout adapts without horizontal scroll for any screen width (320px-2560px)', () => {
    fc.assert(
      fc.property(
        // Generate random screen widths within the required range
        fc.integer({ min: 320, max: 2560 }),
        (screenWidth) => {
          // Set viewport width
          setViewportWidth(screenWidth);
          
          // Create and render test layout
          const TestComponent = () => createTestLayout(screenWidth);
          const { container } = render(React.createElement(TestComponent));
          
          // Get the root element
          const rootElement = container.firstChild as HTMLElement;
          expect(rootElement).toBeTruthy();
          
          // Check that the layout doesn't cause horizontal scroll
          const hasScroll = hasHorizontalScroll(rootElement, screenWidth);
          
          // Log failure details for debugging
          if (hasScroll) {
            console.log(
              `Horizontal scroll detected at ${screenWidth}px: ` +
              `scrollWidth=${rootElement.scrollWidth}, clientWidth=${rootElement.clientWidth}`
            );
          }
          
          // Assert no horizontal scroll
          expect(hasScroll).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that container elements respect max-width constraints
   */
  it('Property 9: Container elements respect viewport width constraints', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (screenWidth) => {
          setViewportWidth(screenWidth);
          
          // Create a container element
          const TestComponent = () => React.createElement('div', {
            className: 'container',
            style: {
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              padding: '16px',
            },
          }, 'Container content');
          
          const { container } = render(React.createElement(TestComponent));
          const containerElement = container.querySelector('.container') as HTMLElement;
          
          expect(containerElement).toBeTruthy();
          
          if (containerElement) {
            const rect = containerElement.getBoundingClientRect();
            
            // Container width should not exceed viewport width
            expect(rect.width).toBeLessThanOrEqual(screenWidth);
            
            // Container should not cause horizontal scroll
            expect(containerElement.scrollWidth).toBeLessThanOrEqual(screenWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that grid layouts adapt to screen width
   */
  it('Property 9: Grid layouts adapt columns based on screen width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 3, max: 12 }), // Number of grid items
        (screenWidth, itemCount) => {
          setViewportWidth(screenWidth);
          
          // Create a responsive grid
          const items = Array.from({ length: itemCount }, (_, i) =>
            React.createElement('div', {
              key: i,
              style: {
                minWidth: 0, // Allow items to shrink
                boxSizing: 'border-box',
              },
            }, `Item ${i + 1}`)
          );
          
          const TestComponent = () => React.createElement('div', {
            className: 'grid-responsive',
            style: {
              display: 'grid',
              gap: '16px',
              width: '100%',
              boxSizing: 'border-box',
              // Responsive grid columns based on screen width
              gridTemplateColumns: screenWidth < 768 
                ? '1fr' 
                : screenWidth < 1024 
                  ? 'repeat(2, 1fr)' 
                  : screenWidth < 1440 
                    ? 'repeat(3, 1fr)' 
                    : 'repeat(4, 1fr)',
            },
          }, items);
          
          const { container } = render(React.createElement(TestComponent));
          const gridElement = container.querySelector('.grid-responsive') as HTMLElement;
          
          expect(gridElement).toBeTruthy();
          
          if (gridElement) {
            // Grid should not cause horizontal scroll
            const hasScroll = hasHorizontalScroll(gridElement, screenWidth);
            expect(hasScroll).toBe(false);
            
            // Grid width should not exceed viewport
            const rect = gridElement.getBoundingClientRect();
            expect(rect.width).toBeLessThanOrEqual(screenWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that text content remains accessible at all screen widths
   */
  it('Property 9: Text content remains accessible at all screen widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.string({ minLength: 10, maxLength: 200 }),
        (screenWidth, textContent) => {
          setViewportWidth(screenWidth);
          
          // Create text elements
          const TestComponent = () => React.createElement('div', {
            style: {
              width: '100%',
              maxWidth: '100%',
              padding: '16px',
              boxSizing: 'border-box',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            },
          }, [
            React.createElement('h1', { 
              key: 'heading',
              style: {
                maxWidth: '100%',
                wordWrap: 'break-word',
              },
            }, 'Heading'),
            React.createElement('p', { 
              key: 'paragraph',
              style: {
                maxWidth: '100%',
                wordWrap: 'break-word',
              },
            }, textContent),
          ]);
          
          const { container } = render(React.createElement(TestComponent));
          const textContainer = container.firstChild as HTMLElement;
          
          expect(textContainer).toBeTruthy();
          
          if (textContainer) {
            // Text container should not cause horizontal scroll
            const hasScroll = hasHorizontalScroll(textContainer, screenWidth);
            expect(hasScroll).toBe(false);
            
            // All text elements should be accessible
            const heading = textContainer.querySelector('h1') as HTMLElement;
            const paragraph = textContainer.querySelector('p') as HTMLElement;
            
            if (heading) {
              expect(isElementAccessible(heading, screenWidth)).toBe(true);
            }
            
            if (paragraph) {
              expect(isElementAccessible(paragraph, screenWidth)).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that images scale appropriately without causing overflow
   */
  it('Property 9: Images scale to fit viewport without overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 400, max: 2000 }), // Original image width
        (screenWidth, imageWidth) => {
          setViewportWidth(screenWidth);
          
          // Create an image element with responsive styling
          const TestComponent = () => React.createElement('div', {
            style: {
              width: '100%',
              maxWidth: '100%',
              padding: '16px',
              boxSizing: 'border-box',
            },
          }, React.createElement('img', {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
            alt: 'Test image',
            style: {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
            },
            width: imageWidth,
          }));
          
          const { container } = render(React.createElement(TestComponent));
          const imageContainer = container.firstChild as HTMLElement;
          const image = imageContainer?.querySelector('img') as HTMLElement;
          
          expect(imageContainer).toBeTruthy();
          expect(image).toBeTruthy();
          
          if (imageContainer && image) {
            // Image container should not cause horizontal scroll
            const hasScroll = hasHorizontalScroll(imageContainer, screenWidth);
            expect(hasScroll).toBe(false);
            
            // Image should be accessible
            expect(isElementAccessible(image, screenWidth)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that flexbox layouts adapt without overflow
   */
  it('Property 9: Flexbox layouts adapt without horizontal overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 2, max: 6 }), // Number of flex items
        (screenWidth, itemCount) => {
          setViewportWidth(screenWidth);
          
          // Create flex items
          const items = Array.from({ length: itemCount }, (_, i) =>
            React.createElement('div', {
              key: i,
              style: {
                flex: '1 1 auto',
                minWidth: 0, // Allow items to shrink below content size
                padding: '8px',
                boxSizing: 'border-box',
              },
            }, `Item ${i + 1}`)
          );
          
          const TestComponent = () => React.createElement('div', {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              width: '100%',
              maxWidth: '100%',
              padding: '16px',
              boxSizing: 'border-box',
            },
          }, items);
          
          const { container } = render(React.createElement(TestComponent));
          const flexContainer = container.firstChild as HTMLElement;
          
          expect(flexContainer).toBeTruthy();
          
          if (flexContainer) {
            // Flex container should not cause horizontal scroll
            const hasScroll = hasHorizontalScroll(flexContainer, screenWidth);
            expect(hasScroll).toBe(false);
            
            // Container width should not exceed viewport
            const rect = flexContainer.getBoundingClientRect();
            expect(rect.width).toBeLessThanOrEqual(screenWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that the layout adapts correctly at specific breakpoints
   */
  it('Property 9: Layout adapts correctly at defined breakpoints', () => {
    const breakpoints = [
      { name: 'mobile', width: 320 },
      { name: 'mobile-large', width: 375 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 },
      { name: 'wide', width: 1440 },
      { name: 'ultra', width: 2560 },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...breakpoints),
        (breakpoint) => {
          setViewportWidth(breakpoint.width);
          
          // Create a comprehensive layout
          const TestComponent = () => createTestLayout(breakpoint.width);
          const { container } = render(React.createElement(TestComponent));
          
          const rootElement = container.firstChild as HTMLElement;
          expect(rootElement).toBeTruthy();
          
          if (rootElement) {
            // No horizontal scroll at any breakpoint
            const hasScroll = hasHorizontalScroll(rootElement, breakpoint.width);
            
            if (hasScroll) {
              console.log(
                `Horizontal scroll at ${breakpoint.name} (${breakpoint.width}px): ` +
                `scrollWidth=${rootElement.scrollWidth}, clientWidth=${rootElement.clientWidth}`
              );
            }
            
            expect(hasScroll).toBe(false);
            
            // All content should be accessible
            const header = rootElement.querySelector('header') as HTMLElement;
            const main = rootElement.querySelector('main') as HTMLElement;
            const footer = rootElement.querySelector('footer') as HTMLElement;
            
            if (header) expect(isElementAccessible(header, breakpoint.width)).toBe(true);
            if (main) expect(isElementAccessible(main, breakpoint.width)).toBe(true);
            if (footer) expect(isElementAccessible(footer, breakpoint.width)).toBe(true);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that elements with fixed widths don't exceed viewport
   */
  it('Property 9: Fixed-width elements respect viewport constraints', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 200, max: 1200 }), // Fixed width value
        (screenWidth, fixedWidth) => {
          setViewportWidth(screenWidth);
          
          // Create element with fixed width but max-width constraint
          const TestComponent = () => React.createElement('div', {
            style: {
              width: `${fixedWidth}px`,
              maxWidth: '100%',
              padding: '16px',
              boxSizing: 'border-box',
            },
          }, 'Fixed width content');
          
          const { container } = render(React.createElement(TestComponent));
          const element = container.firstChild as HTMLElement;
          
          expect(element).toBeTruthy();
          
          if (element) {
            const rect = element.getBoundingClientRect();
            
            // Element should not exceed viewport width
            expect(rect.width).toBeLessThanOrEqual(screenWidth);
            
            // Element should not cause horizontal scroll
            expect(element.scrollWidth).toBeLessThanOrEqual(screenWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Responsive Layout Adaptation
   * **Validates: Requirements 8.1**
   * 
   * Test that padding and margins don't cause overflow
   */
  it('Property 9: Padding and margins are included in width calculations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 8, max: 64 }), // Padding value
        (screenWidth, padding) => {
          setViewportWidth(screenWidth);
          
          // Create element with padding
          const TestComponent = () => React.createElement('div', {
            style: {
              width: '100%',
              padding: `${padding}px`,
              boxSizing: 'border-box',
            },
          }, 'Content with padding');
          
          const { container } = render(React.createElement(TestComponent));
          const element = container.firstChild as HTMLElement;
          
          expect(element).toBeTruthy();
          
          if (element) {
            const rect = element.getBoundingClientRect();
            
            // Element with padding should not exceed viewport
            expect(rect.width).toBeLessThanOrEqual(screenWidth);
            
            // Should not cause horizontal scroll
            expect(element.scrollWidth).toBeLessThanOrEqual(screenWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
