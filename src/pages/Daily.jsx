import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Share2,
  Clock,
  CheckCircle2,
  Eye,
  AlertCircle,
  Footprints,
  Flame,
  Award,
  Sparkles,
  Lightbulb,
  History,
  X,
  ArrowRight
} from 'lucide-react';
import {
  getUtcDateKey,
  getFormattedDate,
  getDailyPuzzleNumber,
  getDailyAnimal,
  formatDailyShareText
} from '../utils/dailySpoor.js';
import { evaluateGuess } from '../utils/answerMatching.js';
import { calculateRoundScore } from '../utils/scoring.js';
import { playSound } from '../utils/sound.js';
import { triggerHaptic } from '../utils/haptics.js';
import {
  saveDailyResult,
  saveStoredStats,
  recordFieldGuideDiscovery
} from '../utils/storage.js';
import { ClueProgress, CLUE_CONFIG } from '../components/ClueProgress.jsx';
import { ClueCard } from '../components/ClueCard.jsx';
import { AnswerInput } from '../components/AnswerInput.jsx';
import { FuzzySpellingModal } from '../components/FuzzySpellingModal.jsx';
import { SuccessModal } from '../components/SuccessModal.jsx';
import { GiveUpModal } from '../components/GiveUpModal.jsx';
import { AnimalImage } from '../components/AnimalImage.jsx';

