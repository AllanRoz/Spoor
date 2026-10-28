import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  PlusSquare,
  CheckCircle,
  Smartphone,
  Apple,
  WifiOff,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  isAppleDevice,
  isIosSafari,
  isAndroidDevice,
  isRunningStandalone,
  triggerNativeInstall,
  onInstallPromptChange
} from '../utils/pwaHelper.js';
import { playSound } from '../utils/sound.js';
import { triggerHaptic } from '../utils/haptics.js';

export function PwaInstallModal({ isOpen, onClose, settings }) {
  const [nativePromptAvailable, setNativePromptAvailable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const isApple = isAppleDevice();
  const isSafari = isIosSafari();
  const isAndroid = isAndroidDevice();

  useEffect(() => {
    setIsStandalone(isRunningStandalone());
    const unsub = onInstallPromptChange((prompt) => {
      setNativePromptAvailable(Boolean(prompt));
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    triggerHaptic('light', settings?.hapticsEnabled);
    playSound('click', settings?.soundEnabled);
    const success = await triggerNativeInstall();
    if (success) {
      triggerHaptic('success', settings?.hapticsEnabled);
      playSound('correct', settings?.soundEnabled);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-journal-50 dark:bg-[#121f1a] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-journal-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-journal-200/50 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#102119] border-2 border-amber-600/40 p-2.5 shadow-md flex items-center justify-center shrink-0">
            <img
              src="./icons/icon-192x192.png"
              alt="Spoor App Icon"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3 h-3" />
              <span>Offline Web App</span>
            </div>
            <h2 className="font-serif font-black text-2xl text-stone-900 dark:text-stone-100">
              Install SPOOR
            </h2>
          </div>
        </div>

        {/* Offline feature pills */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-journal-100 dark:bg-stone-900/60 border border-journal-200 dark:border-stone-800/80 text-xs">
            <WifiOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-stone-700 dark:text-stone-300">100% Offline Play</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-journal-100 dark:bg-stone-900/60 border border-journal-200 dark:border-stone-800/80 text-xs">
            <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-medium text-stone-700 dark:text-stone-300">Full-Screen Native</span>
          </div>
        </div>

        {/* Dynamic platform content */}
        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <p className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
              SPOOR is already installed!
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              You are currently running the official standalone progressive web app with full offline capabilities.
            </p>
          </div>
        ) : isApple ? (
          /* iOS / iPadOS Instructions */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Apple className="w-4 h-4" />
                <span>Install on iPhone & iPad</span>
              </div>

              <div className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-stone-900 dark:text-stone-100">Share button</strong> (<Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-500" />) in the Safari toolbar at the bottom of your screen (or top on iPad).
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-stone-900 dark:text-stone-100">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-stone-600 dark:text-stone-300" />).
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-stone-900 dark:text-stone-100">"Add"</strong> in the top-right corner. SPOOR is now ready on your home screen with zero setup!
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 text-center italic">
              Works completely in airplane mode or deep in the wilderness without cellular signal!
            </p>
          </div>
        ) : nativePromptAvailable ? (
          /* Android / Desktop Chrome with native install prompt */
          <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Install SPOOR on your device to play offline anytime, track mystery animals with zero delay, and save battery life.
            </p>

            <button
              type="button"
              onClick={handleNativeInstall}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Install SPOOR Application</span>
            </button>
          </div>
        ) : (
          /* Android Chrome manual or fallback instructions */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <p className="font-bold text-stone-900 dark:text-stone-100">
                To install on your browser:
              </p>
              <p>
                Tap the browser menu (<strong>⋮</strong> or <strong>Share</strong>) and choose <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </p>
            </div>
            <p className="text-[11px] text-stone-500 text-center italic">
              All 107 tracks and clues work 100% offline once installed.
            </p>
          </div>
        )}

        {/* Footer dismissal */}
        <div className="mt-6 pt-4 border-t border-journal-200 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-journal-200 dark:hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
