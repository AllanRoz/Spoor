// Intelligent answer matching and fuzzy spelling detector for Spoor

/**
 * Normalizes input string:
 * - Converts to lowercase
 * - Strips diacritics / accents
 * - Strips leading articles ("the", "a", "an")
 * - Replaces hyphens, underscores, apostrophes, and punctuation with spaces
 * - Collapses repeated whitespace
 */
export function normalizeAnswer(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/^the\s+|^an\s+|^a\s+/i, '') // remove leading articles
    .replace(/['"’`\-_/\\.,;:!?()[\]{}]/g, ' ') // convert punctuation to spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein distance calculation
 */
export function levenshteinDistance(a, b) {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = [];
  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Similarity ratio between 0 and 1
 */
export function similarityScore(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(a, b);
  return 1 - dist / maxLen;
}

/**
 * Evaluates a user guess against the target animal.
 * Returns one of:
 * - { status: 'EXACT' }
 * - { status: 'FUZZY', suggestedName: string }
 * - { status: 'WRONG' }
 */
export function evaluateGuess(rawGuess, targetAnimal) {
  const guessNorm = normalizeAnswer(rawGuess);
  if (!guessNorm) {
    return { status: 'EMPTY' };
  }

  const validAnswers = [
    normalizeAnswer(targetAnimal.name),
    ...(targetAnimal.aliases || []).map(normalizeAnswer)
  ].filter(Boolean);

  // 1. Direct exact match check
  for (const valid of validAnswers) {
    if (guessNorm === valid) {
      return { status: 'EXACT' };
    }
  }

  // 2. Fuzzy spelling check against target animal
  for (const valid of validAnswers) {
    const dist = levenshteinDistance(guessNorm, valid);
    const score = similarityScore(guessNorm, valid);

    // Dynamic fuzzy threshold based on word length:
    // For words length >= 4, allow distance <= 2 with similarity >= 0.75
    // For words length >= 8, allow distance <= 3 with similarity >= 0.72
    const isFuzzy =
      (valid.length >= 4 && dist <= 2 && score >= 0.75) ||
      (valid.length >= 8 && dist <= 3 && score >= 0.72);

    if (isFuzzy) {
      return {
        status: 'FUZZY',
        suggestedName: targetAnimal.name,
        inputGuess: rawGuess.trim(),
      };
    }
  }

  return { status: 'WRONG' };
}
