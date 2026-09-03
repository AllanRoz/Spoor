import React, { useState } from 'react';
import {
  BarChart2,
  Flame,
  Award,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { CATEGORIES } from '../data/animals.js';
import { resetStatsData, saveStoredStats } from '../utils/storage.js';
import { playSound } from '../utils/sound.js';

export function Statistics({ stats, onUpdateStats, settings }) {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const totalAttempted = (stats.correctCount || 0) + (stats.incorrectCount || 0);
  const accuracy = totalAttempted > 0
    ? Math.round(((stats.correctCount || 0) / totalAttempted) * 100)
    : 100;

  const avgClues = (stats.correctCount || 0) > 0
    ? ((stats.cluesUsedTotal || 0) / stats.correctCount).toFixed(1)
    : '0.0';

  const avgAttempts = (stats.correctCount || 0) > 0
    ? ((stats.attemptsTotal || 0) / stats.correctCount).toFixed(1)
    : '0.0';

  const handleResetStats = () => {
    resetStatsData();
    const emptyStats = {
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
    saveStoredStats(emptyStats);
    onUpdateStats(emptyStats);
    setResetConfirmOpen(false);
    playSound('click', settings.soundEnabled);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-journal-200 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
            <BarChart2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Tracking Performance</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Field Statistics
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setResetConfirmOpen(true)}
          className="text-xs font-bold text-stone-500 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Stats
        </button>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#131d1a] p-5 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Current Streak
          </span>
          <div className="flex items-center justify-center gap-1.5 text-3xl font-mono font-black text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            <span>{stats.currentStreak || 0}</span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">Record: {stats.highestStreak || 0}</span>
        </div>

        <div className="bg-white dark:bg-[#131d1a] p-5 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Accuracy Rate
          </span>
          <span className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400 block">
            {accuracy}%
          </span>
          <span className="text-[11px] text-stone-500 font-mono">{stats.correctCount || 0} / {totalAttempted} solves</span>
        </div>

        <div className="bg-white dark:bg-[#131d1a] p-5 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Avg Clues Used
          </span>
          <span className="text-3xl font-mono font-black text-blue-600 dark:text-blue-400 block">
            {avgClues}
          </span>
          <span className="text-[11px] text-stone-500 font-mono">out of 5 clues</span>
        </div>

        <div className="bg-white dark:bg-[#131d1a] p-5 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Perfect Identifications
          </span>
          <span className="text-3xl font-mono font-black text-purple-600 dark:text-purple-400 block">
            {stats.perfectGames || 0}
          </span>
          <span className="text-[11px] text-stone-500 font-mono">Solved on Clue 1</span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-journal-100/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-journal-200 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Animals Solved
          </span>
          <span className="text-xl font-mono font-bold text-stone-800 dark:text-stone-200">
            {stats.correctCount || 0}
          </span>
        </div>

        <div className="bg-journal-100/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-journal-200 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Gave Up / Missed
          </span>
          <span className="text-xl font-mono font-bold text-stone-800 dark:text-stone-200">
            {stats.incorrectCount || 0}
          </span>
        </div>

        <div className="bg-journal-100/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-journal-200 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Avg Attempts / Solve
          </span>
          <span className="text-xl font-mono font-bold text-stone-800 dark:text-stone-200">
            {avgAttempts}
          </span>
        </div>

        <div className="bg-journal-100/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-journal-200 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Total Guesses Made
          </span>
          <span className="text-xl font-mono font-bold text-stone-800 dark:text-stone-200">
            {stats.attemptsTotal || 0}
          </span>
        </div>
      </div>

      {/* Accuracy By Category */}
      <div className="bg-white dark:bg-[#131d1a] p-6 sm:p-8 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Accuracy by Animal Category
        </h3>

        <div className="space-y-4">
          {CATEGORIES.filter(c => c !== 'All Animals').map((cat) => {
            const catData = stats.categoryStats?.[cat] || { played: 0, correct: 0 };
            const catAcc = catData.played > 0
              ? Math.round((catData.correct / catData.played) * 100)
              : 0;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-stone-800 dark:text-stone-200">{cat}</span>
                  <span className="font-mono text-stone-500 dark:text-stone-400">
                    {catData.correct} / {catData.played} ({catAcc}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-journal-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-600 dark:bg-amber-500 transition-all duration-300"
                    style={{ width: `${catAcc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-red-500/40 shadow-2xl text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                Reset Statistics?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                This will erase your games played, streak records, and category accuracy. Field Guide discoveries will be preserved.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetStats}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                Yes, Reset Statistics
              </button>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm active:scale-95 transition-all"
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
