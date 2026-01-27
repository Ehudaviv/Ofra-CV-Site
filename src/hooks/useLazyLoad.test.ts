/**
 * Unit Tests for useLazyLoad Hook
 * 
 * Tests progressive loading implementation using Intersection Observer.
 * Requirements: 10.1
 */

import { renderHook } from '@testing-library/react';
import { useLazyLoad } from './useLazyLoad';
import { describe, it, expect } from 'vitest';

describe('useLazyLoad', () => {
  it('should initialize with isIntersecting false and hasIntersected false', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current.ref).toHaveProperty('current');
  });

  it('should accept custom options', () => {
    const options = { rootMargin: '100px', threshold: 0.5 };
    const { result } = renderHook(() => useLazyLoad(options));

    // Should not throw and should return valid hook result
    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
  });
});
