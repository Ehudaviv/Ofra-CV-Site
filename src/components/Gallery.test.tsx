/**
 * Unit Tests for Gallery Component
 * 
 * Tests grid layout structure, navigation controls, keyboard navigation,
 * placeholder displays, and error fallback placeholders.
 * Requirements: 3.2, 3.4, 10.2, 10.3
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Gallery, GalleryImage } from './Gallery';

const mockImages: GalleryImage[] = [
  {
    id: '1',
    filename: 'image1.jpg',
    thumbnailUrl: '/images/thumb1.jpg',
    fullUrl: '/images/full1.jpg',
    captionKey: 'exhibitions.image1',
    alt: 'Exhibition image 1',
  },
  {
    id: '2',
    filename: 'image2.jpg',
    thumbnailUrl: '/images/thumb2.jpg',
    fullUrl: '/images/full2.jpg',
    captionKey: 'exhibitions.image2',
    alt: 'Exhibition image 2',
  },
  {
    id: '3',
    filename: 'image3.jpg',
    thumbnailUrl: '/images/thumb3.jpg',
    fullUrl: '/images/full3.jpg',
    captionKey: 'exhibitions.image3',
    alt: 'Exhibition image 3',
  },
];

describe('Gallery Component', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: () => 'en',
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  /**
   * Test: Grid layout structure
   * Requirement: 3.2
   */
  it('renders images in a grid layout', () => {
    const { container } = render(<Gallery images={mockImages} />);
    
    const grid = screen.getByTestId('gallery-grid');
    expect(grid).toBeDefined();
    
    const thumbnails = screen.getAllByTestId(/thumbnail-\d+/);
    expect(thumbnails.length).toBe(mockImages.length);
  });

  /**
   * Test: Navigation controls exist
   * Requirement: 3.4
   */
  it('displays navigation controls in lightbox', async () => {
    const user = userEvent.setup();
    render(<Gallery images={mockImages} />);
    
    // Click first thumbnail to open lightbox
    const firstThumbnail = screen.getByTestId('thumbnail-0');
    await user.click(firstThumbnail);
    
    // Check for navigation controls
    const prevButton = screen.getByLabelText(/previous/i);
    const nextButton = screen.getByLabelText(/next/i);
    const closeButton = screen.getByLabelText(/close/i);
    
    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();
    expect(closeButton).toBeDefined();
  });

  /**
   * Test: Placeholder displays during load
   * Requirement: 10.2
   */
  it('displays loading placeholders initially', () => {
    const { container } = render(<Gallery images={mockImages} />);
    
    // Check for loading placeholders
    const placeholders = container.querySelectorAll('[role="status"][aria-label="Loading image"]');
    
    // Initially, images should have placeholders
    expect(placeholders.length).toBeGreaterThan(0);
  });

  /**
   * Test: Fallback placeholder on error
   * Requirement: 10.3
   */
  it('displays error placeholder when image fails to load', async () => {
    render(<Gallery images={mockImages} />);
    
    // Find thumbnail images
    const firstImage = screen.getByTestId('thumbnail-image-0') as HTMLImageElement;
    
    // Simulate image load error on first image
    const errorEvent = new Event('error');
    firstImage.dispatchEvent(errorEvent);
    
    // Wait for error placeholder to appear
    await waitFor(() => {
      const errorPlaceholders = screen.getAllByRole('img', { name: /failed to load image/i });
      expect(errorPlaceholders.length).toBeGreaterThan(0);
    });
  });

  /**
   * Test: Lightbox opens on thumbnail click
   * Requirement: 3.3
   */
  it('opens lightbox when thumbnail is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Gallery images={mockImages} />);
    
    // Verify lightbox is not initially visible
    let lightbox = container.querySelector('[role="dialog"]');
    expect(lightbox).toBeNull();
    
    // Click first thumbnail
    const firstThumbnail = screen.getByTestId('thumbnail-0');
    await user.click(firstThumbnail);
    
    // Verify lightbox is now open
    lightbox = container.querySelector('[role="dialog"]');
    expect(lightbox).not.toBeNull();
  });

  /**
   * Test: Lightbox closes on close button click
   * Requirement: 3.4
   */
  it('closes lightbox when close button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Gallery images={mockImages} />);
    
    // Open lightbox
    const firstThumbnail = screen.getByTestId('thumbnail-0');
    await user.click(firstThumbnail);
    
    // Click close button
    const closeButton = screen.getByLabelText(/close/i);
    await user.click(closeButton);
    
    // Verify lightbox is closed
    await waitFor(() => {
      const lightbox = container.querySelector('[role="dialog"]');
      expect(lightbox).toBeNull();
    });
  });

  /**
   * Test: Previous button is disabled on first image
   * Requirement: 3.4
   */
  it('disables previous button on first image', async () => {
    const user = userEvent.setup();
    render(<Gallery images={mockImages} />);
    
    // Open lightbox on first image
    const firstThumbnail = screen.getByTestId('thumbnail-0');
    await user.click(firstThumbnail);
    
    // Check previous button is disabled
    const prevButton = screen.getByLabelText(/previous/i) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  /**
   * Test: Next button is disabled on last image
   * Requirement: 3.4
   */
  it('disables next button on last image', async () => {
    const user = userEvent.setup();
    render(<Gallery images={mockImages} />);
    
    // Open lightbox on last image
    const lastThumbnail = screen.getByTestId(`thumbnail-${mockImages.length - 1}`);
    await user.click(lastThumbnail);
    
    // Check next button is disabled
    const nextButton = screen.getByLabelText(/next/i) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
  });

  /**
   * Test: Empty gallery renders without errors
   */
  it('renders empty gallery without errors', () => {
    render(<Gallery images={[]} />);
    
    const grid = screen.getByTestId('gallery-grid');
    expect(grid).toBeDefined();
    
    const thumbnails = screen.queryAllByTestId(/thumbnail-\d+/);
    expect(thumbnails.length).toBe(0);
  });
});
