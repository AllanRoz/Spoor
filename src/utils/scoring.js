// Scoring calculator for Spoor

export const CLUE_SCORES = {
  1: 100, // Footprint
  2: 80,  // Habitat
  3: 60,  // Size
  4: 40,  // Diet
  5: 20,  // Image
};

/**
 * Calculates score earned for a round.
 * @param {number} cluesRevealed - Clues unlocked (1 to 5)
 * @param {number} wrongGuessesCount - Number of incorrect attempts before solving
 * @param {boolean} hasSpellingCorrection - True if solved via fuzzy misspelling confirmation
 * @param {boolean} usedHint - True if additional hint was used
 */
export function calculateRoundScore({
  cluesRevealed = 1,
  wrongGuessesCount = 0,
  hasSpellingCorrection = false,
  usedHint = false,
}) {
  const baseScore = CLUE_SCORES[cluesRevealed] || 20;

  // Penalize for multiple wrong guesses (-5 per wrong guess after the 1st)
  const penaltyForAttempts = Math.max(0, wrongGuessesCount) * 5;

  let calculated = Math.max(10, baseScore - penaltyForAttempts);

  // If spelling correction was used, deduct 25%
  if (hasSpellingCorrection) {
    calculated = Math.round(calculated * 0.75);
  }

  // If hint used, deduct 10%
  if (usedHint) {
    calculated = Math.round(calculated * 0.9);
  }

  return Math.max(10, calculated);
}
