export type CognitiveCategory = "Memory" | "Speed" | "Logic" | "Spatial";

export interface BenchmarkTest {
  id: string;
  slug: string;
  title: string;
  category: CognitiveCategory;
  description: string;
  unit: string;
  lowerIsBetter?: boolean;
  available: boolean;
}

export interface TestScoreRecord {
  testSlug: string;
  bestScore: number;
  percentile: number;
  attempts: number;
  updatedAt: string;
}
