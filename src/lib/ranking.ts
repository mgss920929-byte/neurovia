export interface LeaderboardEntry {
  id: string;
  username: string;
  country?: string;
  score: number;
  percentile: number;
  attempts: number;
  title?: string;
  updatedAt: string;
}

export function sortLeaderboardEntries(entries: LeaderboardEntry[], testSlug: string): LeaderboardEntry[] {
  const lowerIsBetter = testSlug === "reaction-time";

  return [...entries].sort((a, b) => {
    if (lowerIsBetter) {
      if (a.score !== b.score) return a.score - b.score; // Lower score is better (ms)
    } else {
      if (a.score !== b.score) return b.score - a.score; // Higher score is better (levels, points)
    }
    // Tie-breaker: fewer attempts or more recent update
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}