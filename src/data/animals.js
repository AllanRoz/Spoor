import { MAMMALS } from './animals_mammals.js';
import { BIRDS } from './animals_birds.js';
import { REPTILES } from './animals_reptiles.js';
import { AMPHIBIANS, FISH, INVERTEBRATES } from './animals_aquatic_inverts.js';
import { EXTRA_ANIMALS } from './animals_extra.js';

// Combine all animal datasets into one master collection
const rawList = [
  ...MAMMALS,
  ...BIRDS,
  ...REPTILES,
  ...AMPHIBIANS,
  ...FISH,
  ...INVERTEBRATES,
  ...EXTRA_ANIMALS
];

// Deduplicate by ID just in case
const uniqueMap = new Map();
for (const animal of rawList) {
  if (!uniqueMap.has(animal.id)) {
    uniqueMap.set(animal.id, animal);
  }
}

export const ANIMALS = Array.from(uniqueMap.values());
export const ANIMAL_MAP = uniqueMap;

export const CATEGORIES = [
  'All Animals',
  'Mammal',
  'Bird',
  'Reptile',
  'Amphibian',
  'Fish',
  'Invertebrate'
];

export const HABITATS = [
  'All Habitats',
  'Forest',
  'Desert',
  'Grassland',
  'Arctic',
  'Ocean',
  'Freshwater',
  'Mountains',
  'Wetlands',
  'Savanna',
  'Urban'
];

export const DIFFICULTIES = ['easy', 'normal', 'hard', 'expert'];
