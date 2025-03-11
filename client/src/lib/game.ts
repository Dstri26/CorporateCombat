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
function isValidSequence(cards: Card[], interns: Card[]): boolean {
  if (cards.length === 0) return false;

  const values = cards
    .filter(c => c.type === "department")
    .map(c => getCardValue(c.value));

  // Sort values for checking sequences
  const sortedValues = [...values].sort((a, b) => a - b);

  // Check for gaps that can be filled by interns
  let gaps = 0;
  for (let i = 1; i < sortedValues.length; i++) {
    gaps += sortedValues[i] - sortedValues[i-1] - 1;
  }

  // We need enough interns to fill the gaps
  if (gaps > interns.length) return false;

  // Check if sequence is ascending
  const isAscending = values.every((val, i) => i === 0 || val > values[i - 1]);
  // Check if sequence is descending
  const isDescending = values.every((val, i) => i === 0 || val < values[i - 1]);

  return isAscending || isDescending;
}

export function checkWinCondition(hand: Card[]): boolean {
  if (hand.length !== 7) return false;

  // Group cards by department
  const departmentGroups = new Map<string, Card[]>();
  const universalInterns: Card[] = [];

  // Separate cards into departments and collect universal interns
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

  // Try to find valid 4+3 combination
  let found = false;
  departmentGroups.forEach((cards, dept1) => {
    // Check if this department can form a sequence of 4
    if (cards.length <= 4) {
      // Include department-specific interns and universal interns
      const availableInterns = [
        ...universalInterns,
        ...cards.filter(c => c.type === "intern")
      ];

      if (cards.length + availableInterns.length >= 4 && 
          isValidSequence(cards, availableInterns)) {
        // If we found a valid 4-card sequence, look for a 3-card sequence
        departmentGroups.forEach((otherCards, dept2) => {
          if (dept1 !== dept2 && otherCards.length <= 3) {
            // Check remaining interns for the second sequence
            const remainingInterns = availableInterns.slice(4 - cards.length);
            if (otherCards.length + remainingInterns.length >= 3 && 
                isValidSequence(otherCards, remainingInterns)) {
              found = true;
            }
          }
        });
      }
    }
  });

  return found;
}