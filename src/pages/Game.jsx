import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Flame,
  HelpCircle,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Compass,
  AlertCircle
} from 'lucide-react';
import { generateGamePool, GAME_MODES, getCluesForMode } from '../utils/gameGenerator.js';
import { evaluateGuess } from '../utils/answerMatching.js';
import { calculateRoundScore } from '../utils/scoring.js';
import { playSound } from '../utils/sound.js';
import {
  saveStoredStats,
  getStoredStats,
  recordFieldGuideDiscovery
} from '../utils/storage.js';
import { ClueProgress } from '../components/ClueProgress.jsx';
import { ClueCard } from '../components/ClueCard.jsx';
import { AnswerInput } from '../components/AnswerInput.jsx';
import { FuzzySpellingModal } from '../components/FuzzySpellingModal.jsx';
import { SuccessModal } from '../components/SuccessModal.jsx';
import { GiveUpModal } from '../components/GiveUpModal.jsx';

export function Game({ settings, stats, onUpdateStats }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const modeId = searchParams.get('mode') || 'classic';
  const category = searchParams.get('cat') || 'All Animals';
  const habitat = searchParams.get('hab') || 'All Habitats';
  const difficulty = searchParams.get('diff') || 'normal';

  const modeConfig = GAME_MODES[modeId] || GAME_MODES.classic;
  const availableClues = getCluesForMode(modeId);

  // Game session states
  const [animalPool, setAnimalPool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [roundCluesRevealed, setRoundCluesRevealed] = useState(1);
  const [activeClueTab, setActiveClueTab] = useState(1);
  const [wrongGuessesCount, setWrongGuessesCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Modals state
  const [fuzzyModalData, setFuzzyModalData] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [giveUpModalOpen, setGiveUpModalOpen] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Initialize pool on mount
  useEffect(() => {
    const pool = generateGamePool({ category, habitat, difficulty });
    setAnimalPool(pool);
    setCurrentIndex(0);
    setSessionScore(0);
    setRoundCluesRevealed(1);
    setActiveClueTab(availableClues[0]?.id || 1);
    setWrongGuessesCount(0);
  }, [modeId, category, habitat, difficulty]);

  const currentAnimal = animalPool[currentIndex];
  const totalRounds = modeConfig.roundsTotal === Infinity ? '∞' : Math.min(modeConfig.roundsTotal, animalPool.length);
  const isLastRound = modeConfig.roundsTotal !== Infinity && currentIndex + 1 >= Math.min(modeConfig.roundsTotal, animalPool.length);

  // Clue reveal action
  const handleRevealNextClue = () => {
    if (roundCluesRevealed >= availableClues.length) return;
    const nextClueIndex = roundCluesRevealed; // 0-indexed next clue
    const nextClue = availableClues[nextClueIndex];
    if (nextClue) {
      setRoundCluesRevealed(prev => prev + 1);
      setActiveClueTab(nextClue.id);
      playSound('clue_reveal', settings.soundEnabled);
      setFeedbackMessage(null);
    }
  };

  // Submit guess handler
  const handleGuessSubmit = (rawGuess) => {
    if (!currentAnimal) return;

    const evaluation = evaluateGuess(rawGuess, currentAnimal);

    if (evaluation.status === 'EXACT') {
      handleSolveSuccess({ hasSpellingPenalty: false });
    } else if (evaluation.status === 'FUZZY') {
      setFuzzyModalData({
        suggestedName: evaluation.suggestedName,
        inputGuess: evaluation.inputGuess,
      });
    } else {
      // Wrong guess
      playSound('wrong', settings.soundEnabled);
      const updatedAttempts = wrongGuessesCount + 1;
      setWrongGuessesCount(updatedAttempts);
      setFeedbackMessage({
        type: 'error',
        text: `❌ Not quite "${rawGuess.trim()}". Keep investigating! (Attempt ${updatedAttempts})`,
      });
    }
  };

  // Handle successful solve
  const handleSolveSuccess = ({ hasSpellingPenalty }) => {
    playSound('correct', settings.soundEnabled);

    const pointsEarned = calculateRoundScore({
      cluesRevealed: roundCluesRevealed,
      wrongGuessesCount,
      hasSpellingCorrection: hasSpellingPenalty,
    });

    const newStreak = (stats.currentStreak || 0) + 1;
    const newHighestStreak = Math.max(newStreak, stats.highestStreak || 0);
    const isPerfect = roundCluesRevealed === 1 && wrongGuessesCount === 0;

    // Update global statistics
    const catStats = stats.categoryStats || {};
    const animalCat = currentAnimal.category;
    const prevCat = catStats[animalCat] || { played: 0, correct: 0 };

    const updatedStats = {
      ...stats,
      animalsGuessed: (stats.animalsGuessed || 0) + 1,
      correctCount: (stats.correctCount || 0) + 1,
      currentStreak: newStreak,
      highestStreak: newHighestStreak,
      cluesUsedTotal: (stats.cluesUsedTotal || 0) + roundCluesRevealed,
      attemptsTotal: (stats.attemptsTotal || 0) + (wrongGuessesCount + 1),
      perfectGames: (stats.perfectGames || 0) + (isPerfect ? 1 : 0),
      categoryStats: {
        ...catStats,
        [animalCat]: {
          played: prevCat.played + 1,
          correct: prevCat.correct + 1,
        },
      },
    };

    saveStoredStats(updatedStats);
    onUpdateStats(updatedStats);

    // Record in Field Guide
    recordFieldGuideDiscovery(currentAnimal, roundCluesRevealed);

    setSessionScore(prev => prev + pointsEarned);

    setSuccessModalData({
      animal: currentAnimal,
      scoreEarned: pointsEarned,
      cluesUsed: roundCluesRevealed,
      attempts: wrongGuessesCount + 1,
      currentStreak: newStreak,
      hasSpellingPenalty,
    });
  };

  // Give Up handler
  const handleGiveUp = () => {
    playSound('wrong', settings.soundEnabled);

    const updatedStats = {
      ...stats,
      incorrectCount: (stats.incorrectCount || 0) + 1,
      giveUpCount: (stats.giveUpCount || 0) + 1,
      currentStreak: 0, // Streak reset
    };

    saveStoredStats(updatedStats);
    onUpdateStats(updatedStats);

    setGiveUpModalOpen(true);
  };

  // Advance to next animal
  const handleNextAnimal = () => {
    setSuccessModalData(null);
    setGiveUpModalOpen(false);
    setFuzzyModalData(null);
    setFeedbackMessage(null);

    if (isLastRound) {
      // Session finished
      setSessionFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setRoundCluesRevealed(1);
      setActiveClueTab(availableClues[0]?.id || 1);
      setWrongGuessesCount(0);
    }
  };

  if (!currentAnimal && !sessionFinished) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Compass className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
        <h2 className="font-serif font-bold text-xl">Loading Expedition Pool...</h2>
      </div>
    );
  }

  // Session summary view if finished
  if (sessionFinished) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-12 text-center space-y-6 animate-scale-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Expedition Complete
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Field Expedition Report
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            You completed {modeConfig.title} across {currentIndex + 1} mystery animals.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-journal-300 dark:border-stone-800 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-journal-50 dark:bg-stone-800/60 p-4 rounded-2xl">
              <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                Final Score
              </span>
              <span className="text-3xl font-mono font-black text-amber-600 dark:text-amber-400">
                {sessionScore}
              </span>
            </div>

            <div className="bg-journal-50 dark:bg-stone-800/60 p-4 rounded-2xl">
              <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                Active Streak
              </span>
              <div className="flex items-center justify-center gap-1 text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
                <span>{stats.currentStreak || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/play')}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            New Expedition
          </button>
          <button
            type="button"
            onClick={() => navigate('/field-guide')}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-journal-300 dark:border-stone-700 font-bold text-sm text-stone-800 dark:text-stone-200 hover:bg-journal-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
          >
            View Field Guide
          </button>
        </div>
      </div>
    );
  }

  const canRevealNext = roundCluesRevealed < availableClues.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-journal-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono">
            {modeConfig.id === 'endless' ? `Animal #${currentIndex + 1}` : `Round ${currentIndex + 1} / ${totalRounds}`}
          </span>
          <span className="hidden sm:inline text-stone-500 dark:text-stone-400">
            {modeConfig.title}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-amber-700 dark:text-amber-400 font-bold">
            Score: {sessionScore}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{stats.currentStreak || 0}</span>
          </div>
        </div>
      </div>

      {/* Progressive Clue Indicator */}
      <ClueProgress
        cluesRevealed={roundCluesRevealed}
        activeClueTab={activeClueTab}
        onSelectClueTab={(clueId) => {
          playSound('click', settings.soundEnabled);
          setActiveClueTab(clueId);
        }}
        availableClues={availableClues}
      />

      {/* Active Clue Detail Card */}
      <ClueCard activeClueId={activeClueTab} animal={currentAnimal} />

      {/* Feedback Alert Toast */}
      {feedbackMessage && (
        <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium text-center animate-fade-in flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Guess Input Form */}
      <div className="space-y-3 pt-2">
        <div className="text-center">
          <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            What animal left this spoor?
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Type your guess below, or reveal another clue.
          </p>
        </div>

        <AnswerInput onSubmitGuess={handleGuessSubmit} />
      </div>

      {/* Clue Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {canRevealNext ? (
          <button
            type="button"
            onClick={handleRevealNextClue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-journal-200 hover:bg-journal-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Reveal Next Clue</span>
            <span className="text-xs text-stone-500 font-normal">
              ({availableClues.length - roundCluesRevealed} left)
            </span>
          </button>
        ) : (
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 py-2">
            ✓ All clues revealed
          </span>
        )}

        <button
          type="button"
          onClick={handleGiveUp}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:underline py-2 px-3 transition-colors"
        >
          Give Up / Reveal Answer
        </button>
      </div>

      {/* Fuzzy Spelling Confirmation Modal */}
      <FuzzySpellingModal
        isOpen={Boolean(fuzzyModalData)}
        suggestedName={fuzzyModalData?.suggestedName}
        inputGuess={fuzzyModalData?.inputGuess}
        onConfirm={() => {
          setFuzzyModalData(null);
          handleSolveSuccess({ hasSpellingPenalty: true });
        }}
        onReject={() => {
          setFuzzyModalData(null);
          playSound('click', settings.soundEnabled);
        }}
      />

      {/* Round Solve Success Modal */}
      <SuccessModal
        isOpen={Boolean(successModalData)}
        animal={successModalData?.animal}
        scoreEarned={successModalData?.scoreEarned}
        cluesUsed={successModalData?.cluesUsed}
        attempts={successModalData?.attempts}
        currentStreak={successModalData?.currentStreak}
        hasSpellingPenalty={successModalData?.hasSpellingPenalty}
        onNext={handleNextAnimal}
      />

      {/* Give Up / Concede Modal */}
      <GiveUpModal
        isOpen={giveUpModalOpen}
        animal={currentAnimal}
        onNext={handleNextAnimal}
      />
    </div>
  );
}
