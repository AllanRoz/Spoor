import { ANIMALS } from '../src/data/animals.js';

const spoilers = [];

ANIMALS.forEach(animal => {
  const wordsToCheck = new Set();
  wordsToCheck.add(animal.name.toLowerCase());
  if (animal.aliases) {
    animal.aliases.forEach(al => wordsToCheck.add(al.toLowerCase()));
  }

  // Also include the primary distinct noun in animal name (e.g., 'wolf' from 'Gray Wolf', 'elephant' from 'African Bush Elephant')
  const nameParts = animal.name.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !['gray', 'grey', 'african', 'american', 'common', 'great', 'greater', 'giant', 'black', 'white', 'brown', 'red', 'blue', 'green', 'wild', 'asian', 'eastern', 'western', 'northern', 'southern'].includes(w));
  nameParts.forEach(w => wordsToCheck.add(w));

  const fields = [
    { name: 'footprint.description', text: animal.footprint?.description },
    { name: 'footprint.trackNotes', text: animal.footprint?.trackNotes },
    { name: 'footprint.features', text: (animal.footprint?.features || []).join(' ') },
    { name: 'habitat', text: animal.habitat },
    { name: 'size.note', text: animal.size?.note },
    { name: 'diet.description', text: animal.diet?.description }
  ];

  fields.forEach(f => {
    if (!f.text) return;
    const lowerText = f.text.toLowerCase();
    for (const keyword of wordsToCheck) {
      // Regex check with word boundary
      const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`\\b${safe}(?:s|es|'s|’s)?\\b`, 'i');
      if (reg.test(lowerText)) {
        spoilers.push({
          id: animal.id,
          name: animal.name,
          keyword,
          field: f.name,
          text: f.text
        });
      }
    }
  });
});

console.log(`Found ${spoilers.length} potential spoilers:`);
spoilers.forEach(s => {
  console.log(`[${s.id}] '${s.keyword}' in ${s.field}: "${s.text}"`);
});
