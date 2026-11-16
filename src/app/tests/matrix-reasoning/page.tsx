"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "playing" | "gameover";

const PUZZLES = [
  { matrix: ["⬛", "⬛", "⬛", "⬜", "⬜", "⬜", "⬛", "⬛", "?"], options: ["⬛", "⬜", "🔲", "🔳"], correct: 0 },
  { matrix: ["🔴", "🔵", "🟢", "🔵", "🟢", "🔴", "🟢", "🔴", "?"], options: ["🔴", "🔵", "🟢", "⚪"], correct: 1 },
  { matrix: ["⭐", "⭐", "⭐", "⭐", "✖️", "⭐", "⭐", "⭐", "?"], options: ["⭐", "✖️", "🔴", "⬛"], correct: 0 },
  { matrix: ["🔺", "🔹", "🔺", "🔹", "🔺", "🔹", "🔺", "🔹", "?"], options: ["🔺", "🔹", "🔴", "🟢"], correct: 0 },
];

export default function MatrixReasoningPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [bestScore, setBestScore] = useState<number>(0);

  const startGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setGameState("playing");
  };

  const handleAnswer = (optionIdx: number) => {
    if (gameState !== "playing") return;

    const puzzle = PUZZLES[currentIndex % PUZZLES.length];
    const isCorrect = optionIdx === puzzle.correct;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      saveLocalScore("matrix-reasoning", newScore);
      setCurrentIndex((prev) => prev + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        if (score > bestScore) setBestScore(score);
        saveLocalScore("matrix-reasoning", score);
        setGameState("gameover");
      }
    }
  };

  const puzzle = PUZZLES[currentIndex % PUZZLES.length];

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

      <div className="w-full min-h-[460px] rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <Brain className="w-14 h-14 mx-auto text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Matrix Reasoning</h1>
            <p className="text-slate-400 text-sm">Determine which symbol replaces the question mark (?) to complete the logic sequence.</p>
            <button onClick={startGame} className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Puzzle {currentIndex + 1}</div>
            <div className="grid grid-cols-3 gap-3 w-[260px] h-[260px] mx-auto bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {puzzle.matrix.map((cell, idx) => (
                <div key={idx} className="rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                  {cell}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 pt-2">
              {puzzle.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(idx)} className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xl flex items-center justify-center transition-all active:scale-95">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-rose-400 font-semibold">Game Over</div>
              <div className="text-5xl font-extrabold text-white">{score} Pts</div>
              <div className="text-sm text-emerald-400 font-medium">{calculatePercentile("matrix-reasoning", score)}th Percentile</div>
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