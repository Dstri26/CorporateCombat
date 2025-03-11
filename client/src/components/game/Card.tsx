import { motion } from "framer-motion";
import type { Card as CardType } from "@shared/schema";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isDraggable?: boolean;
}

export default function Card({ card, onClick, isDraggable }: CardProps) {
  const departmentColors = {
    HR: "bg-pink-100",
    IT: "bg-blue-100",
    Finance: "bg-green-100",
    Marketing: "bg-purple-100",
    Sales: "bg-yellow-100",
    Operations: "bg-orange-100"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${
        departmentColors[card.department as keyof typeof departmentColors]
      } w-32 h-48 rounded-lg shadow-md flex flex-col justify-between p-4 cursor-pointer`}
      onClick={onClick}
      draggable={isDraggable}
    >
      <div className="text-sm font-semibold">{card.department}</div>
      <div className="text-4xl font-bold text-center">{card.value}</div>
      <div className="text-sm font-semibold self-end">{card.department}</div>
    </motion.div>
  );
}
