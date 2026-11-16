import { BENCHMARK_TESTS } from "./scoring";
import { TestScoreRecord } from "@/types/benchmark";

export interface CategoryPerformance {
  category: "Speed" | "Memory" | "Logic" | "Spatial";
  averagePercentile: number | null;
  completedTests: number;
  totalTests: number;
  totalAttempts: number;
}

export interface DashboardAnalytics {
  categories: CategoryPerformance[];
  overallPercentile: number | null;
  totalAttempts: number;
  calibratedCount: number;
  dailyStreak: number;
  recentActivity: {
    slug: string;
    title: string;
    bestScore: number;
    unit: string;
    percentile: number;
    updatedAt: string;
  }[];
}

export function computeDashboardAnalytics(
  scores: Record<string, TestScoreRecord>
): DashboardAnalytics {
  const domainNames: ("Speed" | "Memory" | "Logic" | "Spatial")[] = [
    "Speed",
    "Memory",
    "Logic",
    "Spatial",
  ];

  const categories: CategoryPerformance[] = domainNames.map((category) => {
    const testsInDomain = BENCHMARK_TESTS.filter((t) => t.category === category);
    const completedRecords = testsInDomain
      .map((t) => scores[t.slug])
      .filter((r): r is TestScoreRecord => Boolean(r));

    const totalAttempts = completedRecords.reduce(
      (sum, r) => sum + (r.attempts || 0),
      0
    );

    const averagePercentile =
      completedRecords.length > 0
        ? Number(
            (
              completedRecords.reduce((sum, r) => sum + r.percentile, 0) /
              completedRecords.length
            ).toFixed(1)
          )
        : null;

    return {
      category,
      averagePercentile,
      completedTests: completedRecords.length,
      totalTests: testsInDomain.length,
      totalAttempts,
    };
  });

  const allRecords = Object.values(scores);
  const totalAttempts = allRecords.reduce((sum, r) => sum + (r.attempts || 0), 0);
  const calibratedCount = allRecords.length;

  const overallPercentile =
    calibratedCount > 0
      ? Number(
          (
            allRecords.reduce((sum, r) => sum + r.percentile, 0) / calibratedCount
          ).toFixed(1)
        )
      : null;

  // Calculate consecutive day streak from real recorded timestamps
  const uniqueDays = Array.from(
    new Set(
      allRecords
        .map((r) => r.updatedAt?.slice(0, 10))
        .filter((d): d is string => Boolean(d))
    )
  ).sort((a, b) => (a > b ? -1 : 1));

  let dailyStreak = 0;
  if (uniqueDays.length > 0) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (uniqueDays[0] === todayStr || uniqueDays[0] === yesterdayStr) {
      dailyStreak = 1;
      for (let i = 1; i < uniqueDays.length; i++) {
        const prevDate = new Date(uniqueDays[i - 1]).getTime();
        const currDate = new Date(uniqueDays[i]).getTime();
        const diffDays = Math.round((prevDate - currDate) / 86400000);
        if (diffDays === 1) {
          dailyStreak++;
        } else {
          break;
        }
      }
    }
  }

  const recentActivity = allRecords
    .map((r) => {
      const meta = BENCHMARK_TESTS.find((t) => t.slug === r.testSlug);
      return {
        slug: r.testSlug,
        title: meta?.title || r.testSlug,
        bestScore: r.bestScore,
        unit: meta?.unit || "pts",
        percentile: r.percentile,
        updatedAt: r.updatedAt,
      };
    })
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));

  return {
    categories,
    overallPercentile,
    totalAttempts,
    calibratedCount,
    dailyStreak,
    recentActivity,
  };
}