import React, { useState } from 'react';
import { Send, Search, X } from 'lucide-react';
import { ANIMALS } from '../data/animals.js';

export function AnswerInput({ onSubmitGuess, disabled, placeholder = 'Type your guess (e.g. Wolf, Elephant)...' }) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim() || disabled) return;
    onSubmitGuess(guess.trim());
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-stone-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          list="animal-suggestions"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-journal-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/15 shadow-sm text-base font-medium transition-all"
        />

        {guess && (
          <button
            type="button"
            onClick={() => setGuess('')}
            className="absolute right-20 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={!guess.trim() || disabled}
          className="absolute right-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-amber-600 text-white font-semibold text-sm transition-all duration-150 flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>Guess</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Datalist for helpful autocomplete without spoiling answers */}
      <datalist id="animal-suggestions">
        {ANIMALS.map((a) => (
          <option key={a.id} value={a.name} />
        ))}
      </datalist>
    </form>
  );
}
