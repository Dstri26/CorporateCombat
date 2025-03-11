import { motion } from "framer-motion";
import type { Card as CardType } from "@shared/schema";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isDraggable?: boolean;
}

const Card = ({ card, onClick, isDraggable }: CardProps) => {
  const departmentColors = {
    DEV: "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300 text-blue-900",
    HRA: "bg-gradient-to-br from-pink-100 to-pink-50 border-pink-300 text-pink-900",
    MKT: "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300 text-purple-900",
    FIN: "bg-gradient-to-br from-green-100 to-green-50 border-green-300 text-green-900",
    UNIVERSAL: "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-300 text-yellow-900"
  };

  const isIntern = card.type === "intern";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${departmentColors[card.department as keyof typeof departmentColors] || "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300"}
        w-36 h-52 rounded-xl shadow-lg flex flex-col justify-between p-4 
        cursor-pointer border-2 select-none backdrop-blur-sm
        ${isIntern ? "border-dashed" : ""}
        transition-all duration-200 hover:shadow-xl
      `}
      onClick={onClick}
      draggable={isDraggable}
    >
      <div className="text-sm font-semibold flex items-center gap-2">
        {isIntern ? (card.isUniversal ? "Universal" : card.department) : card.department}
        {isIntern && <span className="text-lg">👤</span>}
      </div>
      <div className="text-5xl font-bold text-center my-4">
        {isIntern ? "🎓" : card.value}
      </div>
      <div className="text-sm font-semibold self-end">
        {isIntern ? "Intern" : card.department}
      </div>
    </motion.div>
  );
}

export default Card;