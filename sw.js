/**
 * Service Worker for Content Caching
 * 
 * Implements caching strategies for static assets, images, and documents.
 * Requirements: 10.5
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const DOCUMENT_CACHE = `documents-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove old caches
              return cacheName.startsWith('static-') ||
                     cacheName.startsWith('images-') ||
                     cacheName.startsWith('documents-') &&
                     cacheName !== STATIC_CACHE &&
                     cacheName !== IMAGE_CACHE &&
                     cacheName !== DOCUMENT_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy based on request type
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (isDocumentRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, DOCUMENT_CACHE));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
  }
});

// Helper: Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
}

// Helper: Check if request is for a document
function isDocumentRequest(request) {
  const url = new URL(request.url);
  return /\.(pdf|docx)$/i.test(url.pathname);
}

// Helper: Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
         url.pathname === '/' ||
         url.pathname.endsWith('.html');
}

// Strategy: Cache First (good for images and static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // If not in cache, fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache the response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Try to return cached version as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return a basic error response
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Strategy: Network First (good for dynamic content)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Network fetch failed:', error);
    
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache (fallback):', request.url);
      return cachedResponse;
    }

    // Return error response
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
