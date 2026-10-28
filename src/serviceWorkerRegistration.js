// Service Worker Registration for Spoor PWA
// Compatible with both local dev and GitHub Pages subpaths

export function registerServiceWorker(onUpdateFound, onOfflineReady) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Only register over HTTPS or localhost
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  if (window.location.protocol !== 'https:' && !isLocalhost) {
    return;
  }

  window.addEventListener('load', () => {
    // Relative path to sw.js ensures compatibility with subpath hosting (GitHub Pages)
    const swUrl = './sw.js';

    navigator.serviceWorker
      .register(swUrl, { scope: './' })
      .then((registration) => {
        console.log('[Spoor PWA] Service Worker registered with scope:', registration.scope);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available; please refresh.
                console.log('[Spoor PWA] New update available. Reloading may be required.');
                if (onUpdateFound) onUpdateFound(registration);
              } else {
                // Content is cached for offline use.
                console.log('[Spoor PWA] App is ready for offline tracking!');
                if (onOfflineReady) onOfflineReady();
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[Spoor PWA] Service Worker registration failed:', error);
      });
  });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
