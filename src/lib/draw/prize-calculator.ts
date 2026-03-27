import { DrawEntry } from "@/types";

interface PrizePool {
  total_prize_pool_pence: number;
  jackpot_pool_pence: number;
  tier2_pool_pence: number;
  tier3_pool_pence: number;
}

/**
 * Calculates prize pools based on active subscriptions and rollover.
 */
export function calculatePrizePools(
  activeSubscriptions: { plan_price: number }[], 
  carriedOverAmount: number
): PrizePool {
  const sumOfPrices = activeSubscriptions.reduce((acc, sub) => acc + sub.plan_price, 0);
  
  // total_prize_pool = sum × 0.30
  const total_prize_pool_pence = Math.floor(sumOfPrices * 0.30);
  
  // jackpot_pool = total × 0.40 + carriedOverAmount
  const jackpot_pool_pence = Math.floor(total_prize_pool_pence * 0.40) + carriedOverAmount;
  
  // tier2_pool = total × 0.35
  const tier2_pool_pence = Math.floor(total_prize_pool_pence * 0.35);
  
  // tier3_pool = total × 0.25 (the remaining 25%)
  const tier3_pool_pence = Math.floor(total_prize_pool_pence * 0.25);
  
  return {
    total_prize_pool_pence,
    jackpot_pool_pence,
    tier2_pool_pence,
    tier3_pool_pence
  };
}

/**
 * Calculates individual prize amounts for entries.
 * Splits pool equally among winners at each tier.
 */
export function calculatePrizeAmounts(
  entries: Partial<DrawEntry>[], 
  pools: PrizePool
): Partial<DrawEntry>[] {
  const tier1Winners = entries.filter(e => e.match_count === 5);
  const tier2Winners = entries.filter(e => e.match_count === 4);
  const tier3Winners = entries.filter(e => e.match_count === 3);
  
  const tier1Prize = tier1Winners.length > 0 
    ? Math.floor(pools.jackpot_pool_pence / tier1Winners.length) 
    : 0;
    
  const tier2Prize = tier2Winners.length > 0 
    ? Math.floor(pools.tier2_pool_pence / tier2Winners.length) 
    : 0;
    
  const tier3Prize = tier3Winners.length > 0 
    ? Math.floor(pools.tier3_pool_pence / tier3Winners.length) 
    : 0;
    
  return entries.map(entry => {
    let prizeAmount = 0;
    if (entry.match_count === 5) {
      prizeAmount = tier1Prize;
    } else if (entry.match_count === 4) {
      prizeAmount = tier2Prize;
    } else if (entry.match_count === 3) {
      prizeAmount = tier3Prize;
    }
    
    return {
      ...entry,
      prize_amount_pence: prizeAmount
    };
  });
}
