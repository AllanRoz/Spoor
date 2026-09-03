import React from 'react';
import { Footprints, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-journal-200 dark:border-stone-800/80 bg-journal-100/60 dark:bg-[#0a1210] py-8 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          <span className="font-serif font-bold text-stone-800 dark:text-stone-200">
            SPOOR
          </span>
          <span>— Follow the clues. Find the animal.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/play" className="hover:text-amber-600 transition-colors">Play</Link>
          <Link to="/daily" className="hover:text-amber-600 transition-colors">Daily</Link>
          <Link to="/field-guide" className="hover:text-amber-600 transition-colors">Field Guide</Link>
          <Link to="/statistics" className="hover:text-amber-600 transition-colors">Statistics</Link>
          <Link to="/settings" className="hover:text-amber-600 transition-colors">Settings</Link>
        </div>

        <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
          <span>Static web game • Runs 100% in browser</span>
        </div>
      </div>
    </footer>
  );
}
