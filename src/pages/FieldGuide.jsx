import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Lock,
  CheckCircle,
  Filter,
  Sparkles,
  X,
  Footprints,
  Globe2,
  Ruler,
  Beef,
  MapPin,
  Shuffle
} from 'lucide-react';
import { ANIMALS, CATEGORIES, HABITATS } from '../data/animals.js';
import { FootprintDisplay } from '../components/FootprintDisplay.jsx';
import { AnimalImage } from '../components/AnimalImage.jsx';
import { playSound } from '../utils/sound.js';
import { triggerHaptic } from '../utils/haptics.js';

export function FieldGuide({ fieldGuide, settings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Animals');
  const [selectedHabitat, setSelectedHabitat] = useState('All Habitats');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'discovered' | 'undiscovered'
  const [inspectAnimal, setInspectAnimal] = useState(null);

  const discoveredCount = Object.keys(fieldGuide).length;
  const totalCount = ANIMALS.length;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100) || 0;

  // Filter animals based on search, category, habitat, and discovery status
  const filteredAnimals = ANIMALS.filter((animal) => {
    const isDiscovered = Boolean(fieldGuide[animal.id]);

    // Status filter
    if (statusFilter === 'discovered' && !isDiscovered) return false;
    if (statusFilter === 'undiscovered' && isDiscovered) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = isDiscovered && animal.name.toLowerCase().includes(q);
      const matchCat = animal.category.toLowerCase().includes(q);
      const matchHab = animal.habitats?.some(h => h.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchHab) return false;
    }

    // Category filter
    if (selectedCategory !== 'All Animals' && animal.category !== selectedCategory) {
      return false;
    }

    // Habitat filter
    if (selectedHabitat !== 'All Habitats' && (!animal.habitats || !animal.habitats.includes(selectedHabitat))) {
      return false;
    }

    return true;
  });

  const handleCardClick = (animal) => {
    const isDiscovered = Boolean(fieldGuide[animal.id]);
    if (isDiscovered) {
      triggerHaptic('light', settings?.hapticsEnabled);
      playSound('click', settings.soundEnabled);
      setInspectAnimal(animal);
    } else {
      triggerHaptic('warning', settings?.hapticsEnabled);
    }
  };

  const handleRandomStudy = () => {
    const discoveredList = ANIMALS.filter(a => Boolean(fieldGuide[a.id]));
    if (discoveredList.length === 0) return;
    const randomAnimal = discoveredList[Math.floor(Math.random() * discoveredList.length)];
    triggerHaptic('light', settings?.hapticsEnabled);
    playSound('click', settings.soundEnabled);
    setInspectAnimal(randomAnimal);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header & Progress Summary */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-journal-200 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Wildlife Encyclopedia</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
              My Field Guide
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-stone-900 px-4 py-3 rounded-2xl border border-journal-300 dark:border-stone-800 shadow-sm shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Field Progress
              </span>
              <span className="font-mono font-black text-xl text-stone-900 dark:text-stone-100">
                {discoveredCount} <span className="text-sm font-normal text-stone-400">/ {totalCount}</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-journal-200 dark:border-stone-800 flex items-center justify-center font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-journal-200 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white dark:bg-[#131d1a] p-5 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm space-y-4">
        {/* Search Input & Random Study */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discovered animals, categories, or habitats..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-journal-50 dark:bg-stone-900 border border-journal-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>

          {discoveredCount > 0 && (
            <button
              type="button"
              onClick={handleRandomStudy}
              className="px-4 py-2.5 rounded-xl bg-journal-100 hover:bg-journal-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors shrink-0"
              title="Inspect a random discovered species from your compendium"
            >
              <Shuffle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Study Random</span>
            </button>
          )}
        </div>

        {/* Discovery Status Filter */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Discovery Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: `All Species (${totalCount})` },
              { id: 'discovered', label: `✓ Discovered (${discoveredCount})` },
              { id: 'undiscovered', label: `🔒 Undiscovered (${totalCount - discoveredCount})` },
            ].map((status) => {
              const isSelected = statusFilter === status.id;
              return (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light', settings?.hapticsEnabled);
                    setStatusFilter(status.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-journal-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Category
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-journal-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-journal-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Habitat Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Habitat
          </span>
          <div className="flex flex-wrap gap-1.5">
            {HABITATS.map((hab) => {
              const isSelected = selectedHabitat === hab;
              return (
                <button
                  key={hab}
                  type="button"
                  onClick={() => setSelectedHabitat(hab)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-journal-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-journal-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {hab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredAnimals.map((animal) => {
          const discoveryRecord = fieldGuide[animal.id];
          const isDiscovered = Boolean(discoveryRecord);

          return (
            <div
              key={animal.id}
              onClick={() => handleCardClick(animal)}
              className={`rounded-2xl p-3 border transition-all duration-200 flex flex-col justify-between ${
                isDiscovered
                  ? 'bg-white dark:bg-[#131e1a] border-journal-300 dark:border-stone-800 hover:border-amber-500 hover:shadow-md cursor-pointer group'
                  : 'bg-journal-100/50 dark:bg-stone-900/40 border-dashed border-journal-300/60 dark:border-stone-800/80 opacity-60'
              }`}
            >
              {/* Card Image or Locked Mystery Box */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-journal-100 dark:bg-stone-800 mb-2 flex items-center justify-center">
                {isDiscovered ? (
                  <img
                    src={animal.image}
                    alt={animal.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      if (animal.rawImage && e.target.src !== animal.rawImage) {
                        e.target.src = animal.rawImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-stone-400 dark:text-stone-600">
                    <Lock className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-mono">Undiscovered</span>
                  </div>
                )}

                {isDiscovered && (
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-emerald-700/85 text-white shadow-sm">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400/90 block">
                  {animal.category}
                </span>

                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                  {isDiscovered ? animal.name : 'Unknown Species'}
                </h4>

                <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                  {isDiscovered ? animal.scientificName : (animal.habitats ? animal.habitats[0] : 'Biome Unknown')}
                </p>
              </div>

              {/* Discovery Stats Badge */}
              {isDiscovered && (
                <div className="mt-2 pt-1.5 border-t border-journal-100 dark:border-stone-800 text-[9px] font-mono text-stone-500 dark:text-stone-400 flex items-center justify-between">
                  <span>Best: {discoveryRecord.bestCluesUsed || 1} clues</span>
                  <span>×{discoveryRecord.discoveriesCount || 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-16 text-stone-400 dark:text-stone-600">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-serif text-lg">No matching animals found</p>
          <p className="text-xs">Try adjusting your category or habitat filters</p>
        </div>
      )}

      {/* Full Animal Inspection Modal */}
      {inspectAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setInspectAnimal(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#111a17] rounded-3xl p-6 sm:p-8 border-2 border-journal-300 dark:border-stone-700 shadow-2xl my-6 animate-scale-in relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectAnimal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-journal-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-block mb-2">
                {inspectAnimal.category}
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
                {inspectAnimal.name}
              </h2>
              <p className="text-sm font-serif italic text-stone-500">
                {inspectAnimal.scientificName}
              </p>
            </div>

            {/* Photo & Footprint Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Field Sighting
                </span>
                <AnimalImage animal={inspectAnimal} src={inspectAnimal.image} alt={inspectAnimal.name} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Animal Spoor
                </span>
                <FootprintDisplay animal={inspectAnimal} dimensionUnit={settings?.dimensionUnit} />
              </div>
            </div>

            {/* Habitat & Diet Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-journal-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-journal-200 dark:border-stone-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4" />
                  Habitat
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {inspectAnimal.habitat}
                </p>
              </div>

              <div className="bg-journal-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-journal-200 dark:border-stone-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <Beef className="w-4 h-4" />
                  Diet ({inspectAnimal.diet?.type})
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {inspectAnimal.diet?.description}
                </p>
              </div>
            </div>

            {/* Fun Facts */}
            {inspectAnimal.funFacts && inspectAnimal.funFacts.length > 0 && (
              <div className="bg-amber-50/70 dark:bg-stone-900/70 p-4 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Field Journal Insights
                </span>
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 leading-relaxed list-disc list-inside">
                  {inspectAnimal.funFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
