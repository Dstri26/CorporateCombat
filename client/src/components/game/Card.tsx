import { motion } from "framer-motion";
import type { Card as CardType } from "@shared/schema";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isDraggable?: boolean;
}

const Card = ({ card, onClick, isDraggable }: CardProps) => {
  const departmentColors = {
    DEV: "bg-blue-100 border-blue-300",
    HRA: "bg-pink-100 border-pink-300",
    MKT: "bg-purple-100 border-purple-300",
    FIN: "bg-green-100 border-green-300",
    UNIVERSAL: "bg-yellow-100 border-yellow-300"
  };

  const isIntern = card.type === "intern";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        ${departmentColors[card.department as keyof typeof departmentColors] || "bg-gray-100 border-gray-300"}
        w-32 h-48 rounded-lg shadow-md flex flex-col justify-between p-4 
        cursor-pointer border-2 select-none
        ${isIntern ? "border-dashed" : ""}
      `}
      onClick={onClick}
      draggable={isDraggable}
    >
      <div className="text-sm font-semibold">
        {isIntern ? (card.isUniversal ? "Universal" : card.department) : card.department}
      </div>
      <div className="text-4xl font-bold text-center">
        {isIntern ? "👤" : card.value}
      </div>
      <div className="text-sm font-semibold self-end">
        {isIntern ? "Intern" : card.department}
      </div>
    </motion.div>
  );
}

export default Card;