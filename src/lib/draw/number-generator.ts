/**
 * Generates 5 unique numbers from 1-45.
 */
export function generateRandom(): number[] {
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
  
  // Fisher-Yates shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  return numbers.slice(0, 5).sort((a, b) => a - b);
}

/**
 * Higher frequency = higher weight.
 * Build frequency map of all scores across all users.
 */
export function generateWeightedCommon(allUserScores: number[][]): number[] {
  const frequencyMap = getFrequencyMap(allUserScores);
  const weights: { number: number; weight: number }[] = [];
  
  for (let i = 1; i <= 45; i++) {
    // We add 1 to ensure every number has at least a tiny chance
    weights.push({ number: i, weight: (frequencyMap[i] || 0) + 1 });
  }
  
  return selectWeightedUniqueNumbers(weights, 5);
}

/**
 * Lower frequency = higher weight.
 * Numbers rarely scored are more likely to be drawn.
 */
export function generateWeightedRare(allUserScores: number[][]): number[] {
  const frequencyMap = getFrequencyMap(allUserScores);
  const counts = Object.values(frequencyMap);
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
  
  const weights: { number: number; weight: number }[] = [];
  
  for (let i = 1; i <= 45; i++) {
    const count = frequencyMap[i] || 0;
    // Invert the weights: maxCount - count + 1
    weights.push({ number: i, weight: (maxCount - count) + 1 });
  }
  
  return selectWeightedUniqueNumbers(weights, 5);
}

/**
 * Helpers
 */

function getFrequencyMap(allUserScores: number[][]): Record<number, number> {
  const map: Record<number, number> = {};
  for (const userScores of allUserScores) {
    // Deduplicate user scores first to avoid mapping bias
    const uniqueScores = Array.from(new Set(userScores));
    for (const score of uniqueScores) {
      if (score >= 1 && score <= 45) {
        map[score] = (map[score] || 0) + 1;
      }
    }
  }
  return map;
}

function selectWeightedUniqueNumbers(
  weights: { number: number; weight: number }[], 
  count: number
): number[] {
  const selected: number[] = [];
  const available = [...weights];
  
  for (let i = 0; i < count; i++) {
    const totalWeight = available.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let j = 0; j < available.length; j++) {
      random -= available[j].weight;
      if (random <= 0) {
        selected.push(available[j].number);
        available.splice(j, 1);
        break;
      }
    }
  }
  
  return selected.sort((a, b) => a - b);
}
