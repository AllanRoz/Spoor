import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Filter, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { GAME_MODES } from '../utils/gameGenerator.js';
import { CATEGORIES, HABITATS, DIFFICULTIES } from '../data/animals.js';
import { playSound } from '../utils/sound.js';

export function Setup({ settings }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode = searchParams.get('mode') || 'classic';
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [selectedCategory, setSelectedCategory] = useState('All Animals');
  const [selectedHabitat, setSelectedHabitat] = useState('All Habitats');
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');

  const handleStart = (e) => {
    e.preventDefault();
    playSound('click', settings.soundEnabled);
    const params = new URLSearchParams({
      start: 'true',
      mode: selectedMode,
      cat: selectedCategory,
      hab: selectedHabitat,
      diff: selectedDifficulty,
    });
    navigate(`/game?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-journal-200 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Expedition Configuration</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
          Choose Your Expedition
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Customize your tracking expedition mode, animal categories, and environment.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-8 bg-white dark:bg-[#131d1a] p-6 sm:p-8 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm">
        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Select Game Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(GAME_MODES).map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500 shadow-sm'
                      : 'border-journal-200 dark:border-stone-800 hover:border-journal-300 dark:hover:border-stone-700 bg-journal-50/50 dark:bg-stone-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {mode.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-journal-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {mode.id === 'endless' ? 'Infinite' : `${mode.roundsTotal} Qs`}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Animal Category Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-journal-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Habitat Filter */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Habitat / Biome Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {HABITATS.map((hab) => {
              const isSelected = selectedHabitat === hab;
              return (
                <button
                  key={hab}
                  type="button"
                  onClick={() => setSelectedHabitat(hab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-journal-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {hab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'easy', label: 'Easy', desc: 'Iconic animals' },
              { id: 'normal', label: 'Normal', desc: 'All 107 species' },
              { id: 'hard', label: 'Hard', desc: 'Rare & challenging' },
            ].map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-journal-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="text-sm block">{diff.label}</span>
                  <span className="text-[10px] text-stone-400">{diff.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all duration-150"
        >
          <span>Start Tracking Expedition</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
