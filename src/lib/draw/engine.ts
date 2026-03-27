import { DrawMode, DrawSimulationResult } from "@/types";
import { generateRandom, generateWeightedCommon, generateWeightedRare } from "./number-generator";
import { matchScores } from "./matching";
import { calculatePrizePools, calculatePrizeAmounts } from "./prize-calculator";

interface EligibleSubscriber {
  user_id: string;
  name: string;
  email: string;
  scores: number[];
  plan_price: number;
}

/**
 * Core orchestrator function for the Draw & Prize Engine.
 * Pure TypeScript functions, NO Supabase calls inside here.
 * Engine receives data, returns results.
 */
export function runDrawEngine(
  drawMode: DrawMode,
  drawDate: string,
  eligibleSubscribers: EligibleSubscriber[],
  carriedOverAmount: number
): DrawSimulationResult {
  
  // 3. Generate drawn numbers based on drawMode
  let drawnNumbers: number[] = [];
  const allUserScores = eligibleSubscribers.map(s => s.scores);
  
  switch (drawMode) {
    case 'random':
      drawnNumbers = generateRandom();
      break;
    case 'weighted_common':
      drawnNumbers = generateWeightedCommon(allUserScores);
      break;
    case 'weighted_rare':
      drawnNumbers = generateWeightedRare(allUserScores);
      break;
  }
  
  // 4. Calculate prize pools
  const pools = calculatePrizePools(
    eligibleSubscribers.map(s => ({ plan_price: s.plan_price })),
    carriedOverAmount
  );
  
  // 5. Run matching for every eligible user
  let entries = eligibleSubscribers.map(user => {
    const { matchedNumbers, matchCount } = matchScores(user.scores, drawnNumbers);
    return {
      user_id: user.user_id,
      name: user.name, // for top_winners preview
      scores_snapshot: user.scores,
      matched_numbers: matchedNumbers,
      match_count: matchCount,
      prize_amount_pence: 0 // placeholder for now
    };
  });
  
  // 6. Calculate individual prize amounts
  entries = calculatePrizeAmounts(entries, pools) as any;
  
  // 7. Calculate winner counts
  const winnerCounts = {
    tier1: entries.filter(e => e.match_count === 5).length,
    tier2: entries.filter(e => e.match_count === 4).length,
    tier3: entries.filter(e => e.match_count === 3).length,
  };
  
  // Identify top winners for preview
  const topWinners = entries
    .filter(e => e.match_count >= 3)
    .sort((a, b) => b.match_count - a.match_count)
    .slice(0, 5)
    .map(e => ({
      user_id: e.user_id,
      name: e.name,
      match_count: e.match_count,
      prize_amount_pence: e.prize_amount_pence
    }));
  
  return {
    draw_id: '', // Will be set by caller after INSERT
    draw_mode: drawMode,
    drawn_numbers: drawnNumbers,
    total_prize_pool_pence: pools.total_prize_pool_pence,
    jackpot_pool_pence: pools.jackpot_pool_pence,
    tier2_pool_pence: pools.tier2_pool_pence,
    tier3_pool_pence: pools.tier3_pool_pence,
    carried_over_amount_pence: carriedOverAmount,
    winner_counts: winnerCounts,
    total_eligible_users: eligibleSubscribers.length,
    top_winners: topWinners
  };
}
