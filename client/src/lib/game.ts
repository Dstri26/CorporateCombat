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

// Check if a sequence of values is valid (ascending or descending)
function isValidSequence(cards: Card[], availableInterns: number): boolean {
  // Get non-intern cards
  const deptCards = cards.filter(c => c.type === "department");

  // Convert to numeric values
  const values = deptCards.map(c => getCardValue(c.value));
  const sorted = [...values].sort((a, b) => a - b);

  // Check if it's a valid sequence considering available interns
  let gaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    gaps += sorted[i] - sorted[i-1] - 1;
  }

  // Need enough interns to fill gaps
  return gaps <= availableInterns && 
         (values.every((v, i) => i === 0 || v > values[i-1]) || // ascending
          values.every((v, i) => i === 0 || v < values[i-1]));  // descending
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

  // Check each department's cards
  let dept4: string | null = null;
  let dept3: string | null = null;

  for (const dept of departments) {
    const cards = departmentGroups.get(dept) || [];
    const deptInterns = cards.filter(c => c.type === "intern").length;
    const totalInterns = deptInterns + universalInterns.length;
    const regularCards = cards.filter(c => c.type === "department");

    // Check if this department can form a valid sequence of either 4 or 3 cards
    if (regularCards.length + totalInterns === 4 && isValidSequence(cards, totalInterns)) {
      dept4 = dept;
    } else if (regularCards.length + totalInterns === 3 && isValidSequence(cards, totalInterns)) {
      dept3 = dept;
    }
  }

  // Must have exactly one department with 4 cards and one with 3 cards
  return dept4 !== null && dept3 !== null && dept4 !== dept3;
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