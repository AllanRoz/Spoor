// SPOOR - Offline Progressive Web App Service Worker
// Version: 1.1.0

const CACHE_VERSION = 'spoor-v1.1.0';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Core static shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-maskable-192x192.png',
  './icons/icon-maskable-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/icon.svg'
];

// Offline fallback SVG for animal images when not cached
const OFFLINE_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="#14211a">
  <rect width="400" height="300" fill="#102119"/>
  <circle cx="200" cy="130" r="50" fill="#d97706" opacity="0.3"/>
  <path d="M185 140 C185 140 195 125 200 125 C205 125 215 140 215 140 C215 152 208 158 200 156 C192 158 185 152 185 140 Z" fill="#d97706"/>
  <circle cx="190" cy="115" r="5" fill="#d97706"/>
  <circle cx="202" cy="112" r="5.5" fill="#d97706"/>
  <circle cx="214" cy="116" r="5" fill="#d97706"/>
  <text x="200" y="210" text-anchor="middle" fill="#d97706" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Spoor Offline Field Archive</text>
  <text x="200" y="235" text-anchor="middle" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="12">Footprint & clues fully playable offline</text>
</svg>`;

// 1. Install event: pre-cache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching warning (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate event: purge outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== SHELL_CACHE && key !== IMAGE_CACHE) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: handle offline-first caching strategies
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // Ignore browser extensions or other protocols
  if (!url.protocol.startsWith('http')) return;

  // Strategy A: SPA Navigation / HTML requests
  // Try network first, falling back to cached index.html so HashRouter works anywhere offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const indexCached = await caches.match('./index.html') || await caches.match('./');
        return indexCached || Response.error();
      })
    );
    return;
  }

  // Strategy B: External animal photos (wsrv.nl, wikimedia, upload.wikimedia.org)
  const isImageRequest = req.destination === 'image' || url.hostname.includes('wsrv.nl') || url.hostname.includes('wikimedia');
  if (isImageRequest) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;

        return fetch(req).then((networkRes) => {
          if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
            const clone = networkRes.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(req, clone);
              // Clean image cache if too large (keep under 120 items)
              cache.keys().then((keys) => {
                if (keys.length > 120) {
                  cache.delete(keys[0]);
                }
              });
            });
          }
          return networkRes;
        }).catch(() => {
          // Offline fallback SVG
          return new Response(OFFLINE_IMAGE_SVG, {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        });
      })
    );
    return;
  }

  // Strategy C: Google Fonts and Web Fonts (Cache-first with long expiry)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        }).catch(() => caches.match(req));
      })
    );
    return;
  }

  // Strategy D: Static App Assets (JS, CSS, SVGs, Wasm)
  // Cache-first with network fallback and background update
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Fetch in background to update cache for next load
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      });
    })
  );
});

// 4. Message event
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
