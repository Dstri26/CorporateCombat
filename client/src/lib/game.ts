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

function isSequential(values: string[]): boolean {
  if (values.length <= 1) return true;

  // Convert card values to numeric values for comparison
  const numericValues = values
    .filter(v => v !== "INTERN") // Ignore interns for sequence check
    .map(getCardValue);

  // Check if sequence is ascending or descending
  const isAscending = numericValues.every((val, i) =>
    i === 0 || val > numericValues[i - 1]
  );

  const isDescending = numericValues.every((val, i) =>
    i === 0 || val < numericValues[i - 1]
  );

  return isAscending || isDescending;
}

export function checkWinCondition(hand: Card[]): boolean {
  if (hand.length !== 7) return false;

  // Group cards by department
  const departmentGroups = new Map<string, Card[]>();
  hand.forEach(card => {
    const dept = card.type === "intern" && card.isUniversal
      ? "UNIVERSAL"
      : card.department;
    if (!departmentGroups.has(dept)) {
      departmentGroups.set(dept, []);
    }
    departmentGroups.get(dept)!.push(card);
  });

  // Find departments with 4 and 3 cards
  let found4 = false;
  let found3 = false;

  departmentGroups.forEach((cards, dept) => {
    // Get department cards including matching interns
    const universalInterns = departmentGroups.get("UNIVERSAL") || [];
    const availableInterns = [
      ...universalInterns,
      ...(cards.filter(c => c.type === "intern"))
    ];

    const deptCards = cards.filter(c => c.type === "department");

    // Check if we can form a valid sequence with available cards
    if (deptCards.length + availableInterns.length >= 4 && !found4) {
      if (isSequential(deptCards.map(c => c.value))) {
        found4 = true;
      }
    } else if (deptCards.length + availableInterns.length >= 3 && !found3) {
      if (isSequential(deptCards.map(c => c.value))) {
        found3 = true;
      }
    }
  });

  return found4 && found3;
}