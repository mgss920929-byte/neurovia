"use client";

import { useState } from "react";
import { Check, Copy, Trophy, Sparkles, X } from "lucide-react";

interface ShareCardProps {
  testTitle: string;
  score: number;
  unit: string;
  percentile: number;
  title?: string;
  onClose: () => void;
}

export function ShareCard({
  testTitle,
  score,
  unit,
  percentile,
  title = "Neurovia Competitor",
  onClose,
}: ShareCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyShareText = () => {
    const text = `🧠 NEUROVIA BENCHMARK RESULT\n🎮 Test: ${testTitle}\n🏆 Score: ${score} ${unit} (${percentile}th Percentile)\n⭐ Title: ${title}\n\nChallenge your mind on Neurovia!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#10182A] border border-[#26344C] rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#98A6BD] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3988EF]/10 border border-[#3988EF]/30 text-xs font-semibold text-[#3988EF]">
            <Sparkles className="w-3.5 h-3.5" /> VERIFIED RESULT CARD
          </div>
          <h2 className="text-2xl font-extrabold text-white">{testTitle}</h2>
          <p className="text-xs text-[#98A6BD]">
            Official Cognitive Benchmark Evaluation
          </p>
        </div>

        {/* Score Display Box */}
        <div className="bg-gradient-to-br from-[#131F35] to-[#080D1A] border border-[#26344C] rounded-2xl p-6 text-center space-y-3 shadow-inner">
          <div className="text-4xl font-black text-white font-mono">
            {score} <span className="text-sm font-normal text-[#98A6BD]">{unit}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
            <Trophy className="w-3.5 h-3.5" /> {percentile}th Global Percentile
          </div>
          <div className="text-xs font-semibold text-indigo-400 pt-1">
            {title}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleCopyShareText}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#3988EF]/20 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> Result Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Shareable Result
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#131F35] hover:bg-[#1B2A47] border border-[#26344C] text-[#98A6BD] hover:text-white text-xs font-semibold transition-colors"
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}