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
  Sparkles
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
  const formattedToday = getFormattedDate(todayKey);
  const puzzleNum = getDailyPuzzleNumber(todayKey);

  const existingRecord = dailyRecord[todayKey];
  const isAlreadyCompleted = Boolean(existingRecord?.completed);

  const todayAnimal = getDailyAnimal(todayKey);

  // Gameplay state
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [activeClueTab, setActiveClueTab] = useState(1);
  const [wrongGuessesCount, setWrongGuessesCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Modal states
  const [fuzzyModalData, setFuzzyModalData] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [giveUpModalOpen, setGiveUpModalOpen] = useState(false);

  // Countdown timer to midnight UTC
  const [timeRemaining, setTimeRemaining] = useState('');

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

  // Reveal next clue
  const handleRevealNext = () => {
    if (cluesRevealed >= 5) return;
    const next = cluesRevealed + 1;
    setCluesRevealed(next);
    setActiveClueTab(next);
    playSound('clue_reveal', settings.soundEnabled);
    setFeedbackMessage(null);
  };

  // Submit guess
  const handleGuessSubmit = (rawGuess) => {
    if (!todayAnimal || isAlreadyCompleted) return;

    const evaluation = evaluateGuess(rawGuess, todayAnimal);

    if (evaluation.status === 'EXACT') {
      handleComplete({ won: true, hasSpellingPenalty: false });
    } else if (evaluation.status === 'FUZZY') {
      setFuzzyModalData({
        suggestedName: evaluation.suggestedName,
        inputGuess: evaluation.inputGuess,
      });
    } else {
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
    const calculatedScore = won
      ? calculateRoundScore({
          cluesRevealed,
          wrongGuessesCount,
          hasSpellingCorrection: hasSpellingPenalty,
        })
      : 0;

    const shareText = formatDailyShareText({
      dateKey: todayKey,
      cluesUsed: cluesRevealed,
      guessesCount: wrongGuessesCount + 1,
      won,
      score: calculatedScore,
    });

    const result = {
      completed: true,
      won,
      animalId: todayAnimal.id,
      cluesUsed: cluesRevealed,
      guessesCount: wrongGuessesCount + 1,
      score: calculatedScore,
      shareText,
    };

    saveDailyResult(todayKey, result);
    onUpdateDailyRecord({ ...dailyRecord, [todayKey]: result });

    if (won) {
      playSound('correct', settings.soundEnabled);

      const newStreak = (stats.currentStreak || 0) + 1;
      const updatedStats = {
        ...stats,
        animalsGuessed: (stats.animalsGuessed || 0) + 1,
        correctCount: (stats.correctCount || 0) + 1,
        currentStreak: newStreak,
        highestStreak: Math.max(newStreak, stats.highestStreak || 0),
        cluesUsedTotal: (stats.cluesUsedTotal || 0) + cluesRevealed,
        attemptsTotal: (stats.attemptsTotal || 0) + (wrongGuessesCount + 1),
      };
      saveStoredStats(updatedStats);
      onUpdateStats(updatedStats);

      recordFieldGuideDiscovery(todayAnimal, cluesRevealed);

      setSuccessModalData({
        animal: todayAnimal,
        scoreEarned: calculatedScore,
        cluesUsed: cluesRevealed,
        attempts: wrongGuessesCount + 1,
        currentStreak: newStreak,
        hasSpellingPenalty,
      });
    } else {
      // Conceded
      playSound('wrong', settings.soundEnabled);
      const updatedStats = {
        ...stats,
        incorrectCount: (stats.incorrectCount || 0) + 1,
        currentStreak: 0,
      };
      saveStoredStats(updatedStats);
      onUpdateStats(updatedStats);

      setGiveUpModalOpen(true);
    }
  };

  const copyShareText = (textToCopy) => {
    const text = textToCopy || existingRecord?.shareText || '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      playSound('click', settings.soundEnabled);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  // If already completed today, show completed status view
  if (isAlreadyCompleted) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Daily Spoor Completed
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Daily Spoor #{puzzleNum}
          </h1>
          <p className="text-xs text-stone-500 font-mono">
            {formattedToday}
          </p>
        </div>

        <div className="bg-white dark:bg-[#131d1a] p-6 sm:p-8 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm space-y-6 text-center">
          <div>
            <span className="text-xs uppercase font-bold text-stone-400 block mb-1">
              Today's Mystery Animal
            </span>
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              {todayAnimal.name}
            </h2>
            <p className="text-xs font-serif italic text-stone-500">
              {todayAnimal.scientificName} • {todayAnimal.category}
            </p>
          </div>

          <div className="max-w-xs mx-auto">
            <AnimalImage animal={todayAnimal} src={todayAnimal.image} alt={todayAnimal.name} />
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

          {/* Countdown to next daily */}
          <div className="pt-4 border-t border-journal-100 dark:border-stone-800 flex items-center justify-center gap-2 text-xs text-stone-500 font-mono">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Next Daily Spoor in: <strong>{timeRemaining}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 text-white">
              Daily #{puzzleNum}
            </span>
            <span className="text-xs font-mono text-stone-500">
              {formattedToday}
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
            Daily Spoor Challenge
          </h1>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-stone-500 bg-journal-100 dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-journal-200 dark:border-stone-800">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{timeRemaining}</span>
        </div>
      </div>

      {/* Clue Progress */}
      <ClueProgress
        cluesRevealed={cluesRevealed}
        activeClueTab={activeClueTab}
        onSelectClueTab={(id) => {
          playSound('click', settings.soundEnabled);
          setActiveClueTab(id);
        }}
        availableClues={CLUE_CONFIG}
      />

      {/* Active Clue Card */}
      <ClueCard activeClueId={activeClueTab} animal={todayAnimal} />

      {/* Error feedback */}
      {feedbackMessage && (
        <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium text-center animate-fade-in flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Guess Input */}
      <div className="space-y-3 pt-2">
        <div className="text-center">
          <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Identify Today's Mystery Animal
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Guess now for top points, or reveal another clue.
          </p>
        </div>

        <AnswerInput onSubmitGuess={handleGuessSubmit} />
      </div>

      {/* Reveal Next Clue & Give Up Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {cluesRevealed < 5 ? (
          <button
            type="button"
            onClick={handleRevealNext}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-journal-200 hover:bg-journal-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Reveal Next Clue</span>
            <span className="text-xs text-stone-500 font-normal">
              ({5 - cluesRevealed} left)
            </span>
          </button>
        ) : (
          <span className="text-xs font-mono text-stone-500 py-2">
            ✓ All 5 clues revealed
          </span>
        )}

        <button
          type="button"
          onClick={() => handleComplete({ won: false, hasSpellingPenalty: false })}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:underline py-2 px-3 transition-colors"
        >
          Give Up / Reveal Answer
        </button>
      </div>

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
          playSound('click', settings.soundEnabled);
        }}
      />

      <SuccessModal
        isOpen={Boolean(successModalData)}
        animal={todayAnimal}
        scoreEarned={successModalData?.scoreEarned}
        cluesUsed={cluesRevealed}
        attempts={wrongGuessesCount + 1}
        currentStreak={(stats.currentStreak || 0)}
        hasSpellingPenalty={successModalData?.hasSpellingPenalty}
        isDaily={true}
        onShare={() => copyShareText(dailyRecord[todayKey]?.shareText)}
        onNext={() => setSuccessModalData(null)}
      />

      <GiveUpModal
        isOpen={giveUpModalOpen}
        animal={todayAnimal}
        isDaily={true}
        onNext={() => setGiveUpModalOpen(false)}
      />
    </div>
  );
}
