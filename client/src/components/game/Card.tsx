import { motion } from "framer-motion";
import type { Card as CardType } from "@shared/schema";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isDraggable?: boolean;
}

const Card = ({ card, onClick, isDraggable }: CardProps) => {
  const departmentColors = {
    HR: "bg-pink-100 border-pink-300",
    IT: "bg-blue-100 border-blue-300",
    Finance: "bg-green-100 border-green-300",
    Marketing: "bg-purple-100 border-purple-300",
    Sales: "bg-yellow-100 border-yellow-300",
    Operations: "bg-orange-100 border-orange-300"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        ${departmentColors[card.department as keyof typeof departmentColors]}
        w-32 h-48 rounded-lg shadow-md flex flex-col justify-between p-4 
        cursor-pointer border-2 select-none
      `}
      onClick={onClick}
      draggable={isDraggable}
    >
      <div className="text-sm font-semibold">{card.department}</div>
      <div className="text-4xl font-bold text-center">{card.value}</div>
      <div className="text-sm font-semibold self-end">{card.department}</div>
    </motion.div>
  );
}

export default Card;