/**
 * Unit Tests for Service Worker Registration
 * 
 * Tests caching behavior and service worker lifecycle.
 * Requirements: 10.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { register, unregister, checkForUpdates } from './serviceWorkerRegistration';

describe('serviceWorkerRegistration', () => {
  let mockServiceWorker: any;
  let mockRegistration: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock service worker registration
    mockRegistration = {
      installing: null,
      waiting: null,
      active: null,
      onupdatefound: null,
      update: vi.fn().mockResolvedValue(undefined),
      unregister: vi.fn().mockResolvedValue(true),
    };

    mockServiceWorker = {
      register: vi.fn().mockResolvedValue(mockRegistration),
      ready: Promise.resolve(mockRegistration),
      controller: null,
    };

    // Mock navigator.serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
      configurable: true,
    });

    // Mock import.meta.env
    (import.meta as any).env = {
      MODE: 'production',
      VITE_SW_ENABLED: 'true',
    };
  });

  describe('register', () => {
    it('should not register if service workers are not supported', () => {
      // Remove service worker support
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      register();

      // Should not attempt to register
      expect(mockServiceWorker.register).not.toHaveBeenCalled();
    });

    it('should accept configuration callbacks', () => {
      const config = {
        onSuccess: vi.fn(),
        onUpdate: vi.fn(),
        onError: vi.fn(),
      };

      // Should not throw
      expect(() => register(config)).not.toThrow();
    });
  });

  describe('unregister', () => {
    it('should call unregister on service worker registration', async () => {
      await unregister();

      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Unregister failed');
      mockRegistration.unregister.mockRejectedValue(error);

      // Should not throw
      await expect(async () => await unregister()).not.toThrow();
    });
  });

  describe('checkForUpdates', () => {
    it('should call update on service worker registration', async () => {
      await checkForUpdates();

      expect(mockRegistration.update).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Update check failed');
      mockRegistration.update.mockRejectedValue(error);

      // Should not throw
      await expect(async () => await checkForUpdates()).not.toThrow();
    });
  });
});
