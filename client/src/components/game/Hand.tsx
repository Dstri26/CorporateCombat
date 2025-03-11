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
      className="flex flex-wrap gap-4 justify-center items-center min-h-[260px] p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            card={card}
            onClick={() => onCardClick?.(card)}
            isDraggable={isPlayerHand}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}