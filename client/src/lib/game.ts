import type { Card, Player } from "@shared/schema";

export const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales", "Operations"];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  DEPARTMENTS.forEach(dept => {
    // Generate number cards (1-7) for each department
    for (let i = 1; i <= 7; i++) {
      deck.push({
        id: `${dept}-${i}`,
        department: dept,
        value: i
      });
    }
  });

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function dealInitialHands(deck: Card[]): {
  playerHand: Card[];
  aiHand: Card[];
  remainingDeck: Card[];
} {
  return {
    playerHand: deck.slice(0, 7),
    aiHand: deck.slice(7, 14),
    remainingDeck: deck.slice(14)
  };
}

export function checkWinCondition(hand: Card[]): boolean {
  // Check for 4+3 Career Portfolio™ winning condition
  const departmentCounts = new Map<string, number>();

  // Count cards by department
  hand.forEach(card => {
    const count = departmentCounts.get(card.department) || 0;
    departmentCounts.set(card.department, count + 1);
  });

  let hasPortfolio = false;
  departmentCounts.forEach((count, dept) => {
    if (count >= 4) {
      // Check if there's another department with 3 cards
      departmentCounts.forEach((otherCount, otherDept) => {
        if (otherDept !== dept && otherCount >= 3) {
          hasPortfolio = true;
        }
      });
    }
  });

  return hasPortfolio;
}

export function canPurgeDepartment(card: Card): boolean {
  // Check if card is a "7" for Department Purge
  return card.value === 7;
}

// Helper function to purge cards of a specific department from a hand
export function purgeDepartmentFromHand(hand: Card[], department: string): Card[] {
  return hand.filter(card => card.department !== department);
}