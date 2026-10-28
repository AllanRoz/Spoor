// LocalStorage persistence for Spoor

const STORAGE_KEYS = {
  SETTINGS: 'spoor_settings_v1',
  STATS: 'spoor_stats_v1',
  FIELD_GUIDE: 'spoor_fieldguide_v1',
  DAILY: 'spoor_daily_v1',
};

const DEFAULT_SETTINGS = {
  darkMode: false,
  soundEnabled: true,
  hapticsEnabled: true,
  animationsEnabled: true,
  confirmLeave: true,
  scalePerspective: 'hand', // 'none' | 'hand' | 'boot' | 'coin'
  dimensionUnit: 'cm', // 'cm' | 'in'
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  animalsGuessed: 0,
  correctCount: 0,
  incorrectCount: 0,
  giveUpCount: 0,
  cluesUsedTotal: 0,
  attemptsTotal: 0,
  currentStreak: 0,
  highestStreak: 0,
  perfectGames: 0, // guessed on clue 1 with 1 attempt
  categoryStats: {
    Mammal: { played: 0, correct: 0 },
    Bird: { played: 0, correct: 0 },
    Reptile: { played: 0, correct: 0 },
    Amphibian: { played: 0, correct: 0 },
    Fish: { played: 0, correct: 0 },
    Invertebrate: { played: 0, correct: 0 },
  },
  // Record of animal results: { [animalId]: { attempts: number, correct: number, wrong: number } }
  animalHistory: {},
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      // Auto detect OS dark preference on first launch
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { ...DEFAULT_SETTINGS, darkMode: prefersDark };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const getStoredStats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      categoryStats: {
        ...DEFAULT_STATS.categoryStats,
        ...(parsed.categoryStats || {}),
      },
    };
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStoredStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const getStoredFieldGuide = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FIELD_GUIDE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const recordFieldGuideDiscovery = (animal, cluesUsed) => {
  try {
    const guide = getStoredFieldGuide();
    const existing = guide[animal.id] || {
      id: animal.id,
      name: animal.name,
      category: animal.category,
      discoveriesCount: 0,
      firstDiscovered: new Date().toISOString(),
      bestCluesUsed: cluesUsed,
    };

    guide[animal.id] = {
      ...existing,
      discoveriesCount: (existing.discoveriesCount || 0) + 1,
      lastDiscovered: new Date().toISOString(),
      bestCluesUsed: Math.min(existing.bestCluesUsed || 99, cluesUsed),
    };

    localStorage.setItem(STORAGE_KEYS.FIELD_GUIDE, JSON.stringify(guide));
    return guide;
  } catch (e) {
    console.error('Failed to record field guide discovery:', e);
    return {};
  }
};

export const getStoredDaily = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveDailyResult = (dateKey, result) => {
  try {
    const daily = getStoredDaily();
    daily[dateKey] = {
      ...result,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(daily));
  } catch (e) {
    console.error('Failed to save daily result:', e);
  }
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.FIELD_GUIDE);
    localStorage.removeItem(STORAGE_KEYS.DAILY);
  } catch (e) {
    console.error('Failed to reset all data:', e);
  }
};

export const resetStatsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
  } catch (e) {
    console.error('Failed to reset stats data:', e);
  }
};

export const resetFieldGuideData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.FIELD_GUIDE);
  } catch (e) {
    console.error('Failed to reset field guide data:', e);
  }
};
