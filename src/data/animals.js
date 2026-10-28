import { MAMMALS } from './animals_mammals.js';
import { BIRDS } from './animals_birds.js';
import { REPTILES } from './animals_reptiles.js';
import { AMPHIBIANS, FISH, INVERTEBRATES } from './animals_aquatic_inverts.js';
import { EXTRA_ANIMALS } from './animals_extra.js';
import { EXPANSION_ANIMALS } from './animals_expansion.js';
import { ANIMAL_IMAGES } from './animal_images.js';

// Combine all animal datasets into one master collection
const rawList = [
  ...MAMMALS,
  ...BIRDS,
  ...REPTILES,
  ...AMPHIBIANS,
  ...FISH,
  ...INVERTEBRATES,
  ...EXTRA_ANIMALS,
  ...EXPANSION_ANIMALS
];

// Deduplicate by ID and attach verified resilient proxy image URLs
const uniqueMap = new Map();
for (const rawAnimal of rawList) {
  if (!uniqueMap.has(rawAnimal.id)) {
    const animal = { ...rawAnimal };
    const imgData = ANIMAL_IMAGES[animal.id];
    if (imgData) {
      animal.image = imgData.proxy;
      animal.rawImage = imgData.raw;
    } else if (animal.image) {
      animal.image = `https://wsrv.nl/?url=${encodeURIComponent(animal.image)}&w=800&fit=cover&q=80`;
    }
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
