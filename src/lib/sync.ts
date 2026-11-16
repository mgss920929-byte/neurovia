import { supabase } from "@/lib/supabase";
import { getLocalScores } from "@/lib/scoring";

export async function syncLocalScoresToCloud(userId: string) {
  if (!supabase) return;

  const localScores = getLocalScores();
  const entries = Object.values(localScores);

  if (entries.length === 0) return;

  for (const entry of entries) {
    try {
      await supabase.from("test_results").insert({
        user_id: userId,
        test_slug: entry.testSlug,
        score: entry.bestScore,
        percentile: entry.percentile,
        attempt_mode: "ranked",
        validation_status: "verified",
      });
    } catch {
      // Ignore individual sync collision or network errors safely
    }
  }
}