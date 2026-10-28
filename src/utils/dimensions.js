/**
 * Biological dimension and measurement formatting utilities for Spoor.
 * Supports seamless switching between metric (cm) and imperial (inches) units.
 */

const formatInch = (val) => {
  const rounded = Math.round(val * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
};

const formatFt = (val) => {
  const rounded = Math.round(val * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
};

/**
 * Converts a biological dimension string (normally in cm / meters) to inches / feet.
 * Handles ranges (e.g. "11–13 cm", "11 - 13 cm"), single values ("30 cm"),
 * parenthetical imperial notes ("1.8 meters (6 ft)"), meters, and millimeters.
 *
 * @param {string} str - Raw dimension string
 * @param {'cm' | 'in'} [unit='cm'] - Target unit
 * @returns {string} Formatted dimension string
 */
export function formatDimension(str, unit = 'cm') {
  if (!str || typeof str !== 'string') return str || '';
  if (unit !== 'in' && unit !== 'inches') return str;

  // 1. If explicit imperial parenthetical exists: "1.8 meters (6 ft)" -> "6 ft"
  let res = str.replace(/(\d+(?:\.\d+)?)\s*(?:meters|meter)\s*\(([^)]+)\)/gi, '$2');

  // 2. Meters range: "3–5 meters" -> "9.8–16.4 ft"
  res = res.replace(/(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*(?:meters|meter)/gi, (_, n1, n2) => {
    const ft1 = formatFt(parseFloat(n1) * 3.28084);
    const ft2 = formatFt(parseFloat(n2) * 3.28084);
    return `${ft1}–${ft2} ft`;
  });

  // 3. Single meters: "1.5 meters" -> "4.9 ft"
  res = res.replace(/(\d+(?:\.\d+)?)\s*(?:meters|meter)/gi, (_, n1) => {
    return `${formatFt(parseFloat(n1) * 3.28084)} ft`;
  });

  // 4. Millimeters: "20 mm" -> "0.8 in"
  res = res.replace(/(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*mm/gi, (_, n1, n2) => {
    const i1 = formatInch(parseFloat(n1) / 25.4);
    const i2 = formatInch(parseFloat(n2) / 25.4);
    return `${i1}–${i2} in`;
  });
  res = res.replace(/(\d+(?:\.\d+)?)\s*mm/gi, (_, n1) => {
    return `${formatInch(parseFloat(n1) / 25.4)} in`;
  });

  // 5. Centimeters ranges: "11–13 cm", "4.5–5.5 cm", "0.8–1.2 cm"
  res = res.replace(/(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*cm/gi, (_, n1, n2) => {
    const i1 = formatInch(parseFloat(n1) / 2.54);
    const i2 = formatInch(parseFloat(n2) / 2.54);
    return `${i1}–${i2} in`;
  });

  // 6. Single centimeters: "30 cm" -> "11.8 in"
  res = res.replace(/(\d+(?:\.\d+)?)\s*cm/gi, (_, n1) => {
    return `${formatInch(parseFloat(n1) / 2.54)} in`;
  });

  return res;
}

/**
 * Returns labels, tooltips, and SVG text for physical comparison reference objects.
 *
 * @param {'cm' | 'in'} [unit='cm']
 */
export function getPerspectiveSpecs(unit = 'cm') {
  const isImperial = unit === 'in' || unit === 'inches';
  return {
    hand: {
      button: isImperial ? '✋ Hand (7.5 in)' : '✋ Hand (19cm)',
      title: isImperial ? 'Compare against average human hand (7.5 in)' : 'Compare against average human hand (19 cm)',
      svgLabel: isImperial ? 'Hand (7.5 in)' : 'Hand (19cm)',
    },
    boot: {
      button: isImperial ? '🥾 Boot (10.2 in)' : '🥾 Boot (26cm)',
      title: isImperial ? 'Compare against hiking boot sole (10.2 in)' : 'Compare against hiking boot sole (26 cm)',
      svgLabel: isImperial ? 'Boot (10.2 in)' : 'Boot (26cm)',
    },
    coin: {
      button: isImperial ? '🪙 Coin (1.0 in)' : '🪙 Coin (2.5cm)',
      title: isImperial ? 'Compare against standard coin (1.0 in)' : 'Compare against standard coin (2.5 cm)',
      svgLabel: isImperial ? 'Coin (1.0 in)' : 'Coin (2.5cm)',
    },
  };
}
