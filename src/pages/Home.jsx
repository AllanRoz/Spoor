import React from 'react';
import { Link } from 'react-router-dom';
import {
  Footprints,
  Calendar,
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Search,
  ShieldAlert
} from 'lucide-react';
import { getUtcDateKey, getFormattedDate, getDailyPuzzleNumber } from '../utils/dailySpoor.js';
import { GAME_MODES } from '../utils/gameGenerator.js';
import { playSound } from '../utils/sound.js';
import { ANIMALS } from '../data/animals.js';

export function Home({ stats, fieldGuide, dailyRecord, settings }) {
  const todayKey = getUtcDateKey();
  const formattedToday = getFormattedDate(todayKey);
  const dailyNum = getDailyPuzzleNumber(todayKey);
  const dailyCompleted = Boolean(dailyRecord[todayKey]?.completed);

  const discoveredCount = Object.keys(fieldGuide).length;
  const totalAnimals = ANIMALS.length;
  const discoveryPercent = Math.round((discoveredCount / totalAnimals) * 100) || 0;

  const handlePlayClick = () => {
    playSound('click', settings.soundEnabled);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 pt-4 sm:pt-8">
        {/* Subtle Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-journal-200/80 dark:bg-field-950/60 border border-journal-300 dark:border-field-800/80 text-xs font-semibold text-journal-900 dark:text-emerald-300 shadow-sm animate-fade-in">
          <Footprints className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>A Mystery Wildlife Detective Game</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif font-black text-5xl sm:text-7xl tracking-tight text-stone-900 dark:text-stone-100">
            SPOOR
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-amber-800 dark:text-amber-400 max-w-xl mx-auto">
            "Follow the clues. Find the animal."
          </p>
        </div>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
          Examine authentic animal footprints, investigate natural habitats, compare biological dimensions, and deduce dietary habits to track creatures across the globe.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/play"
            onClick={handlePlayClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-600/30 transition-all duration-150"
          >
            <Compass className="w-5 h-5" />
            <span>Play Spoor</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>

          <Link
            to="/daily"
            onClick={handlePlayClick}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-stone-900 hover:bg-journal-100 dark:hover:bg-stone-800 active:scale-95 text-stone-900 dark:text-stone-100 font-bold text-base border-2 border-journal-300 dark:border-stone-700 flex items-center justify-center gap-2.5 shadow-sm transition-all duration-150"
          >
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Daily Spoor #{dailyNum}</span>
            {dailyCompleted && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </Link>
        </div>
      </section>

      {/* Daily Spoor Spotlight Card */}
      <section className="bg-gradient-to-br from-journal-100 to-journal-200/70 dark:from-[#14231e] dark:to-[#0f1b17] rounded-3xl p-6 sm:p-8 border border-journal-300 dark:border-field-800/80 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 pointer-events-none opacity-10 dark:opacity-5">
          <Footprints className="w-64 h-64 text-amber-900 dark:text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 text-white">
                Daily Mystery
              </span>
              <span className="text-xs font-mono text-stone-600 dark:text-stone-400">
                {formattedToday}
              </span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
              Today's Spoor is Waiting
            </h2>

            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg leading-relaxed">
              Every day, all players worldwide investigate the exact same creature. Can you identify today's animal using the fewest clues possible?
            </p>
          </div>

          <Link
            to="/daily"
            onClick={handlePlayClick}
            className={`w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
              dailyCompleted
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 shadow-md'
            }`}
          >
            {dailyCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>View Daily Result</span>
              </>
            ) : (
              <>
                <span>Solve Today's Spoor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Link>
        </div>
      </section>

      {/* Your Field Tracker Stats Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Your Tracker Progress
          </h3>
          <Link
            to="/statistics"
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Full Statistics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm">
            <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
              Active Streak
            </span>
            <div className="flex items-center justify-center gap-1 text-2xl font-mono font-black text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>{stats.currentStreak || 0}</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Best: {stats.highestStreak || 0}</span>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm">
            <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
              Animals Found
            </span>
            <span className="text-2xl font-mono font-black text-stone-900 dark:text-stone-100">
              {stats.animalsGuessed || 0}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 block">Identified</span>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm">
            <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
              Accuracy
            </span>
            <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
              {stats.animalsGuessed > 0
                ? `${Math.round((stats.correctCount / Math.max(1, stats.correctCount + stats.incorrectCount)) * 100)}%`
                : '100%'}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 block">Identification rate</span>
          </div>

          <Link
            to="/field-guide"
            className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-journal-300 dark:border-stone-800 text-center shadow-sm hover:border-amber-500 transition-colors group"
          >
            <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 block mb-1">
              Field Guide
            </span>
            <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 group-hover:scale-105 inline-block transition-transform">
              {discoveredCount} / {totalAnimals}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 block">{discoveryPercent}% Discovered</span>
          </Link>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Expedition Game Modes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(GAME_MODES).map((mode) => (
            <Link
              key={mode.id}
              to={`/play?mode=${mode.id}`}
              onClick={handlePlayClick}
              className="group bg-white dark:bg-[#131d1a] p-5 rounded-2xl border border-journal-300 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500/70 shadow-sm transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {mode.id === 'endless' ? 'Infinite' : `${mode.roundsTotal} Rounds`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {mode.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-journal-100 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                {mode.tagline}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How to Play Guide */}
      <section className="bg-white dark:bg-[#121c19] rounded-3xl p-6 sm:p-8 border border-journal-300 dark:border-stone-800 space-y-6">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 text-center">
          How to Play Spoor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-xl font-bold font-mono">
              1
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Inspect the Spoor
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Start with the animal's footprint. Check pad layout, claw marks, and scale dimensions.
            </p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold font-mono">
              2
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Reveal Clues
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Unlock habitat, size, diet, and photos. Fewer clues used earns a higher score!
            </p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-xl font-bold font-mono">
              3
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Enter Your Guess
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Type common names or aliases. Smart spelling assistance catches minor typos.
            </p>
          </div>

          <div className="space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-xl font-bold font-mono">
              4
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Build Field Guide
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Every identified species is added to your personal Field Guide compendium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
