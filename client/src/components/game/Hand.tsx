import { motion } from "framer-motion";
import Card from "./Card";
import type { Card as CardType } from "@shared/schema";

interface HandProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
  isPlayerHand?: boolean;
}

export default function Hand({
  cards,
  onCardClick,
  isPlayerHand = false,
}: HandProps) {
  // Calculate a nice overlap effect based on number of cards and viewport
  const getCardStyle = (index: number) => {
    if (!isPlayerHand || cards.length <= 3) return {};

    // For player's hand with more cards, create a slight fan effect
    const baseRotation = -6; // Start with slight counterclockwise rotation
    const rotationStep = 12 / (cards.length - 1); // Total 12 degree span
    const rotation = baseRotation + index * rotationStep;

    return {
      rotate: rotation,
      translateY: index === Math.floor(cards.length / 2) ? -5 : 0, // Slightly raise middle card
      zIndex: index + 1,
    };
  };

  // Optimize animations by using simpler variants and reduced motion
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Use a single animation for all cards with a lightweight transition
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative flex justify-center items-center min-h-[150px] sm:min-h-[180px] md:min-h-[200px] p-2 sm:p-3 md:p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2 }}
    >
      {cards.length === 0 ? (
        <div className="text-slate-500 italic text-sm md:text-base">
          No cards in hand
        </div>
      ) : (
        <div
          className={`flex ${isPlayerHand ? "relative" : "flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center"}`}
        >
          {cards.map((card, index) => {
            // Pre-calculate all style properties
            const cardStyle = getCardStyle(index);

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                initial="hidden"
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: cardStyle.rotate || 0,
                  translateY: cardStyle.translateY || 0,
                  zIndex: cardStyle.zIndex || "auto",
                }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.02, // Much shorter delay between cards
                  ease: "easeOut", // Use a simpler easing function instead of spring
                }}
                className={`
                  ${isPlayerHand && cards.length > 3 ? "-ml-4 first:ml-0 hover:translate-y-[-15px] hover:z-50" : ""}
                  transition-transform duration-150
                `}
                whileHover={{
                  scale: isPlayerHand ? 1.05 : 1, // Reduced scale amount
                  zIndex: 50,
                  transition: { duration: 0.1 }, // Faster hover transition
                }}
              >
                <Card
                  card={card}
                  onClick={() => onCardClick?.(card)}
                  isDraggable={isPlayerHand}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Simplified helper text with static opacity to avoid unnecessary animation */}
      {isPlayerHand && cards.length > 7 && (
        <div className="absolute -bottom-1 text-center w-full text-xs text-slate-500 opacity-70">
          Hover and click to discard
        </div>
      )}
    </motion.div>
  );
}
