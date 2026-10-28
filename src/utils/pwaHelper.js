// Progressive Web App helper for Apple iOS and Android devices

let deferredInstallPrompt = null;
const installListeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar or auto prompt
    e.preventDefault();
    deferredInstallPrompt = e;
    installListeners.forEach(listener => listener(e));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installListeners.forEach(listener => listener(null));
    console.log('[Spoor PWA] Application installed successfully!');
  });
}

/**
 * Check if the app is currently running in standalone (installed) mode
 */
export function isRunningStandalone() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if the user is on an Apple device (iPhone, iPad, iPod)
 */
export function isAppleDevice() {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIOS || isIPadOS;
}

/**
 * Check if the user is on an Android device
 */
export function isAndroidDevice() {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent || '');
}

/**
 * Check if the browser is Safari on iOS
 */
export function isIosSafari() {
  if (!isAppleDevice()) return false;
  const userAgent = navigator.userAgent || '';
  const isWebkit = /WebKit/i.test(userAgent);
  const isChromeOrFirefox = /CriOS|FxiOS|EdgiOS/i.test(userAgent);
  return isWebkit && !isChromeOrFirefox;
}

/**
 * Subscribe to beforeinstallprompt event updates
 */
export function onInstallPromptChange(callback) {
  installListeners.add(callback);
  callback(deferredInstallPrompt);
  return () => installListeners.delete(callback);
}

/**
 * Trigger native install prompt (Android / Desktop Chrome)
 */
export async function triggerNativeInstall() {
  if (!deferredInstallPrompt) return false;
  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installListeners.forEach(listener => listener(null));
    return outcome === 'accepted';
  } catch (err) {
    console.error('Install prompt error:', err);
    return false;
  }
}
