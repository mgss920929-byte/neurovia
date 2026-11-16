import { BenchmarkTest, TestScoreRecord } from "@/types/benchmark";
import { supabase } from "./supabase";

export const BENCHMARK_TESTS: BenchmarkTest[] = [
  {
    id: "reaction-time",
    slug: "reaction-time",
    title: "Reaction Time",
    category: "Speed",
    description: "Measure visual reflex speed in milliseconds.",
    unit: "ms",
    lowerIsBetter: true,
    available: true,
  },
  {
    id: "sequence-memory",
    slug: "sequence-memory",
    title: "Sequence Memory",
    category: "Memory",
    description: "Memorize an increasingly long pattern of lit tiles.",
    unit: "level",
    available: true,
  },
  {
    id: "chimp-test",
    slug: "chimp-test",
    title: "Chimp Test",
    category: "Memory",
    description: "Click ascending numbers after they disappear.",
    unit: "digits",
    available: true,
  },
  {
    id: "number-memory",
    slug: "number-memory",
    title: "Number Memory",
    category: "Memory",
    description: "Recall progressively longer digit sequences.",
    unit: "digits",
    available: true,
  },
  {
    id: "verbal-memory",
    slug: "verbal-memory",
    title: "Verbal Memory",
    category: "Memory",
    description: "Keep as many words in short-term memory as possible.",
    unit: "words",
    available: true,
  },
  {
    id: "matrix-reasoning",
    slug: "matrix-reasoning",
    title: "Matrix Reasoning",
    category: "Logic",
    description: "Complete 3x3 abstract geometric patterns.",
    unit: "pts",
    available: true,
  },
  {
    id: "mental-rotation",
    slug: "mental-rotation",
    title: "Mental Rotation",
    category: "Spatial",
    description: "Identify rotated 2D/3D shapes under time pressure.",
    unit: "pts",
    available: true,
  },
];

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

const TEST_DISTRIBUTIONS: Record<
  string,
  { mean: number; sd: number; lowerIsBetter?: boolean }
> = {
  "reaction-time": { mean: 250, sd: 45, lowerIsBetter: true },
  "sequence-memory": { mean: 9, sd: 3.2 },
  "chimp-test": { mean: 9, sd: 2.5 },
  "number-memory": { mean: 8, sd: 2.2 },
  "verbal-memory": { mean: 35, sd: 12 },
  "matrix-reasoning": { mean: 12, sd: 3.5 },
  "mental-rotation": { mean: 15, sd: 4.2 },
};

export function calculatePercentile(testSlug: string, score: number): number {
  const dist = TEST_DISTRIBUTIONS[testSlug];
  if (!dist) return 50.0;

  const z = dist.lowerIsBetter
    ? (dist.mean - score) / dist.sd
    : (score - dist.mean) / dist.sd;

  return Math.min(99.9, Math.max(0.1, Number((normalCDF(z) * 100).toFixed(1))));
}

const STORAGE_KEY = "neurovia_guest_scores_v1";

export function getLocalScores(): Record<string, TestScoreRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveLocalScore(
  testSlug: string,
  score: number,
  lowerIsBetter = false
): Promise<TestScoreRecord> {
  const existing = getLocalScores();
  const prev = existing[testSlug];
  const isBetter =
    !prev ||
    (lowerIsBetter ? score < prev.bestScore : score > prev.bestScore);

  const bestScore = isBetter ? score : prev.bestScore;
  const percentile = calculatePercentile(testSlug, bestScore);

  const updated: TestScoreRecord = {
    testSlug,
    bestScore,
    percentile,
    attempts: (prev?.attempts || 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  existing[testSlug] = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  // Sync to Supabase Global Leaderboard if configured
  try {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Authenticated user: Upsert best score to test_results
        await supabase.from("test_results").upsert(
          {
            user_id: session.user.id,
            test_slug: testSlug,
            score: bestScore,
            percentile: percentile,
            attempt_mode: "ranked",
            validation_status: "verified",
          },
          { onConflict: "user_id,test_slug" }
        );
      } else {
        // Guest mode global entry insertion
        await supabase.from("leaderboard").insert([
          {
            test_slug: testSlug,
            score: bestScore,
            percentile: percentile,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    }
  } catch (err) {
    console.error("Failed to sync score to Supabase global leaderboard:", err);
  }

  return updated;
}

// Fetch Global Top Scores from Supabase for World Scope leaderboards
export async function fetchGlobalLeaderboard(testSlug: string, lowerIsBetter = false) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("test_slug", testSlug)
      .order("score", { ascending: lowerIsBetter })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching global leaderboard:", err);
    return [];
  }
}

// Cloud sync test score helper
export const saveTestScore = async (testSlug: string, score: number, percentile: number) => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("test_results").insert({
        user_id: session.user.id,
        test_slug: testSlug,
        score: score,
        percentile: percentile,
        attempt_mode: "ranked",
        validation_status: "verified",
      });
    }
  }
};