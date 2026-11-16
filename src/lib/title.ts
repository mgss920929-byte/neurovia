import { TestScoreRecord } from "@/types/benchmark";

export type TitleType = "seasonal" | "permanent";

export interface TitleDefinition {
  id: string;
  name: string;
  type: TitleType;
  tier: "legendary" | "epic" | "rare" | "standard";
  description: string;
  requirement: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
}

export const TITLE_DEFINITIONS: TitleDefinition[] = [
  {
    id: "global-champion",
    name: "GLOBAL CHAMPION",
    type: "seasonal",
    tier: "legendary",
    description: "Rank #1 in an individual cognitive benchmark for the active season.",
    requirement: "Rank #1 with at least 5 verified attempts.",
  },
  {
    id: "world-elite",
    name: "WORLD ELITE",
    type: "seasonal",
    tier: "epic",
    description: "Top 10 ranked competitor globally in an active season.",
    requirement: "Top 10 global rank with at least 5 verified attempts.",
  },
  {
    id: "world-master",
    name: "WORLD MASTER",
    type: "seasonal",
    tier: "rare",
    description: "Top 100 ranked competitor globally in an active season.",
    requirement: "Top 100 global rank with at least 3 verified attempts.",
  },
  {
    id: "national-champion",
    name: "NATIONAL CHAMPION",
    type: "seasonal",
    tier: "epic",
    description: "Highest-ranked verified competitor representing your country.",
    requirement: "Rank #1 in country leaderboard with at least 5 verified attempts.",
  },
  {
    id: "game-specialist",
    name: "GAME SPECIALIST",
    type: "permanent",
    tier: "rare",
    description: "Reached the 90th percentile or higher in a verified benchmark.",
    requirement: "90.0+ percentile across at least 3 verified attempts.",
  },
  {
    id: "consistency-master",
    name: "CONSISTENCY MASTER",
    type: "permanent",
    tier: "standard",
    description: "Completed 25 or more total benchmark evaluations.",
    requirement: "25+ total completed test attempts.",
  },
];

export interface PlayerRankingInput {
  globalRank?: number;
  countryRank?: number;
  scores: Record<string, TestScoreRecord>;
}

export function evaluateEarnedTitles(input: PlayerRankingInput): TitleDefinition[] {
  const earned: TitleDefinition[] = [];
  const records = Object.values(input.scores);
  const totalAttempts = records.reduce((sum, r) => sum + (r.attempts || 0), 0);
  const hasQualifyingPool = records.some((r) => (r.attempts || 0) >= 5);

  if (input.globalRank === 1 && hasQualifyingPool) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "global-champion")!);
  }
  if (input.globalRank && input.globalRank <= 10 && hasQualifyingPool) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "world-elite")!);
  }
  if (input.globalRank && input.globalRank <= 100 && records.some((r) => (r.attempts || 0) >= 3)) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "world-master")!);
  }
  if (input.countryRank === 1 && hasQualifyingPool) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "national-champion")!);
  }
  if (records.some((r) => r.percentile >= 90 && (r.attempts || 0) >= 3)) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "game-specialist")!);
  }
  if (totalAttempts >= 25) {
    earned.push(TITLE_DEFINITIONS.find((t) => t.id === "consistency-master")!);
  }

  return earned;
}

export function evaluateAchievements(scores: Record<string, TestScoreRecord>): {
  achievements: AchievementDefinition[];
  totalXp: number;
  level: number;
} {
  const records = Object.values(scores);
  const totalAttempts = records.reduce((sum, r) => sum + (r.attempts || 0), 0);
  const distinctGames = records.length;

  const achievements: AchievementDefinition[] = [
    {
      id: "first-benchmark",
      name: "First Calibration",
      description: "Complete your first cognitive benchmark test.",
      xpReward: 100,
      unlocked: totalAttempts >= 1,
    },
    {
      id: "multi-domain",
      name: "Cognitive Explorer",
      description: "Record verified scores in at least 4 distinct benchmarks.",
      xpReward: 250,
      unlocked: distinctGames >= 4,
    },
    {
      id: "full-battery",
      name: "Full Spectrum Mind",
      description: "Complete all 7 cognitive benchmarks on Neurovia.",
      xpReward: 500,
      unlocked: distinctGames >= 7,
    },
    {
      id: "dedicated-athlete",
      name: "Mental Athlete",
      description: "Log 20 total benchmark attempts.",
      xpReward: 300,
      unlocked: totalAttempts >= 20,
    },
    {
      id: "top-decile",
      name: "90th Percentile Club",
      description: "Achieve a 90.0+ percentile score in any benchmark.",
      xpReward: 400,
      unlocked: records.some((r) => r.percentile >= 90),
    },
  ];

  const achievementXp = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const attemptXp = totalAttempts * 25;
  const totalXp = achievementXp + attemptXp;
  const level = Math.max(1, Math.floor(totalXp / 250) + 1);

  return { achievements, totalXp, level };
}