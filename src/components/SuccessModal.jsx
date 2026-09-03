import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, BookOpen, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { AnimalImage } from './AnimalImage.jsx';

export function SuccessModal({
  isOpen,
  animal,
  scoreEarned,
  cluesUsed,
  attempts,
  currentStreak,
  hasSpellingPenalty,
  isDaily = false,
  onNext,
  onShare
}) {
  useEffect(() => {
    if (isOpen) {
      // Fire festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#059669', '#2563eb', '#dc2626', '#ca8a04'],
      });
    }
  }, [isOpen]);

  if (!isOpen || !animal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111a17] rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/50 shadow-2xl my-6 animate-scale-in">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Spoor Identified!
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Streak: {currentStreak}
          </div>
        </div>

        {/* Animal Title & Sighting Image */}
        <div className="text-center mb-4">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            {animal.name}
          </h2>
          <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400">
            {animal.scientificName} • {animal.category}
          </p>
        </div>

        <div className="mb-4">
          <AnimalImage animal={animal} src={animal.image} alt={animal.name} />
        </div>

        {/* Score & Stats Pill Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-journal-50 dark:bg-stone-900/80 p-2.5 rounded-xl border border-journal-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
              Score
            </span>
            <span className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
              +{scoreEarned}
            </span>
          </div>

          <div className="bg-journal-50 dark:bg-stone-900/80 p-2.5 rounded-xl border border-journal-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
              Clues Used
            </span>
            <span className="text-lg font-mono font-bold text-stone-800 dark:text-stone-200">
              {cluesUsed} / 5
            </span>
          </div>

          <div className="bg-journal-50 dark:bg-stone-900/80 p-2.5 rounded-xl border border-journal-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
              Attempts
            </span>
            <span className="text-lg font-mono font-bold text-stone-800 dark:text-stone-200">
              {attempts}
            </span>
          </div>
        </div>

        {hasSpellingPenalty && (
          <p className="text-[11px] text-center text-amber-700 dark:text-amber-400 mb-3 bg-amber-50 dark:bg-amber-950/40 py-1 px-2 rounded-lg">
            ✏️ -25% applied for spelling assistance
          </p>
        )}

        {/* Field Guide Entry Badge */}
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-field-50 dark:bg-field-950/40 border border-field-200 dark:border-field-800/60 text-xs text-field-900 dark:text-field-200 font-medium">
          <BookOpen className="w-4 h-4 text-field-600 dark:text-field-400 flex-shrink-0" />
          <span>Added to <strong>My Field Guide</strong> discovery record!</span>
        </div>

        {/* Animal Fun Facts */}
        {animal.funFacts && animal.funFacts.length > 0 && (
          <div className="mb-5 bg-journal-100/70 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-journal-200 dark:border-stone-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1.5">
              Field Journal Notes
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed list-disc list-inside">
              {animal.funFacts.slice(0, 2).map((fact, idx) => (
                <li key={idx} className="line-clamp-2">{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {isDaily && onShare && (
            <button
              type="button"
              onClick={onShare}
              className="flex-1 py-3 px-4 rounded-xl bg-journal-200 hover:bg-journal-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <span>{isDaily ? 'Done' : 'Next Animal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
