"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, RotateCcw } from "lucide-react";
import { calculatePercentile, saveLocalScore } from "@/lib/scoring";

type GameState = "idle" | "playing" | "gameover";

const HARD_VERBAL_WORDS: string[] = [
  "Abstruse", "Acquiesce", "Aesthetic", "Alacrity", "Amalgamate", "Ambivalent", "Amiable", "Anachronism", "Anathema", "Anodyne",
  "Apathy", "Apocryphal", "Apotheosis", "Arcane", "Ascetic", "Asperity", "Assiduous", "Audacity", "Augury", "Auspicious",
  "Avarice", "Baleful", "Banal", "Belligerent", "Beneficent", "Bereave", "Bolster", "Bombastic", "Bucolic", "Burgeon",
  "Cacophony", "Calumny", "Capricious", "Castigate", "Catharsis", "Celerity", "Censure", "Chicanery", "Circumspect", "Clandestine",
  "Cogent", "Commensurate", "Compunction", "Concede", "Conciliatory", "Conflagration", "Connive", "Consanguinity", "Consternation", "Conundrum",
  "Aconite", "Corporeal", "Corroborate", "Credulous", "Cursory", "Debauchery", "Decorum", "Deference", "Delineate",
  "Demagogue", "Denigrate", "Deride", "Desiccate", "Desultory", "Diatribe", "Diffident", "Dilatory", "Dilettante", "Dirge",
  "Disabuse", "Discordant", "Discreet", "Disparate", "Dissemble", "Dissonance", "Divination", "Dogmatic", "Dormant", "Duplicity",
  "Ebullient", "Eclectic", "Efficacy", "Effrontery", "Elegy", "Elicit", "Emaciated", "Emulate", "Enervate", "Ennui",
  "Ephemeral", "Equanimity", "Equivocal", "Esoteric", "Eulogy", "Evanescent", "Exacerbate", "Exculpate", "Execrable", "Exigent",
  "Exonerate", "Expiate", "Expurgate", "Extant", "Extraneous", "Facetious", "Fallacious", "Fatuous", "Fawning", "Felicitous",
  "Fervid", "Finesse", "Flout", "Foment", "Forestall", "Frugal", "Furtive", "Gainsay", "Garrulous",
  "Glean", "Goliath", "Gouging", "Grandiloquent", "Gregarious", "Guile", "Gullible", "Hallow", "Harangue", "Hegemony",
  "Hermetic", "Heterogeneous", "Hiatus", "Holistic", "Homogeneous", "Iconoclast", "Idiosyncrasy", "Impecunious", "Imperious"
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
      const unseen = HARD_VERBAL_WORDS.filter((w: string) => !currentSeen.has(w));
      word = unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : HARD_VERBAL_WORDS[0];
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-[#F4F7FF]">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#98A6BD] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm text-[#98A6BD]">
          <div>Lives: <span className="font-bold text-rose-400">{"❤️".repeat(lives)}</span></div>
          <div>Score: <span className="font-bold text-white">{score}</span></div>
          <div>Best: <span className="font-bold text-[#3988EF]">{bestScore}</span></div>
        </div>
      </div>

      <div className="w-full min-h-[420px] rounded-3xl border border-[#26344C] bg-[#10182A]/90 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center shadow-2xl">
        {gameState === "idle" && (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3988EF] to-[#8065F5] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#3988EF]/25">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Verbal Memory</h1>
            <p className="text-[#98A6BD] text-sm leading-relaxed">
              Test your short-term memory against 120+ advanced academic and esoteric vocabulary words. Click &quot;Seen&quot; or &quot;New&quot;.
            </p>
            <button onClick={startGame} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#3988EF]/20 transition-all">
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 max-w-md w-full">
            <div className="text-3xl md:text-4xl font-black tracking-wider text-white uppercase py-8 bg-[#080D1A] rounded-2xl border border-[#26344C] shadow-inner">
              {currentWord}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAnswer(false)} className="py-4 rounded-xl bg-[#131F35] hover:bg-[#1B2A47] border border-[#26344C] text-white font-bold text-sm tracking-widest transition-all active:scale-95">
                NEW
              </button>
              <button onClick={() => handleAnswer(true)} className="py-4 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white font-bold text-sm tracking-widest shadow-lg shadow-[#3988EF]/20 transition-all active:scale-95">
                SEEN
              </button>
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-rose-400 font-bold">Game Over</div>
              <div className="text-5xl font-black text-white">{score} Words</div>
              <div className="text-xs text-emerald-400 font-semibold pt-1">
                {calculatePercentile("verbal-memory", score)}th Percentile
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={startGame} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white text-xs font-bold shadow transition-all">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <Link href="/" className="px-5 py-2.5 rounded-xl bg-[#131F35] hover:bg-[#1B2A47] border border-[#26344C] text-white text-xs font-bold transition-all">
                Save &amp; Return
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}