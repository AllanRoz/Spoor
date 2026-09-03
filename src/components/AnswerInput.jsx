import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, X } from 'lucide-react';
import { ANIMALS } from '../data/animals.js';

/**
 * Finds up to 5 closest matching animals based on user input.
 * Prioritizes exact matches, prefix matches, word starts, and substrings.
 */
function getClosestMatches(query, limit = 5) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  const scored = [];

  for (const animal of ANIMALS) {
    const nameLower = animal.name.toLowerCase();
    let score = 0;

    if (nameLower === q) {
      score = 100;
    } else if (nameLower.startsWith(q)) {
      score = 80;
    } else {
      // Check individual words (e.g. "Elephant" in "African Bush Elephant")
      const words = nameLower.split(/[\s-]+/);
      if (words.some((w) => w.startsWith(q))) {
        score = 60;
      } else if (nameLower.includes(q)) {
        score = 40;
      } else if (animal.aliases && animal.aliases.some((al) => al.toLowerCase().includes(q))) {
        score = 30;
      }
    }

    if (score > 0) {
      scored.push({ animal, score });
    }
  }

  // Sort by match quality, then by concise name length
  scored.sort((a, b) => b.score - a.score || a.animal.name.length - b.animal.name.length);

  return scored.slice(0, limit).map((item) => item.animal);
}

export function AnswerInput({
  onSubmitGuess,
  disabled,
  placeholder = 'Type your guess (e.g. Wolf, Elephant)...',
}) {
  const [guess, setGuess] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = getClosestMatches(guess, 5);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setGuess(val);
    setSelectedIndex(-1);
    setIsOpen(val.trim().length > 0);
  };

  const handleSelectAnimal = (animalName) => {
    setGuess(animalName);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSubmitGuess(animalName);
    setGuess('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectAnimal(suggestions[selectedIndex].name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim() || disabled) return;

    if (isOpen && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      handleSelectAnimal(suggestions[selectedIndex].name);
    } else {
      onSubmitGuess(guess.trim());
      setGuess('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-stone-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={handleInputChange}
            onFocus={() => guess.trim().length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-journal-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/15 shadow-sm text-base font-medium transition-all"
          />

          {guess && (
            <button
              type="button"
              onClick={() => {
                setGuess('');
                setIsOpen(false);
                if (inputRef.current) inputRef.current.focus();
              }}
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
      </form>

      {/* Suggested animals positioned directly UNDER the input bar (Max 5 closest matches) */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#131d1a] rounded-2xl border-2 border-journal-300 dark:border-stone-700 shadow-2xl overflow-hidden divide-y divide-journal-100 dark:divide-stone-800 animate-scale-in">
          <div className="px-3.5 py-1.5 bg-journal-50/80 dark:bg-stone-900/80 text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center justify-between">
            <span>Matching Animals</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
              {suggestions.length} closest
            </span>
          </div>

          {suggestions.map((animal, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={animal.id}
                type="button"
                onClick={() => handleSelectAnimal(animal.name)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors text-sm ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-semibold'
                    : 'hover:bg-journal-100/60 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-serif">{animal.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-journal-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-sans">
                    {animal.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
