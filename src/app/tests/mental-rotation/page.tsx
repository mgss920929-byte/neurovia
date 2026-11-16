"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "playing" | "gameover";

const SHAPES = ["F", "L", "P", "R", "J", "U"];
const ROTATIONS = ["rotate-0", "rotate-90", "rotate-180", "rotate-270"];

export default function MentalRotationPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [challenge, setChallenge] = useState<{ targetShape: string; targetRotation: string; options: { shape: string; rotation: string; isMatch: boolean }[] } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [bestScore, setBestScore] = useState<number>(0);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState("playing");
    nextChallenge();
  };

  const nextChallenge = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const targetRot = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];

    const matchOption = { shape, rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)], isMatch: true };
    const distractors = Array.from({ length: 3 }).map(() => ({
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
      isMatch: false,
    }));

    const options = [matchOption, ...distractors].sort(() => Math.random() - 0.5);
    setChallenge({ targetShape: shape, targetRotation: targetRot, options });
  };

  const handleAnswer = (isMatch: boolean) => {
    if (gameState !== "playing" || !challenge) return;

    if (isMatch) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      saveLocalScore("mental-rotation", newScore);
      nextChallenge();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        if (score > bestScore) setBestScore(score);
        saveLocalScore("mental-rotation", score);
        setGameState("gameover");
      } else {
        nextChallenge();
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

      <div className="w-full min-h-[460px] rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <Brain className="w-14 h-14 mx-auto text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Mental Rotation</h1>
            <p className="text-slate-400 text-sm">Determine which option shape is a rotated version of the target shape.</p>
            <button onClick={startGame} className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && challenge && (
          <div className="space-y-6 max-w-md w-full">
            <div className="text-xs uppercase tracking-wider text-indigo-300">Find the matching rotated shape</div>
            <div className="w-24 h-24 mx-auto bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-5xl font-mono text-white shadow-inner">
              <span className={challenge.targetRotation}>{challenge.targetShape}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {challenge.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt.isMatch)} className="h-20 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-3xl font-mono flex items-center justify-center transition-all active:scale-95">
                  <span className={opt.rotation}>{opt.shape}</span>
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
              <div className="text-sm text-emerald-400 font-medium">{calculatePercentile("mental-rotation", score)}th Percentile</div>
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