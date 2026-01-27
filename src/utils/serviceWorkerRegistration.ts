/**
 * Service Worker Registration Utility
 * 
 * Handles registration and lifecycle of the service worker.
 * Requirements: 10.5
 */

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function register(config?: ServiceWorkerConfig): void {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  // Only register in production or when explicitly enabled
  if (import.meta.env.MODE === 'production' || import.meta.env.VITE_SW_ENABLED === 'true') {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';
      registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('[Service Worker] Registered successfully:', registration);

      // Check for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available
              console.log('[Service Worker] New content available; please refresh.');
              config?.onUpdate?.(registration);
            } else {
              // Content is cached for offline use
              console.log('[Service Worker] Content cached for offline use.');
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('[Service Worker] Registration failed:', error);
      config?.onError?.(error);
    });
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[Service Worker] Unregistered');
      })
      .catch((error) => {
        console.error('[Service Worker] Unregistration failed:', error);
      });
  }
}

export function checkForUpdates(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.update();
        console.log('[Service Worker] Checking for updates...');
      })
      .catch((error) => {
        console.error('[Service Worker] Update check failed:', error);
      });
  }
}
