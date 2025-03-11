import type { Card, Player } from "@shared/schema";

// Updated department names to match new rules
export const DEPARTMENTS = ["DEV", "HRA", "MKT", "FIN"];

// Card values in order
const CARD_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "E", "O"];

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

// Check if a sequence of values is valid (ascending or descending)
function isValidSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false;

  // Get non-intern cards
  const regularCards = cards.filter(c => c.type === "department");
  if (regularCards.length === 0) return false;

  // Convert to numeric values
  const values = regularCards.map(c => getCardValue(c.value));

  // Check ascending
  const ascending = values.slice().sort((a, b) => a - b);
  const descending = values.slice().sort((a, b) => b - a);

  // Check if current order matches either ascending or descending
  return values.every((val, i) => val === ascending[i]) || 
         values.every((val, i) => val === descending[i]);
}

export function checkWinCondition(hand: Card[]): boolean {
  // Must have exactly 7 cards
  if (hand.length !== 7) return false;

  // Group cards by department
  const departmentGroups = new Map<string, Card[]>();
  const universalInterns: Card[] = [];

  // Sort cards into department groups and collect universal interns
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

  // Check each department's cards
  let found4 = false;
  let found3 = false;

  departments.forEach(dept => {
    const deptCards = departmentGroups.get(dept) || [];
    const totalCardsAvailable = deptCards.length + universalInterns.length;

    // Check if we can make a 4-card sequence
    if (!found4 && totalCardsAvailable >= 4 && isValidSequence(deptCards)) {
      found4 = true;
    }
    // Check if we can make a 3-card sequence
    else if (!found3 && totalCardsAvailable >= 3 && isValidSequence(deptCards)) {
      found3 = true;
    }
  });

  return found4 && found3;
}