export function Daily({ settings, stats, onUpdateStats, dailyRecord, onUpdateDailyRecord }) {
  const todayKey = getUtcDateKey();
  const [activeDateKey, setActiveDateKey] = useState(todayKey);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const formattedActiveDate = getFormattedDate(activeDateKey);
  const puzzleNum = getDailyPuzzleNumber(activeDateKey);
  const existingRecord = dailyRecord[activeDateKey];
  const isAlreadyCompleted = Boolean(existingRecord?.completed);

  const activeAnimal = getDailyAnimal(activeDateKey);

  // Gameplay state
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [activeClueTab, setActiveClueTab] = useState(1);
  const [wrongGuessesCount, setWrongGuessesCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Tracker's Intuition Hint
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState(null);

  // Modal states
  const [fuzzyModalData, setFuzzyModalData] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [giveUpModalOpen, setGiveUpModalOpen] = useState(false);

  // Countdown timer to midnight UTC
  const [timeRemaining, setTimeRemaining] = useState('');

  // Reset round state when switching dates
  useEffect(() => {
    setCluesRevealed(1);
    setActiveClueTab(1);
    setWrongGuessesCount(0);
    setFeedbackMessage(null);
    setHintUsed(false);
    setHintText(null);
  }, [activeDateKey]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrowUtc = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
      const diffMs = tomorrowUtc - now;
      if (diffMs <= 0) {
        setTimeRemaining('New Daily Ready!');
        return;
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeRemaining(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate list of past 14 days
  const pastDaysList = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - idx);
    const key = d.toISOString().split('T')[0];
    return {
      dateKey: key,
      formatted: getFormattedDate(key),
      puzzleNum: getDailyPuzzleNumber(key),
      completed: Boolean(dailyRecord[key]?.completed),
      isToday: key === todayKey,
    };
  });

  // Reveal next clue
  const handleRevealNext = () => {
    if (cluesRevealed >= 5) return;
    const next = cluesRevealed + 1;
    setCluesRevealed(next);
    setActiveClueTab(next);
    triggerHaptic('clue', settings.hapticsEnabled);
    playSound('clue_reveal', settings.soundEnabled);
    setFeedbackMessage(null);
  };

  // Field Intuition hint handler
  const handleRequestHint = () => {
    if (hintUsed || !activeAnimal) return;
    triggerHaptic('light', settings.hapticsEnabled);
    playSound('hint', settings.soundEnabled);
    setHintUsed(true);
    const letters = activeAnimal.name.replace(/[^a-zA-Z]/g, '').length;
    const fact = activeAnimal.funFacts?.[0] || `Native to ${activeAnimal.habitat}.`;
    setHintText({
      letter: activeAnimal.name[0].toUpperCase(),
      length: letters,
      fact: fact
    });
  };

  // Submit guess
  const handleGuessSubmit = (rawGuess) => {
    if (!activeAnimal || isAlreadyCompleted) return;

    const evaluation = evaluateGuess(rawGuess, activeAnimal);

    if (evaluation.status === 'EXACT') {
      handleComplete({ won: true, hasSpellingPenalty: false });
    } else if (evaluation.status === 'FUZZY') {
      triggerHaptic('warning', settings.hapticsEnabled);
      setFuzzyModalData({
        suggestedName: evaluation.suggestedName,
        inputGuess: evaluation.inputGuess,
      });
    } else {
      triggerHaptic('wrong', settings.hapticsEnabled);
      playSound('wrong', settings.soundEnabled);
      const attempts = wrongGuessesCount + 1;
      setWrongGuessesCount(attempts);
      setFeedbackMessage({
        type: 'error',
        text: `❌ Not quite "${rawGuess.trim()}". (Attempt ${attempts})`,
      });
    }
  };

  // Finish daily challenge
  const handleComplete = ({ won, hasSpellingPenalty }) => {
    const rawScore = won
      ? calculateRoundScore({
          cluesRevealed,
          wrongGuessesCount,
          hasSpellingCorrection: hasSpellingPenalty,
        })
      : 0;
    const calculatedScore = hintUsed && won ? Math.max(10, rawScore - 5) : rawScore;

    const shareText = formatDailyShareText({
      dateKey: activeDateKey,
      cluesUsed: cluesRevealed,
      guessesCount: wrongGuessesCount + 1,
      won,
      score: calculatedScore,
    });

    const resultRecord = {
      completed: true,
      won,
      cluesUsed: cluesRevealed,
      attempts: wrongGuessesCount + 1,
      score: calculatedScore,
      animalId: activeAnimal.id,
      shareText,
      completedAt: new Date().toISOString(),
    };

    const updatedDailyRecord = {
      ...dailyRecord,
      [activeDateKey]: resultRecord,
    };
    saveDailyResult(activeDateKey, resultRecord);
    onUpdateDailyRecord(updatedDailyRecord);

    if (won) {
      triggerHaptic('success', settings.hapticsEnabled);
      playSound('correct', settings.soundEnabled);

      const newStreak = (stats.currentStreak || 0) + 1;
      const newHighestStreak = Math.max(newStreak, stats.highestStreak || 0);

      const updatedStats = {
        ...stats,
        animalsGuessed: (stats.animalsGuessed || 0) + 1,
        correctCount: (stats.correctCount || 0) + 1,
        currentStreak: newStreak,
        highestStreak: newHighestStreak,
        cluesUsedTotal: (stats.cluesUsedTotal || 0) + cluesRevealed,
        attemptsTotal: (stats.attemptsTotal || 0) + (wrongGuessesCount + 1),
      };
      saveStoredStats(updatedStats);
      onUpdateStats(updatedStats);

      recordFieldGuideDiscovery(activeAnimal.id, { cluesUsed: cluesRevealed });

      setSuccessModalData({
        animal: activeAnimal,
        pointsEarned: calculatedScore,
        cluesUsed: cluesRevealed,
        attemptsCount: wrongGuessesCount + 1,
        isDaily: true,
        shareText,
      });
    } else {
      triggerHaptic('warning', settings.hapticsEnabled);
      playSound('wrong', settings.soundEnabled);

      const updatedStats = {
        ...stats,
        incorrectCount: (stats.incorrectCount || 0) + 1,
        giveUpCount: (stats.giveUpCount || 0) + 1,
        currentStreak: 0,
      };
      saveStoredStats(updatedStats);
      onUpdateStats(updatedStats);

      setGiveUpModalOpen(true);
    }
  };

  const copyShareText = (text) => {
    triggerHaptic('light', settings.hapticsEnabled);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      playSound('click', settings.soundEnabled);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header with Archive and Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 text-white">
              Daily #{puzzleNum}
            </span>
            <span className="text-xs font-mono text-stone-500">
              {formattedActiveDate}
            </span>
            {activeDateKey !== todayKey && (
              <span className="px-2 py-0.5 rounded-full bg-journal-200 dark:bg-stone-800 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Archived Day
              </span>
            )}
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            Daily Spoor Challenge
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Past Dailies Archive Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light', settings.hapticsEnabled);
              playSound('click', settings.soundEnabled);
              setArchiveModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-journal-200 hover:bg-journal-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 transition-colors shadow-xs"
            title="Browse past daily puzzles"
          >
            <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Archive</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-mono text-stone-500 bg-journal-100 dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-journal-200 dark:border-stone-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Completed State View (if already finished this date) */}
      {isAlreadyCompleted ? (
        <div className="bg-white dark:bg-[#131d1a] p-6 sm:p-8 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm space-y-6 text-center animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
              {activeDateKey === todayKey ? "Today's Mystery Animal" : "Archived Mystery Animal"}
            </span>
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              {activeAnimal.name}
            </h2>
            <p className="text-xs font-serif italic text-stone-500">
              {activeAnimal.scientificName} • {activeAnimal.category}
            </p>
          </div>

          <div className="max-w-xs mx-auto">
            <AnimalImage animal={activeAnimal} src={activeAnimal.image} alt={activeAnimal.name} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-journal-50 dark:bg-stone-900/60 p-3 rounded-xl border border-journal-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Status</span>
              <span className={`text-base font-bold ${existingRecord.won ? 'text-emerald-600' : 'text-stone-400'}`}>
                {existingRecord.won ? 'Identified' : 'Gave Up'}
              </span>
            </div>
            <div className="bg-journal-50 dark:bg-stone-900/60 p-3 rounded-xl border border-journal-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Clues</span>
              <span className="text-base font-mono font-bold text-stone-800 dark:text-stone-200">
                {existingRecord.cluesUsed} / 5
              </span>
            </div>
            <div className="bg-journal-50 dark:bg-stone-900/60 p-3 rounded-xl border border-journal-200 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Score</span>
              <span className="text-base font-mono font-bold text-amber-600 dark:text-amber-400">
                {existingRecord.score || 0} pts
              </span>
            </div>
          </div>

          {/* Spoiler-free share button */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => copyShareText(existingRecord.shareText)}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedNotification ? 'Result Copied to Clipboard!' : 'Share Spoiler-Free Result'}</span>
            </button>
            <p className="text-[11px] text-stone-400 italic">
              Share text contains only clue emojis and score. No spoilers!
            </p>
          </div>

          {/* Action to switch back to today or open archive */}
          <div className="pt-4 border-t border-journal-100 dark:border-stone-800 flex items-center justify-center gap-3">
            {activeDateKey !== todayKey ? (
              <button
                type="button"
                onClick={() => setActiveDateKey(todayKey)}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                ← Return to Today's Spoor
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setArchiveModalOpen(true)}
                className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>Play Past Daily Puzzles from Archive</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Active Game Play */
        <>
          {/* Clue Progress */}
          <ClueProgress
            cluesRevealed={cluesRevealed}
            activeClueTab={activeClueTab}
            onSelectClueTab={(id) => {
              triggerHaptic('light', settings.hapticsEnabled);
              playSound('click', settings.soundEnabled);
              setActiveClueTab(id);
            }}
            availableClues={CLUE_CONFIG}
          />

          {/* Active Clue Card */}
          <ClueCard activeClueId={activeClueTab} animal={activeAnimal} dimensionUnit={settings?.dimensionUnit} />

          {/* Error feedback */}
          {feedbackMessage && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium text-center animate-fade-in flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Tracker's Field Intuition Hint (if revealed) */}
          {hintText && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 animate-fade-in space-y-1">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-amber-700 dark:text-amber-400">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Tracker's Field Intuition (-5 pts)</span>
              </div>
              <p className="leading-relaxed">
                Name starts with <strong>"{hintText.letter}"</strong> ({hintText.length} letters). <em>{hintText.fact}</em>
              </p>
            </div>
          )}

          {/* Guess Input */}
          <div className="space-y-3 pt-2">
            <div className="text-center">
              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Identify Mystery Animal
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Guess now for top points, or reveal another clue.
              </p>
            </div>

            <AnswerInput onSubmitGuess={handleGuessSubmit} />
          </div>

          {/* Clue Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            {cluesRevealed < 5 ? (
              <button
                type="button"
                onClick={handleRevealNext}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-journal-200 hover:bg-journal-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Reveal Next Clue</span>
                <span className="text-xs text-stone-500 font-normal">
                  ({5 - cluesRevealed} remaining)
                </span>
              </button>
            ) : (
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400 py-2">
                ✓ All 5 clues revealed
              </span>
            )}

            {!hintUsed && (
              <button
                type="button"
                onClick={handleRequestHint}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-600/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Get an intuitive field hint (-5 pts)"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Field Intuition</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                triggerHaptic('warning', settings.hapticsEnabled);
                handleComplete({ won: false, hasSpellingPenalty: false });
              }}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:underline py-2 px-3 transition-colors"
            >
              Give Up / Reveal Answer
            </button>
          </div>
        </>
      )}

      {/* Archive Modal */}
      {archiveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setArchiveModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-journal-50 dark:bg-[#121f1a] rounded-3xl p-6 shadow-2xl border-2 border-journal-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-journal-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
                  Daily Spoor Archive
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setArchiveModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 mb-4">
              Select any past mystery animal from the last two weeks to investigate or view your completed records.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {pastDaysList.map((day) => {
                const isCurrentActive = day.dateKey === activeDateKey;
                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light', settings.hapticsEnabled);
                      playSound('click', settings.soundEnabled);
                      setActiveDateKey(day.dateKey);
                      setArchiveModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isCurrentActive
                        ? 'bg-amber-600/10 border-amber-600 text-amber-800 dark:text-amber-300 font-bold'
                        : 'bg-white dark:bg-stone-900/60 border-journal-200 dark:border-stone-800 hover:border-amber-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">
                          Daily #{day.puzzleNum}
                        </span>
                        {day.isToday && (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-600 text-white text-[9px] uppercase font-bold">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        {day.formatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {day.completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Solved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Play <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FuzzySpellingModal
        isOpen={Boolean(fuzzyModalData)}
        suggestedName={fuzzyModalData?.suggestedName}
        inputGuess={fuzzyModalData?.inputGuess}
        onConfirm={() => {
          setFuzzyModalData(null);
          handleComplete({ won: true, hasSpellingPenalty: true });
        }}
        onReject={() => {
          setFuzzyModalData(null);
          const attempts = wrongGuessesCount + 1;
          setWrongGuessesCount(attempts);
          setFeedbackMessage({
            type: 'error',
            text: `❌ Not "${fuzzyModalData?.inputGuess}". Keep tracking!`,
          });
        }}
      />

      <SuccessModal
        isOpen={Boolean(successModalData)}
        animal={successModalData?.animal}
        pointsEarned={successModalData?.pointsEarned}
        cluesUsed={successModalData?.cluesUsed}
        attemptsCount={successModalData?.attemptsCount}
        isDaily={true}
        shareText={successModalData?.shareText}
        onClose={() => setSuccessModalData(null)}
        settings={settings}
      />

      <GiveUpModal
        isOpen={giveUpModalOpen}
        animal={activeAnimal}
        onClose={() => setGiveUpModalOpen(false)}
        settings={settings}
      />
    </div>
  );
}
