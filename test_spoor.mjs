import { ANIMALS, ANIMAL_MAP, CATEGORIES, HABITATS } from './src/data/animals.js';
import { normalizeAnswer, levenshteinDistance, evaluateGuess } from './src/utils/answerMatching.js';
import { calculateRoundScore, CLUE_SCORES } from './src/utils/scoring.js';
import { getDailyAnimal, getDailyPuzzleNumber, formatDailyShareText, getUtcDateKey } from './src/utils/dailySpoor.js';
import { generateGamePool, GAME_MODES, getCluesForMode } from './src/utils/gameGenerator.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`✓ ${message}`);
  } else {
    failed++;
    console.error(`✗ FAIL: ${message}`);
  }
}

console.log('--- 1. Testing Animal Dataset ---');
assert(ANIMALS.length >= 100, `Dataset contains at least 100 animals (found ${ANIMALS.length})`);

const categoriesFound = new Set(ANIMALS.map(a => a.category));
['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate'].forEach(cat => {
  assert(categoriesFound.has(cat), `Category '${cat}' is present in dataset`);
});

ANIMALS.forEach(animal => {
  const hasFields = animal.id && animal.name && animal.category && animal.footprint?.type &&
    animal.footprint?.dimensions && animal.habitat && animal.size?.weight && animal.diet?.description &&
    animal.image && Array.isArray(animal.funFacts) && animal.funFacts.length > 0;
  if (!hasFields) {
    console.error('Incomplete animal data:', animal);
  }
});
assert(ANIMALS.every(a => a.id && a.name && a.footprint && a.habitat && a.size && a.diet && a.image), 'All animals have required biological fields');

console.log('\n--- 2. Testing Answer Matching & Fuzzy Spelling ---');
const wolf = ANIMAL_MAP.get('gray-wolf');
assert(evaluateGuess('Gray Wolf', wolf).status === 'EXACT', 'Exact match "Gray Wolf" succeeds');
assert(evaluateGuess('gray wolf', wolf).status === 'EXACT', 'Lowercase "gray wolf" succeeds');
assert(evaluateGuess('  GRAY WOLF  ', wolf).status === 'EXACT', 'Whitespace-trimmed match succeeds');
assert(evaluateGuess('The Gray Wolf', wolf).status === 'EXACT', 'Leading article "The Gray Wolf" succeeds');
assert(evaluateGuess('wolf', wolf).status === 'EXACT', 'Alias "wolf" succeeds');
assert(evaluateGuess('grey wolf', wolf).status === 'EXACT', 'Alias "grey wolf" succeeds');

// Test fuzzy spelling
const elephant = ANIMAL_MAP.get('african-elephant');
const fuzzyResult = evaluateGuess('elefant', elephant);
assert(fuzzyResult.status === 'FUZZY', 'Misspelling "elefant" triggers FUZZY status');
assert(fuzzyResult.suggestedName === 'African Bush Elephant', `Fuzzy suggestion returns target name "${fuzzyResult.suggestedName}"`);

const wrongResult = evaluateGuess('Giraffe', wolf);
assert(wrongResult.status === 'WRONG', 'Incorrect animal returns WRONG status');

console.log('\n--- 3. Testing Scoring System ---');
assert(calculateRoundScore({ cluesRevealed: 1, wrongGuessesCount: 0 }) === 100, 'Score after footprint is 100');
assert(calculateRoundScore({ cluesRevealed: 2, wrongGuessesCount: 0 }) === 80, 'Score after habitat is 80');
assert(calculateRoundScore({ cluesRevealed: 3, wrongGuessesCount: 0 }) === 60, 'Score after size is 60');
assert(calculateRoundScore({ cluesRevealed: 4, wrongGuessesCount: 0 }) === 40, 'Score after diet is 40');
assert(calculateRoundScore({ cluesRevealed: 5, wrongGuessesCount: 0 }) === 20, 'Score after image is 20');
assert(calculateRoundScore({ cluesRevealed: 1, wrongGuessesCount: 0, hasSpellingCorrection: true }) === 75, 'Spelling penalty reduces score by 25% (100 -> 75)');
assert(calculateRoundScore({ cluesRevealed: 1, wrongGuessesCount: 2 }) === 90, 'Two wrong guesses reduce score by 10 points (100 -> 90)');

console.log('\n--- 4. Testing Daily Spoor ---');
const todayDate = getUtcDateKey();
const daily1 = getDailyAnimal(todayDate);
const daily2 = getDailyAnimal(todayDate);
assert(daily1.id === daily2.id, `Daily animal is deterministic for date (${daily1.name})`);

const shareText = formatDailyShareText({
  dateKey: todayDate,
  cluesUsed: 3,
  guessesCount: 1,
  won: true,
  score: 60
});
assert(shareText.includes('Spoor 🐾'), 'Share text contains header');
assert(!shareText.includes(daily1.name), 'Share text DOES NOT spoil the animal name');
assert(shareText.includes('🐾 🟩') && shareText.includes('🌎 🟩'), 'Share text contains progressive clue emojis');

console.log('\n--- 5. Testing Game Pool Generator ---');
const classicPool = generateGamePool({ category: 'Mammal' });
assert(classicPool.every(a => a.category === 'Mammal'), 'Category filter properly restricts pool to Mammals');

const quickClues = getCluesForMode('quick');
assert(quickClues.length === 3, 'Quick mode has exactly 3 clues');

const expertClues = getCluesForMode('expert');
assert(expertClues.length === 3 && !expertClues.some(c => c.id === 5), 'Expert mode has no image clue');

console.log('\n--- 6. Testing Dimension Unit Conversion ---');
import('./src/utils/dimensions.js').then(({ formatDimension, getPerspectiveSpecs }) => {
  const metricSample = '11–13 cm long, 9–11 cm wide';
  assert(formatDimension(metricSample, 'cm') === metricSample, 'Metric dimensions remain intact in cm mode');

  const inchSample = formatDimension(metricSample, 'in');
  assert(inchSample === '4.3–5.1 in long, 3.5–4.3 in wide', `Correctly converts cm range to inches: "${inchSample}"`);

  const singleCm = formatDimension('30 cm across', 'in');
  assert(singleCm === '11.8 in across', `Correctly converts single cm to inches: "${singleCm}"`);

  const orcaSample = formatDimension('Dorsal fin height up to 1.8 meters (6 ft)', 'in');
  assert(orcaSample === 'Dorsal fin height up to 6 ft', `Correctly extracts parenthetical imperial note: "${orcaSample}"`);

  const specsCm = getPerspectiveSpecs('cm');
  const specsIn = getPerspectiveSpecs('in');
  assert(specsCm.hand.svgLabel === 'Hand (19cm)' && specsIn.hand.svgLabel === 'Hand (7.5 in)', 'Perspective specs adjust per unit');

  // Verify all 107 animals can be converted to inches without NaN
  let allValid = true;
  ANIMALS.forEach(animal => {
    const converted = formatDimension(animal.footprint.dimensions, 'in');
    if (converted.includes('NaN')) allValid = false;
  });
  assert(allValid, `All ${ANIMALS.length} animal dimensions convert to inches without NaN`);

  console.log(`\n=============================`);
  console.log(`Tests: ${passed} passed, ${failed} failed.`);
  console.log(`=============================`);

  if (failed > 0) {
    process.exit(1);
  }
});
