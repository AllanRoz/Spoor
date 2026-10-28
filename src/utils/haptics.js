// Gentle tactile haptic feedback for mobile devices (Android / supported iOS WebKit)

export function triggerHaptic(type = 'light', isEnabled = true) {
  if (!isEnabled) return;
  if (typeof window === 'undefined' || !navigator || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        // Soft button tap
        navigator.vibrate(20);
        break;
      case 'clue':
        // Distinct subtle flip
        navigator.vibrate([15, 30, 25]);
        break;
      case 'success':
        // Celebratory victory pattern
        navigator.vibrate([40, 50, 60, 50, 100]);
        break;
      case 'wrong':
        // Gentle double-buzz
        navigator.vibrate([60, 50, 60]);
        break;
      case 'warning':
        navigator.vibrate(50);
        break;
      default:
        navigator.vibrate(20);
    }
  } catch {
    // Ignore unsupported vibration context
  }
}
