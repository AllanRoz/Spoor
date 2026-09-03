import React from 'react';
import { Check, Lock, Footprints, Globe2, Ruler, Beef, Image as ImageIcon } from 'lucide-react';
import { CLUE_SCORES } from '../utils/scoring.js';

export const CLUE_CONFIG = [
  { id: 1, label: 'Footprint', icon: Footprints, key: 'footprint' },
  { id: 2, label: 'Habitat', icon: Globe2, key: 'habitat' },
  { id: 3, label: 'Size', icon: Ruler, key: 'size' },
  { id: 4, label: 'Diet', icon: Beef, key: 'diet' },
  { id: 5, label: 'Animal Image', icon: ImageIcon, key: 'image' },
];

export function ClueProgress({
  cluesRevealed,
  activeClueTab,
  onSelectClueTab,
  availableClues = CLUE_CONFIG
}) {
  return (
    <div className="w-full bg-journal-100/90 dark:bg-stone-900/80 rounded-2xl p-3 border border-journal-300 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
          Clue Progression
        </span>
        <span className="text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
          Max: {CLUE_SCORES[cluesRevealed] || 20} pts
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {availableClues.map((clue) => {
          const isRevealed = clue.id <= cluesRevealed;
          const isSelected = clue.id === activeClueTab;
          const Icon = clue.icon;
          const points = CLUE_SCORES[clue.id];

          return (
            <button
              key={clue.id}
              type="button"
              disabled={!isRevealed}
              onClick={() => isRevealed && onSelectClueTab(clue.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 text-center ${
                !isRevealed
                  ? 'opacity-40 cursor-not-allowed bg-stone-200/50 dark:bg-stone-800/40 text-stone-500'
                  : isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-journal-200/70 dark:bg-stone-800 hover:bg-journal-300/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-1 right-1">
                {isRevealed ? (
                  <Check className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                ) : (
                  <Lock className="w-3 h-3 text-stone-400" />
                )}
              </div>

              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                {clue.label}
              </span>
              <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                {points}pts
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
