import React from 'react';
import { FootprintDisplay } from './FootprintDisplay.jsx';
import { AnimalImage } from './AnimalImage.jsx';
import { Globe2, Ruler, Beef, Footprints, Image as ImageIcon, MapPin } from 'lucide-react';

export function ClueCard({ activeClueId, animal }) {
  if (!animal) return null;

  return (
    <div className="w-full bg-white dark:bg-[#131e1a] rounded-3xl p-5 sm:p-7 border border-journal-300 dark:border-stone-800 shadow-sm animate-scale-in">
      {/* Clue 1: Footprint */}
      {activeClueId === 1 && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-400">
            <Footprints className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
              Clue 1 — Animal Spoor
            </h3>
          </div>
          <FootprintDisplay animal={animal} />
        </div>
      )}

      {/* Clue 2: Habitat */}
      {activeClueId === 2 && (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
            <Globe2 className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
              Clue 2 — Habitat & Geographic Range
            </h3>
          </div>

          {/* Region Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {animal.regions?.map((reg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {reg}
              </span>
            ))}
            {animal.habitats?.map((hab, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
              >
                {hab}
              </span>
            ))}
          </div>

          <div className="max-w-md bg-journal-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-journal-200 dark:border-stone-800">
            <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              "{animal.habitat}"
            </p>
          </div>
        </div>
      )}

      {/* Clue 3: Size */}
      {activeClueId === 3 && (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
            <Ruler className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
              Clue 3 — Physical Dimensions
            </h3>
          </div>

          <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {animal.size?.weight && (
              <div className="bg-journal-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-journal-200 dark:border-stone-800">
                <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
                  Weight
                </span>
                <span className="text-base font-semibold text-stone-800 dark:text-stone-100 font-mono">
                  {animal.size.weight}
                </span>
              </div>
            )}
            {animal.size?.length && (
              <div className="bg-journal-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-journal-200 dark:border-stone-800">
                <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
                  Length / Body
                </span>
                <span className="text-base font-semibold text-stone-800 dark:text-stone-100 font-mono">
                  {animal.size.length}
                </span>
              </div>
            )}
          </div>

          {animal.size?.heightOrWingspan && (
            <div className="w-full max-w-md bg-journal-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-journal-200 dark:border-stone-800 mb-3">
              <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
                Height / Wingspan
              </span>
              <span className="text-base font-semibold text-stone-800 dark:text-stone-100 font-mono">
                {animal.size.heightOrWingspan}
              </span>
            </div>
          )}

          {animal.size?.note && (
            <p className="text-xs text-stone-500 dark:text-stone-400 italic max-w-sm mt-1">
              Field note: {animal.size.note}
            </p>
          )}
        </div>
      )}

      {/* Clue 4: Diet */}
      {activeClueId === 4 && (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
            <Beef className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
              Clue 4 — Feeding & Diet
            </h3>
          </div>

          <div className="mb-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
              {animal.diet?.type || 'Diet Classification'}
            </span>
          </div>

          <div className="max-w-md bg-journal-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-journal-200 dark:border-stone-800">
            <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              "{animal.diet?.description}"
            </p>
          </div>
        </div>
      )}

      {/* Clue 5: Image */}
      {activeClueId === 5 && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-400">
            <ImageIcon className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
              Final Clue — Animal Sighting
            </h3>
          </div>
          <AnimalImage
            animal={animal}
            src={animal.image}
            alt={`Field sighting photograph of ${animal.name}`}
            caption="High-resolution wildlife photograph"
          />
        </div>
      )}
    </div>
  );
}
