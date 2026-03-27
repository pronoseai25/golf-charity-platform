/**
 * Matches user scores against drawn numbers.
 * Deduplicates user's scores first.
 * Only count matches of 3, 4, or 5 as prize-eligible.
 */
export function matchScores(userScores: number[], drawnNumbers: number[]): { 
  matchedNumbers: number[], 
  matchCount: number 
} {
  // Deduplicate user scores first
  const uniqueUserScores = Array.from(new Set(userScores));
  
  // Find intersection
  const matchedNumbers = uniqueUserScores.filter(score => drawnNumbers.includes(score));
  const matchCount = matchedNumbers.length;
  
  // Only counts of 3, 4, 5 are eligible for prizes
  // (but we return the actual count, the prize-eligibility logic
  // is handled by the prize calculator and engine)
  return { 
    matchedNumbers, 
    matchCount 
  };
}
