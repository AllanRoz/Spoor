import React, { useState, useEffect } from 'react';
import { Maximize2, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { getAnimalImageUrl, getAnimalFallbackUrl } from '../utils/imageHelper.js';

export function AnimalImage({ src, animal, alt = 'Animal Photograph', caption }) {
  const primaryUrl = animal ? getAnimalImageUrl(animal) : src;
  const fallbackUrl = animal ? getAnimalFallbackUrl(animal) : '';

  const [currentSrc, setCurrentSrc] = useState(primaryUrl);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const nextUrl = animal ? getAnimalImageUrl(animal) : src;
    setCurrentSrc(nextUrl);
    setLoaded(false);
    setError(false);
  }, [animal, src]);

  const handleError = () => {
    // If primary proxy failed, attempt raw fallback before giving up
    if (currentSrc !== fallbackUrl && fallbackUrl) {
      setCurrentSrc(fallbackUrl);
    } else {
      setError(true);
      setLoaded(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Container with natural journal border */}
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-journal-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 group">
        {/* Loading Skeleton */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-200 dark:bg-stone-800 animate-pulse z-10">
            <ImageIcon className="w-8 h-8 text-stone-400 dark:text-stone-600 animate-bounce" />
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-stone-100 dark:bg-stone-800 text-stone-500 z-10">
            <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-xs">Photo unavailable in offline mode</p>
            <p className="text-xs font-semibold mt-1 text-stone-700 dark:text-stone-300">{alt}</p>
          </div>
        )}

        {/* Actual Image */}
        {currentSrc && (
          <img
            src={currentSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${
              loaded && !error ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => loaded && !error && setModalOpen(true)}
          />
        )}

        {/* Expand Overlay Button */}
        {loaded && !error && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="absolute bottom-3 right-3 p-2 rounded-lg bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
            title="Expand photo"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {caption && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 text-center italic">
          {caption}
        </p>
      )}

      {/* Fullscreen Photo Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 transition-colors p-1"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={currentSrc}
              alt={alt}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-sm text-stone-200 text-center font-medium">
              {alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
