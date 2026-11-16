"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "waiting" | "ready" | "early" | "result" | "summary";

const TOTAL_ROUNDS = 5;

export default function ReactionTimePage() {
  const [state, setState] = useState<GameState>("idle");
  const [round, setRound] = useState<number>(1);
  const [times, setTimes] = useState<number[]>([]);
  const [currentMs, setCurrentMs] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startWaiting = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("waiting");
    const randomDelay = Math.floor(Math.random() * 3000) + 1500;
    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setState("ready");
    }, randomDelay);
  };

  const handleBoxClick = () => {
    if (state === "idle") {
      setTimes([]);
      setRound(1);
      startWaiting();
      return;
    }

    if (state === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("early");
      return;
    }

    if (state === "early") {
      startWaiting();
      return;
    }

    if (state === "ready") {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      const updatedTimes = [...times, elapsed];
      setCurrentMs(elapsed);
      setTimes(updatedTimes);

      if (updatedTimes.length >= TOTAL_ROUNDS) {
        const avg = Math.round(
          updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length
        );
        saveLocalScore("reaction-time", avg, true);
        setState("summary");
      } else {
        setRound(updatedTimes.length + 1);
        setState("result");
      }
      return;
    }

    if (state === "result") {
      startWaiting();
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimes([]);
    setRound(1);
    setCurrentMs(null);
    setState("idle");
  };

  const averageMs =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;

  const panelStyles: Record<GameState, string> = {
    idle: "bg-indigo-600 hover:bg-indigo-500",
    waiting: "bg-rose-600",
    ready: "bg-emerald-500",
    early: "bg-amber-600",
    result: "bg-slate-800 hover:bg-slate-700",
    summary: "bg-slate-900 border border-slate-800",
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
        <span className="text-sm text-slate-400">
          Round {Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </span>
      </div>

      <div
        onMouseDown={state !== "summary" ? handleBoxClick : undefined}
        className={`w-full min-h-[380px] rounded-2xl flex flex-col items-center justify-center p-8 text-center select-none transition-colors ${
          state !== "summary" ? "cursor-pointer" : ""
        } ${panelStyles[state]}`}
      >
        {state === "idle" && (
          <div className="space-y-4">
            <Zap className="w-14 h-14 mx-auto text-white" />
            <h1 className="text-3xl font-bold text-white">Reaction Time Test</h1>
            <p className="text-indigo-100 max-w-md mx-auto">
              When the red box turns green, click as quickly as you can. Click anywhere to start.
            </p>
          </div>
        )}

        {state === "waiting" && (
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white">Wait for green...</h2>
            <p className="text-rose-100 text-sm">Do not click yet</p>
          </div>
        )}

        {state === "ready" && (
          <div className="space-y-2">
            <h2 className="text-5xl font-extrabold text-slate-950">CLICK!</h2>
          </div>
        )}

        {state === "early" && (
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">Too soon!</h2>
            <p className="text-amber-100">Click to try this round again.</p>
          </div>
        )}

        {state === "result" && currentMs !== null && (
          <div className="space-y-3">
            <div className="text-5xl font-extrabold text-white">{currentMs} ms</div>
            <p className="text-slate-300">Click anywhere to continue to Round {round}</p>
          </div>
        )}

        {state === "summary" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-indigo-400 font-semibold">
                5-Round Average
              </div>
              <div className="text-5xl font-extrabold text-white">{averageMs} ms</div>
              <div className="text-sm text-emerald-400 font-medium">
                {calculatePercentile("reaction-time", averageMs)}th Percentile
              </div>
            </div>

            <div className="flex justify-center gap-2 text-xs text-slate-400">
              {times.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
                >
                  R{idx + 1}: {t}ms
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
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
