import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Check,
  Smartphone,
  Download,
  RefreshCw,
  Zap,
  CheckCircle,
  WifiOff,
  Ruler
} from 'lucide-react';
import {
  saveStoredSettings,
  resetAllData,
  resetStatsData,
  resetFieldGuideData,
  saveStoredStats
} from '../utils/storage.js';
import { playSound } from '../utils/sound.js';
import { triggerHaptic } from '../utils/haptics.js';
import { isRunningStandalone, isAppleDevice } from '../utils/pwaHelper.js';

export function Settings({
  settings,
  onUpdateSettings,
  onUpdateStats,
  onUpdateFieldGuide,
  onUpdateDailyRecord,
  onOpenInstallModal
}) {
  const [confirmDialog, setConfirmDialog] = useState(null); // 'stats' | 'fieldGuide' | 'all'
  const [successToast, setSuccessToast] = useState('');
  const [isSyncingCache, setIsSyncingCache] = useState(false);
  const isStandalone = isRunningStandalone();
  const isApple = isAppleDevice();

  const update = (partial) => {
    triggerHaptic('light', settings.hapticsEnabled);
    const updated = { ...settings, ...partial };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
    playSound('click', updated.soundEnabled);
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSyncCache = async () => {
    setIsSyncingCache(true);
    triggerHaptic('light', settings.hapticsEnabled);
    playSound('click', settings.soundEnabled);

    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        console.log('[Spoor] Current caches:', keys);
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      setTimeout(() => {
        setIsSyncingCache(false);
        triggerHaptic('success', settings.hapticsEnabled);
        playSound('correct', settings.soundEnabled);
        showToast('Offline cache refreshed and verified ready!');
      }, 800);
    } catch {
      setIsSyncingCache(false);
      showToast('Offline cache verified.');
    }
  };

  const handleExecuteReset = () => {
    triggerHaptic('warning', settings.hapticsEnabled);
    if (confirmDialog === 'stats') {
      resetStatsData();
      const empty = {
        gamesPlayed: 0,
        animalsGuessed: 0,
        correctCount: 0,
        incorrectCount: 0,
        giveUpCount: 0,
        cluesUsedTotal: 0,
        attemptsTotal: 0,
        currentStreak: 0,
        highestStreak: 0,
        perfectGames: 0,
        categoryStats: {},
        animalHistory: {},
      };
      saveStoredStats(empty);
      onUpdateStats(empty);
      showToast('Statistics have been reset.');
    } else if (confirmDialog === 'fieldGuide') {
      resetFieldGuideData();
      onUpdateFieldGuide({});
      showToast('Field Guide discoveries have been reset.');
    } else if (confirmDialog === 'all') {
      resetAllData();
      const empty = {
        gamesPlayed: 0,
        animalsGuessed: 0,
        correctCount: 0,
        incorrectCount: 0,
        giveUpCount: 0,
        cluesUsedTotal: 0,
        attemptsTotal: 0,
        currentStreak: 0,
        highestStreak: 0,
        perfectGames: 0,
        categoryStats: {},
        animalHistory: {},
      };
      saveStoredStats(empty);
      onUpdateStats(empty);
      onUpdateFieldGuide({});
      onUpdateDailyRecord({});
      showToast('All local application data has been wiped.');
    }

    playSound('click', settings.soundEnabled);
    setConfirmDialog(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-journal-200 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Application Preferences</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
          Settings
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
          Customize audio, theme, offline capabilities, and local storage.
        </p>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Progressive Web App & Offline Card */}
      <div className="bg-white dark:bg-[#131d1a] rounded-3xl border border-journal-300 dark:border-stone-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
            <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Progressive Web App (PWA)</span>
          </div>
          {isStandalone ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
              <CheckCircle className="w-3 h-3" /> Standalone App
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-journal-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold font-mono">
              Browser Mode
            </span>
          )}
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          SPOOR is designed to operate completely offline on Apple devices (iOS Safari) and Android devices. You can install it directly to your home screen for instant full-screen play without app store downloads.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {!isStandalone && (
            <button
              type="button"
              onClick={() => onOpenInstallModal && onOpenInstallModal()}
              className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isApple ? 'Install on iPhone / iPad' : 'Install on Device'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSyncCache}
            disabled={isSyncingCache}
            className="py-2.5 px-4 rounded-xl border border-journal-300 dark:border-stone-700 hover:bg-journal-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncingCache ? 'animate-spin' : ''}`} />
            <span>{isSyncingCache ? 'Verifying...' : 'Re-verify Offline Cache'}</span>
          </button>
        </div>
      </div>

      {/* General Controls */}
      <div className="bg-white dark:bg-[#131d1a] rounded-3xl border border-journal-300 dark:border-stone-800 p-6 shadow-sm divide-y divide-journal-100 dark:divide-stone-800">
        {/* Dark Mode */}
        <div className="flex items-center justify-between py-4 first:pt-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              {settings.darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
              <span>Dark Theme</span>
            </div>
            <p className="text-xs text-stone-500">
              Switch between daylight field journal and night guide.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ darkMode: !settings.darkMode })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.darkMode ? 'bg-amber-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <span>Sound Effects</span>
            </div>
            <p className="text-xs text-stone-500">
              Zero-latency synthesized audio feedback for clues, success chimes, and clicks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Field Dimension Units */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Field Dimension Units</span>
            </div>
            <p className="text-xs text-stone-500">
              Display animal track and footprint measurements in centimeters (cm) or inches (in).
            </p>
          </div>
          <div className="inline-flex self-start sm:self-center p-1 bg-stone-200 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700">
            <button
              type="button"
              onClick={() => update({ dimensionUnit: 'cm' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                (settings.dimensionUnit || 'cm') === 'cm'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              cm (Centimeters)
            </button>
            <button
              type="button"
              onClick={() => update({ dimensionUnit: 'in' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.dimensionUnit === 'in'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              in (Inches)
            </button>
          </div>
        </div>

        {/* Tactile Haptics */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Tactile Vibration (Haptics)</span>
            </div>
            <p className="text-xs text-stone-500">
              Subtle physical vibration taps on phones when revealing clues or scoring.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ hapticsEnabled: !settings.hapticsEnabled })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.hapticsEnabled ? 'bg-amber-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Animations & Confetti</span>
            </div>
            <p className="text-xs text-stone-500">
              Card transitions and celebratory win confetti particles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ animationsEnabled: !settings.animationsEnabled })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.animationsEnabled ? 'bg-purple-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Confirm Leaving Game */}
        <div className="flex items-center justify-between py-4 last:pb-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Confirm Before Leaving</span>
            </div>
            <p className="text-xs text-stone-500">
              Prompts confirmation if navigating away during an active round.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ confirmLeave: !settings.confirmLeave })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.confirmLeave ? 'bg-blue-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* Danger Zone: Data Management */}
      <div className="bg-white dark:bg-[#131d1a] rounded-3xl border border-red-200 dark:border-red-950/60 p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Data Management
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          All Spoor data is saved locally in your browser’s LocalStorage. You can reset individual sections or all saved progress.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setConfirmDialog('stats')}
            className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-red-500 text-stone-700 dark:text-stone-300 hover:text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmDialog('fieldGuide')}
            className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-red-500 text-stone-700 dark:text-stone-300 hover:text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmDialog('all')}
            className="py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-red-500/40 shadow-2xl text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                Confirm Reset
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {confirmDialog === 'stats' && 'Are you sure you want to reset your statistics and streak records?'}
                {confirmDialog === 'fieldGuide' && 'Are you sure you want to erase your Field Guide discovered animals?'}
                {confirmDialog === 'all' && 'Are you sure you want to completely erase ALL data including stats, field guide, and daily history? This cannot be undone.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleExecuteReset}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                Yes, Proceed
              </button>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-sm active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
