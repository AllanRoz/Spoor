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
  Check
} from 'lucide-react';
import {
  saveStoredSettings,
  resetAllData,
  resetStatsData,
  resetFieldGuideData,
  saveStoredStats
} from '../utils/storage.js';
import { playSound } from '../utils/sound.js';

export function Settings({
  settings,
  onUpdateSettings,
  onUpdateStats,
  onUpdateFieldGuide,
  onUpdateDailyRecord
}) {
  const [confirmDialog, setConfirmDialog] = useState(null); // 'stats' | 'fieldGuide' | 'all'
  const [successToast, setSuccessToast] = useState('');

  const update = (partial) => {
    const updated = { ...settings, ...partial };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
    playSound('click', updated.soundEnabled);
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleExecuteReset = () => {
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
          <span>Preferences & Data</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
          Game Settings
        </h1>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

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
              Audio feedback for clicks, clues, success chimes, and streaks.
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
