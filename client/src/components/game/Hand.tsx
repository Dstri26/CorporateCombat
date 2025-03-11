import { motion } from "framer-motion";
import Card from "./Card";
import type { Card as CardType } from "@shared/schema";

interface HandProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
  isPlayerHand?: boolean;
}

export default function Hand({ cards, onCardClick, isPlayerHand = false }: HandProps) {
  return (
    <motion.div 
      className="flex gap-4 justify-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          isDraggable={isPlayerHand}
        />
      ))}
    </motion.div>
  );
}
