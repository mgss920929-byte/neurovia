"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "showing" | "playing" | "gameover";

export default function SequenceMemoryPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [bestScore, setBestScore] = useState<number>(0);

  const startGame = () => {
    setSequence([]);
    setLevel(1);
    nextRound([]);
  };

  const nextRound = (currentSeq: number[]) => {
    setGameState("showing");
    setPlayerIndex(0);
    const nextTile = Math.floor(Math.random() * 9);
    const newSeq = [...currentSeq, nextTile];
    setSequence(newSeq);

    // Play sequence animation
    newSeq.forEach((tile, index) => {
      setTimeout(() => {
        setActiveTile(tile);
        setTimeout(() => {
          setActiveTile(null);
        }, 350);
      }, (index + 1) * 700);
    });

    // Unlock player input after sequence finishes playing
    setTimeout(() => {
      setGameState("playing");
    }, (newSeq.length + 1) * 700);
  };

  const handleTileClick = (tile: number) => {
    if (gameState !== "playing") return;

    // Flash clicked tile
    setActiveTile(tile);
    setTimeout(() => setActiveTile(null), 250);

    if (tile === sequence[playerIndex]) {
      const nextIdx = playerIndex + 1;
      if (nextIdx === sequence.length) {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setGameState("showing");
        setTimeout(() => nextRound(sequence), 800);
      } else {
        setPlayerIndex(nextIdx);
      }
    } else {
      const finalScore = level - 1;
      if (finalScore > bestScore) setBestScore(finalScore);
      saveLocalScore("sequence-memory", finalScore);
      setGameState("gameover");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <div>Level: <span className="font-bold text-white">{level}</span></div>
          <div>Best: <span className="font-bold text-indigo-400">{bestScore}</span></div>
        </div>
      </div>

      <div className="w-full min-h-[420px] rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <Brain className="w-14 h-14 mx-auto text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Sequence Memory</h1>
            <p className="text-slate-400 text-sm">
              Memorize the pattern of lit tiles on the grid, then repeat it back in the exact order.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {(gameState === "showing" || gameState === "playing") && (
          <div className="space-y-6">
            <div className="text-sm font-medium text-indigo-300 uppercase tracking-wider">
              {gameState === "showing" ? "Memorize pattern..." : "Your turn!"}
            </div>

            <div className="grid grid-cols-3 gap-3 w-[300px] h-[300px] mx-auto">
              {Array.from({ length: 9 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={gameState === "showing"}
                  className={`rounded-xl border transition-all ${
                    activeTile === idx
                      ? "bg-indigo-400 border-indigo-300 scale-95 shadow-lg shadow-indigo-500/50"
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-rose-400 font-semibold">
                Game Over
              </div>
              <div className="text-5xl font-extrabold text-white">{level - 1} Level{level - 1 !== 1 ? "s" : ""}</div>
              <div className="text-sm text-emerald-400 font-medium">
                {calculatePercentile("sequence-memory", level - 1)}th Percentile
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium"
              >
                Save &amp; Return
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}