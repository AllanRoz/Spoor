import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Check, X } from 'lucide-react';

export function FuzzySpellingModal({
  isOpen,
  suggestedName,
  inputGuess,
  onConfirm,
  onReject
}) {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-black/95 dark:bg-[#060b09]/98 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-amber-500/40 shadow-2xl text-center my-auto animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-7 h-7" />
        </div>

        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mb-1">
          Check Spelling
        </h3>

        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
          You entered: <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">"{inputGuess}"</span>
        </p>

        <p className="text-base text-stone-800 dark:text-stone-200 mb-4">
          Did you mean <strong className="text-amber-600 dark:text-amber-400 text-lg font-serif underline">{suggestedName}</strong>?
        </p>

        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 bg-amber-50 dark:bg-stone-800/80 p-2.5 rounded-xl border border-amber-200 dark:border-stone-700">
          ✏️ If confirmed, this counts as correct with a 25% spelling penalty.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            Yes, that's what I meant
          </button>

          <button
            type="button"
            onClick={onReject}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
            No, try again
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
