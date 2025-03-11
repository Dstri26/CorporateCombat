import type { Card } from "@shared/schema";

interface AIStrategyParams {
  aiHand: Card[];
  discardPile: Card[];
  playerLastCard?: Card;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class GameAI {
  // Track departments we're collecting for strategy
  private targetDepartments: Set<string> = new Set();
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
  }

  private getDepartmentCounts(hand: Card[]): Map<string, number> {
    const counts = new Map<string, number>();
    hand.forEach(card => {
      const current = counts.get(card.department) || 0;
      counts.set(card.department, current + 1);
    });
    return counts;
  }

  private updateTargetDepartments(hand: Card[]): void {
    const counts = this.getDepartmentCounts(hand);
    this.targetDepartments.clear();

    // Find departments with the most cards
    let maxCount = 0;
    counts.forEach((count, dept) => {
      if (count > maxCount) {
        maxCount = count;
        this.targetDepartments.clear();
        this.targetDepartments.add(dept);
      } else if (count === maxCount) {
        this.targetDepartments.add(dept);
      }
    });
  }

  private evaluateCard(card: Card, hand: Card[]): number {
    let score = 0;

    // Base value for the card
    score += card.value;

    // Bonus for cards from target departments
    if (this.targetDepartments.has(card.department)) {
      score += 5;
    }

    // Bonus for completing sets
    const deptCount = hand.filter(c => c.department === card.department).length;
    if (deptCount === 3) score += 10; // Close to completing 4-card set
    if (deptCount === 2) score += 5;  // Progress towards 3-card set

    // Special value for "7" cards (purge ability)
    if (card.value === 7) {
      score += 8;
    }

    return score;
  }

  public chooseCardToPlay({ aiHand, discardPile, playerLastCard }: AIStrategyParams): Card {
    this.updateTargetDepartments(aiHand);

    // If playing on hard difficulty, consider opponent's moves
    if (this.difficulty === 'hard' && playerLastCard) {
      // Counter-strategy against opponent's department collection
      const opponentDeptCount = discardPile.filter(
        c => c.department === playerLastCard.department
      ).length;
      
      // If opponent is collecting a department, prioritize disrupting it
      if (opponentDeptCount >= 2) {
        const disruptiveCard = aiHand.find(c => 
          c.value === 7 && c.department === playerLastCard.department
        );
        if (disruptiveCard) return disruptiveCard;
      }
    }

    // Evaluate each card's strategic value
    const cardScores = aiHand.map(card => ({
      card,
      score: this.evaluateCard(card, aiHand)
    }));

    // Add randomness based on difficulty
    const randomFactor = {
      'easy': 0.5,    // More random decisions
      'medium': 0.25, // Moderate randomness
      'hard': 0.1     // Mostly strategic
    }[this.difficulty];

    cardScores.forEach(score => {
      score.score += Math.random() * randomFactor * 10;
    });

    // Sort by score and return the best card
    cardScores.sort((a, b) => b.score - a.score);
    return cardScores[0].card;
  }

  public shouldUsePurge(card: Card, aiHand: Card[], playerLastCard?: Card): boolean {
    if (card.value !== 7) return false;

    // Easy difficulty: Random decision
    if (this.difficulty === 'easy') {
      return Math.random() > 0.5;
    }

    // Medium/Hard: Strategic decision
    if (playerLastCard && playerLastCard.department === card.department) {
      return true; // Disrupt opponent's department collection
    }

    // Don't purge if we have multiple cards in that department
    const deptCount = aiHand.filter(c => c.department === card.department).length;
    return deptCount <= 1;
  }

  public evaluateDrawChoice(
    topDiscard: Card | undefined,
    aiHand: Card[]
  ): 'draw' | 'pickup' {
    if (!topDiscard) return 'draw';

    const discardScore = this.evaluateCard(topDiscard, aiHand);
    const randomDrawScore = 3.5; // Average expected value of random card

    // Add difficulty-based randomness
    const randomFactor = this.difficulty === 'easy' ? 2 : 
                        this.difficulty === 'medium' ? 1 : 0.5;
    
    const randomVariance = (Math.random() - 0.5) * randomFactor;
    
    return (discardScore + randomVariance > randomDrawScore) ? 'pickup' : 'draw';
  }
}

export const createAI = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): GameAI => {
  return new GameAI(difficulty);
};
