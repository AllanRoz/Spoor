import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBadge() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showToast) return null;

  return (
    <aside
      aria-label="Network status"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-xs animate-slide-up"
    >
      {!isOnline ? (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900/90 text-amber-400 border border-amber-600/40 shadow-xl backdrop-blur-md text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Offline Mode — 100% Playable</span>
        </div>
      ) : showToast ? (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-950/90 text-emerald-300 border border-emerald-600/40 shadow-xl backdrop-blur-md text-xs font-medium animate-fade-in">
          <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Back Online!</span>
        </div>
      ) : null}
    </aside>
  );
}
