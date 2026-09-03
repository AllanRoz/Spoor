// Image resolver utility using Cloudflare-backed proxy and Wikipedia verified images

import { ANIMAL_IMAGES } from '../data/animal_images.js';

/**
 * Returns the primary high-speed Cloudflare-cached proxy image URL for an animal.
 */
export function getAnimalImageUrl(animal) {
  if (!animal) return '';
  
  const mapped = ANIMAL_IMAGES[animal.id];
  if (mapped?.proxy) {
    return mapped.proxy;
  }
  if (mapped?.raw) {
    return `https://wsrv.nl/?url=${encodeURIComponent(mapped.raw)}&w=800&fit=cover&q=80`;
  }
  if (animal.image) {
    return `https://wsrv.nl/?url=${encodeURIComponent(animal.image)}&w=800&fit=cover&q=80`;
  }
  return '';
}

/**
 * Returns a direct fallback image URL if the proxy is unreachable.
 */
export function getAnimalFallbackUrl(animal) {
  if (!animal) return '';
  const mapped = ANIMAL_IMAGES[animal.id];
  return mapped?.raw || animal.image || '';
}
