"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "playing" | "gameover";

interface Tile {
  id: number;
  number: number;
  x: number;
  y: number;
}

const GRID_COLS = 6;
const GRID_ROWS = 5;

export default function ChimpTestPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [nextTarget, setNextTarget] = useState<number>(1);
  const [level, setLevel] = useState<number>(4); // Start with 4 numbers
  const [bestScore, setBestScore] = useState<number>(0);
  const [numbersHidden, setNumbersHidden] = useState<boolean>(false);
  const [strikes, setStrikes] = useState<number>(0);

  const startGame = (numTiles: number) => {
    setGameState("playing");
    setNextTarget(1);
    setNumbersHidden(false);
    setStrikes(0);
    generateTiles(numTiles);
  };

  const generateTiles = (count: number) => {
    const generated: Tile[] = [];
    const positions: { x: number; y: number }[] = [];

    // Generate non-overlapping random grid coordinates
    while (generated.length < count) {
      const x = Math.floor(Math.random() * GRID_COLS);
      const y = Math.floor(Math.random() * GRID_ROWS);

      const exists = positions.some((p) => p.x === x && p.y === y);
      if (!exists) {
        positions.push({ x, y });
        generated.push({
          id: generated.length,
          number: generated.length + 1,
          x,
          y,
        });
      }
    }
    setTiles(generated);
  };

  const handleTileClick = (tile: Tile) => {
    if (gameState !== "playing") return;

    if (tile.number === nextTarget) {
      if (nextTarget === 1) {
        // Hide numbers once the first tile is clicked
        setNumbersHidden(true);
      }

      if (nextTarget === tiles.length) {
        // Level cleared! Increase count and next level
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setNextTarget(1);
        setNumbersHidden(false);
        generateTiles(nextLevel);
      } else {
        setNextTarget(nextTarget + 1);
      }
    } else {
      // Wrong tile clicked -> Strike or Game Over
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        const finalScore = level - 1;
        if (finalScore > bestScore) setBestScore(finalScore);
        saveLocalScore("chimp-test", finalScore);
        setGameState("gameover");
      }
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
          <div>Strikes: <span className="font-bold text-rose-400">{strikes} / 3</span></div>
          <div>Level: <span className="font-bold text-white">{level}</span></div>
          <div>Best: <span className="font-bold text-indigo-400">{bestScore}</span></div>
        </div>
      </div>

      <div className="w-full min-h-[460px] rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <Brain className="w-14 h-14 mx-auto text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Chimp Test</h1>
            <p className="text-slate-400 text-sm">
              Click the numbers in ascending order from 1 to {level}. Once you click 1, the numbers will disappear!
            </p>
            <button
              onClick={() => startGame(level)}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6 w-full max-w-lg">
            <div className="text-sm font-medium text-indigo-300 uppercase tracking-wider">
              {!numbersHidden ? "Memorize the positions..." : `Click number: ${nextTarget}`}
            </div>

            <div className="relative w-full aspect-[6/5] bg-slate-950/60 rounded-xl border border-slate-800 p-3 grid grid-cols-6 grid-rows-5 gap-2">
              {tiles.map((tile) => {
                const isAlreadyClicked = tile.number < nextTarget;
                if (isAlreadyClicked) return <div key={tile.id} />;

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    style={{
                      gridColumn: tile.x + 1,
                      gridRow: tile.y + 1,
                    }}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg flex items-center justify-center transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    {!numbersHidden ? tile.number : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-rose-400 font-semibold">
                Game Over
              </div>
              <div className="text-5xl font-extrabold text-white">{level - 1} Digits</div>
              <div className="text-sm text-emerald-400 font-medium">
                {calculatePercentile("chimp-test", level - 1)}th Percentile
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => startGame(4)}
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