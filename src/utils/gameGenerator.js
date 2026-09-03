// Game pool generator and mode configs for Spoor

import { ANIMALS } from '../data/animals.js';
import { Footprints, Globe2, Ruler, Beef, Image as ImageIcon } from 'lucide-react';

export const GAME_MODES = {
  classic: {
    id: 'classic',
    title: 'Classic Spoor',
    tagline: '5 progressive clues: 🐾 → 🌎 → 📏 → 🍖 → 🖼️',
    description: 'The standard 10-round tracking expedition with full progressive clues.',
    clueIds: [1, 2, 3, 4, 5],
    roundsTotal: 10,
  },
  quick: {
    id: 'quick',
    title: 'Quick Spoor',
    tagline: '3 clues: 🐾 → 🌎 → 🖼️',
    description: 'High-tempo rapid tracking with only footprint, habitat, and sighting photo.',
    clueIds: [1, 2, 5],
    roundsTotal: 5,
  },
  expert: {
    id: 'expert',
    title: 'Expert Tracker',
    tagline: 'Subtle clues only: 🐾 → 🌎 → 🍖 (No Photo)',
    description: 'True wilderness tracking: only spoor, habitat, and diet. No photo unless you give up!',
    clueIds: [1, 2, 4],
    roundsTotal: 10,
  },
  endless: {
    id: 'endless',
    title: 'Endless Expedition',
    tagline: 'Track animals until you choose to stop or lose your streak',
    description: 'Continuous mystery animal encounters. Track your highest score and longest streak.',
    clueIds: [1, 2, 3, 4, 5],
    roundsTotal: Infinity,
  },
};

const ALL_CLUES_MAP = {
  1: { id: 1, label: 'Footprint', icon: Footprints, key: 'footprint' },
  2: { id: 2, label: 'Habitat', icon: Globe2, key: 'habitat' },
  3: { id: 3, label: 'Size', icon: Ruler, key: 'size' },
  4: { id: 4, label: 'Diet', icon: Beef, key: 'diet' },
  5: { id: 5, label: 'Animal Image', icon: ImageIcon, key: 'image' },
};

export function getCluesForMode(modeId) {
  const mode = GAME_MODES[modeId] || GAME_MODES.classic;
  return mode.clueIds.map(id => ALL_CLUES_MAP[id]);
}

/**
 * Filter and shuffle animals for a game session
 */
export function generateGamePool({
  category = 'All Animals',
  habitat = 'All Habitats',
  difficulty = 'normal',
  excludeIds = []
}) {
  let pool = [...ANIMALS];

  // Exclude recently seen animals
  if (excludeIds.length > 0) {
    const excludedSet = new Set(excludeIds);
    const nonExcluded = pool.filter(a => !excludedSet.has(a.id));
    if (nonExcluded.length >= 10) {
      pool = nonExcluded;
    }
  }

  // Category filter
  if (category && category !== 'All Animals') {
    pool = pool.filter(a => a.category === category);
  }

  // Habitat filter
  if (habitat && habitat !== 'All Habitats') {
    pool = pool.filter(a => a.habitats && a.habitats.includes(habitat));
  }

  // Difficulty filter
  if (difficulty === 'easy') {
    pool = pool.filter(a => a.difficulty === 'easy');
  } else if (difficulty === 'hard') {
    pool = pool.filter(a => a.difficulty === 'hard' || a.difficulty === 'normal');
  }

  // Fallback if filters are too restrictive
  if (pool.length === 0) {
    pool = [...ANIMALS];
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}
