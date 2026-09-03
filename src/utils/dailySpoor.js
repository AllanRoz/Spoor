// Deterministic Daily Spoor generator and spoiler-free emoji share formatter

import { ANIMALS } from '../data/animals.js';

/**
 * Gets UTC date key formatted as YYYY-MM-DD
 */
export function getUtcDateKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Gets user-friendly formatted date string
 */
export function getFormattedDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Hash string to 32-bit positive integer
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculates day number since project anchor (Jan 1, 2026)
 */
export function getDailyPuzzleNumber(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const current = Date.UTC(y, m - 1, d);
  const anchor = Date.UTC(2026, 0, 1);
  const diffDays = Math.floor((current - anchor) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Selects deterministic animal for a given date
 */
export function getDailyAnimal(dateKey = getUtcDateKey()) {
  const hash = hashString(`spoor_daily_v1_${dateKey}`);
  const index = hash % ANIMALS.length;
  return ANIMALS[index];
}

/**
 * Formats spoiler-free share text
 * @param {Object} params
 * @param {string} params.dateKey
 * @param {number} params.cluesUsed
 * @param {number} params.guessesCount
 * @param {boolean} params.won
 * @param {number} params.score
 */
export function formatDailyShareText({
  dateKey,
  cluesUsed,
  guessesCount,
  won,
  score
}) {
  const puzzleNum = getDailyPuzzleNumber(dateKey);
  const clueEmojis = ['🐾', '🌎', '📏', '🍖', '🖼️'];

  const rows = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= cluesUsed) {
      if (won) {
        rows.push(`${clueEmojis[i - 1]} 🟩`);
      } else {
        rows.push(`${clueEmojis[i - 1]} 🟥`);
      }
    } else {
      rows.push(`${clueEmojis[i - 1]} ⬛`);
    }
  }

  const resultStatus = won
    ? `${cluesUsed} clue${cluesUsed > 1 ? 's' : ''} • ${guessesCount} guess${guessesCount > 1 ? 'es' : ''} • ${score} pts`
    : 'Gave Up';

  return `Spoor 🐾\nDaily #${puzzleNum}\n\n${rows.join('\n')}\n\n${resultStatus}\nhttps://allanroz.github.io/Spoor/`;
}
