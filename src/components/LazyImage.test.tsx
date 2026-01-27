/**
 * Unit Tests for LazyImage Component
 * 
 * Tests progressive loading, placeholder display, and error handling.
 * Requirements: 10.1, 10.2, 10.3
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LazyImage } from './LazyImage';

// Mock the useLazyLoad hook
vi.mock('../hooks/useLazyLoad', () => ({
  useLazyLoad: () => ({
    ref: { current: null },
    isIntersecting: true,
    hasIntersected: true,
  }),
}));

describe('LazyImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display placeholder while loading', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" />);

    const placeholder = screen.getByRole('status', { name: /loading image/i });
    expect(placeholder).toBeInTheDocument();
  });

  it('should display image after loading', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(img).toHaveStyle({ display: 'block' });
    });
  });

  it('should call onLoad callback when image loads', async () => {
    const onLoad = vi.fn();
    render(<LazyImage src="/test-image.jpg" alt="Test image" onLoad={onLoad} data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('should display error placeholder when image fails to load', async () => {
    render(<LazyImage src="/broken-image.jpg" alt="Test image" data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      const errorPlaceholder = screen.getByRole('img', { name: /failed to load image/i });
      expect(errorPlaceholder).toBeInTheDocument();
    });
  });

  it('should call onError callback when image fails to load', async () => {
    const onError = vi.fn();
    render(<LazyImage src="/broken-image.jpg" alt="Test image" onError={onError} data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('should apply custom className to image', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" className="custom-class" data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    expect(img).toHaveClass('custom-class');
  });

  it('should have correct alt text', () => {
    render(<LazyImage src="/test-image.jpg" alt="Custom alt text" data-testid="lazy-img" />);

    const img = screen.getByTestId('lazy-img');
    expect(img).toHaveAttribute('alt', 'Custom alt text');
  });
});
