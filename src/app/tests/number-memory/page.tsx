"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "playing" | "gameover";

const WORD_BANK = [
  "apple", "river", "stone", "cloud", "guitar", "planet", "window", "ocean",
  "pencil", "shadow", "winter", "forest", "bridge", "candle", "dragon", "falcon",
  "garden", "harbor", "island", "jungle", "knight", "lemon", "marble", "needle",
  "orbit", "pebble", "quartz", "rocket", "summit", "temple", "anchor", "breeze",
  "canyon", "dagger", "eager", "frost", "glacier", "horizon", "ignite", "jacket"
];

export default function VerbalMemoryPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [bestScore, setBestScore] = useState<number>(0);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setSeenWords(new Set());
    setGameState("playing");
    nextWord(new Set());
  };

  const nextWord = (currentSeen: Set<string>) => {
    const shouldBeSeen = currentSeen.size > 0 && Math.random() < 0.5;
    let word = "";
    if (shouldBeSeen) {
      const seenArray = Array.from(currentSeen);
      word = seenArray[Math.floor(Math.random() * seenArray.length)];
    } else {
      const unseen = WORD_BANK.filter((w) => !currentSeen.has(w));
      word = unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : WORD_BANK[0];
    }
    setCurrentWord(word);
  };

  const handleAnswer = (userGuessedSeen: boolean) => {
    if (gameState !== "playing") return;

    const isAlreadySeen = seenWords.has(currentWord);
    const isCorrect = userGuessedSeen === isAlreadySeen;

    const newSeen = new Set(seenWords);
    newSeen.add(currentWord);
    setSeenWords(newSeen);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      saveLocalScore("verbal-memory", newScore);
      nextWord(newSeen);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        if (score > bestScore) setBestScore(score);
        saveLocalScore("verbal-memory", score);
        setGameState("gameover");
      } else {
        nextWord(newSeen);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <div>Lives: <span className="font-bold text-rose-400">{"❤️".repeat(lives)}</span></div>
          <div>Score: <span className="font-bold text-white">{score}</span></div>
          <div>Best: <span className="font-bold text-indigo-400">{bestScore}</span></div>
        </div>
      </div>

      <div className="w-full min-h-[420px] rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <Brain className="w-14 h-14 mx-auto text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Verbal Memory</h1>
            <p className="text-slate-400 text-sm">Click &quot;Seen&quot; if you have seen the word before, or &quot;New&quot; if it is your first time.</p>
            <button onClick={startGame} className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 max-w-md w-full">
            <div className="text-4xl md:text-5xl font-extrabold tracking-wide text-white uppercase py-6 bg-slate-950/50 rounded-2xl border border-slate-800">
              {currentWord}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAnswer(false)} className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-lg transition-colors">
                NEW
              </button>
              <button onClick={() => handleAnswer(true)} className="py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-colors">
                SEEN
              </button>
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-rose-400 font-semibold">Game Over</div>
              <div className="text-5xl font-extrabold text-white">{score} Words</div>
              <div className="text-sm text-emerald-400 font-medium">{calculatePercentile("verbal-memory", score)}th Percentile</div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={startGame} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <Link href="/" className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium">
                Save &amp; Return
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}