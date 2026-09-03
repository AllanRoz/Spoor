import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { AnimalImage } from './AnimalImage.jsx';

export function GiveUpModal({
  isOpen,
  animal,
  onNext,
  isDaily = false
}) {
  // Lock body scroll when modal is open to prevent background shifting
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !animal) return null;

  // Render via React Portal directly into document.body to break out of all parent stacking contexts
  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-black/95 dark:bg-[#060b09]/98 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#151b19] rounded-3xl p-6 sm:p-7 border-2 border-stone-300 dark:border-stone-700 shadow-2xl my-auto animate-scale-in text-center relative">
        {/* Header Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Mystery Animal Revealed</span>
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mb-1">
          {animal.name}
        </h2>
        <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 mb-4">
          {animal.scientificName} • {animal.category}
        </p>

        <div className="mb-4">
          <AnimalImage animal={animal} src={animal.image} alt={animal.name} />
        </div>

        {animal.funFacts && animal.funFacts.length > 0 && (
          <div className="mb-5 bg-journal-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-journal-200 dark:border-stone-800 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
              Did you know?
            </span>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
              "{animal.funFacts[0]}"
            </p>
          </div>
        )}

        <p className="text-xs text-amber-700 dark:text-amber-400 mb-5 font-medium">
          🔥 Spoor Streak has been reset. Keep investigating!
        </p>

        <button
          type="button"
          onClick={onNext}
          className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <span>{isDaily ? 'Back to Daily' : 'Next Mystery Animal'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
