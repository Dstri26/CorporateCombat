import type { Card, Player } from "@shared/schema";

// Updated department names to match new rules
export const DEPARTMENTS = ["DEV", "HRA", "MKT", "FIN"];

// Card values in order
const CARD_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "E", "O"];

// Helper function to get card numeric value for sorting
function getCardValue(value: string): number {
  if (value === "INTERN") return -1;
  if (value === "O") return 12;
  if (value === "E") return 11;
  if (value === "A") return 10;
  return parseInt(value);
}

// Sort cards by department and value
export function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => {
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    return getCardValue(a.value) - getCardValue(b.value);
  });
}

// Updated win condition check with proper intern handling
function isValidSequence(cards: Card[], availableInterns: number): boolean {
  // Get non-intern cards
  const deptCards = cards.filter(c => c.type === "department");

  // Convert to numeric values
  const values = deptCards.map(c => getCardValue(c.value));
  const sorted = [...values].sort((a, b) => a - b);

  // For less than 2 cards, any sequence is valid with enough interns
  if (values.length <= 1) return true;

  // Check if sequence can be completed with interns
  let neededInterns = 0;
  for (let i = 1; i < sorted.length; i++) {
    neededInterns += Math.max(0, sorted[i] - sorted[i-1] - 1);
  }

  return neededInterns <= availableInterns;
}

export function checkWinCondition(hand: Card[]): boolean {
  // Must have exactly 7 cards
  if (hand.length !== 7) return false;

  // Group cards by department and collect interns
  const departmentGroups = new Map<string, Card[]>();
  const universalInterns: Card[] = [];

  hand.forEach(card => {
    if (card.type === "intern" && card.isUniversal) {
      universalInterns.push(card);
    } else {
      const dept = card.department;
      if (!departmentGroups.has(dept)) {
        departmentGroups.set(dept, []);
      }
      departmentGroups.get(dept)!.push(card);
    }
  });

  // Must have exactly 2 departments (excluding UNIVERSAL)
  const departments = Array.from(departmentGroups.keys())
    .filter(dept => dept !== "UNIVERSAL");
  if (departments.length !== 2) return false;

  // For each department, check if we can make either a 4-card or 3-card sequence
  let found4 = false;
  let found3 = false;

  for (const dept of departments) {
    const deptCards = departmentGroups.get(dept) || [];
    const deptInterns = deptCards.filter(c => c.type === "intern");
    const totalInterns = deptInterns.length + universalInterns.length;
    const regularCards = deptCards.filter(c => c.type === "department");

    // Check if we can form a valid sequence
    if (!found4 && regularCards.length + totalInterns >= 4) {
      if (isValidSequence(deptCards, totalInterns)) {
        found4 = true;
        continue;
      }
    }

    if (!found3 && regularCards.length + totalInterns >= 3) {
      if (isValidSequence(deptCards, totalInterns)) {
        found3 = true;
      }
    }
  }

  return found4 && found3;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  // Create department cards
  DEPARTMENTS.forEach(dept => {
    CARD_VALUES.forEach(value => {
      deck.push({
        id: `${dept}-${value}`,
        department: dept,
        value,
        type: "department"
      });
    });
  });

  // Add department-specific interns
  DEPARTMENTS.forEach(dept => {
    deck.push({
      id: `${dept}-INTERN`,
      department: dept,
      value: "INTERN",
      type: "intern",
      isUniversal: false
    });
  });

  // Add universal interns
  for (let i = 1; i <= 2; i++) {
    deck.push({
      id: `UNIVERSAL-INTERN-${i}`,
      department: "UNIVERSAL",
      value: "INTERN",
      type: "intern",
      isUniversal: true
    });
  }

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