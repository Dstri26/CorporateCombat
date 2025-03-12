import { motion } from "framer-motion";
import type { Card as CardType } from "@shared/schema";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isDraggable?: boolean;
}

const Card = ({ card, onClick, isDraggable }: CardProps) => {
  // Enhanced department styling with improved gradients, text colors, and shadow effects
  const departmentStyles = {
    DEV: {
      background: "bg-gradient-to-br from-blue-100 via-blue-50 to-white",
      border: "border-blue-400",
      text: "text-blue-800",
      shadow: "shadow-blue-400/20",
      iconBg: "bg-blue-800/10",
    },
    HRA: {
      background: "bg-gradient-to-br from-pink-100 via-pink-50 to-white",
      border: "border-pink-400",
      text: "text-pink-800",
      shadow: "shadow-pink-400/20",
      iconBg: "bg-pink-800/10",
    },
    MKT: {
      background: "bg-gradient-to-br from-purple-100 via-purple-50 to-white",
      border: "border-purple-400",
      text: "text-purple-800",
      shadow: "shadow-purple-400/20",
      iconBg: "bg-purple-800/10",
    },
    FIN: {
      background: "bg-gradient-to-br from-green-100 via-green-50 to-white",
      border: "border-green-400",
      text: "text-green-800",
      shadow: "shadow-green-400/20",
      iconBg: "bg-green-800/10",
    },
    UNIVERSAL: {
      background: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white",
      border: "border-yellow-400",
      text: "text-yellow-800",
      shadow: "shadow-yellow-400/20",
      iconBg: "bg-yellow-800/10",
    },
  };

  const isIntern = card.type === "intern";
  const deptStyle = departmentStyles[
    card.department as keyof typeof departmentStyles
  ] || {
    background: "bg-gradient-to-br from-gray-100 via-gray-50 to-white",
    border: "border-gray-400",
    text: "text-gray-800",
    shadow: "shadow-gray-400/20",
    iconBg: "bg-gray-800/10",
  };

  // Graduate cap SVG for interns instead of emoji
  const graduateCapSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full"
    >
      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
      <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
      <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 0 1-1.286 1.794.75.75 0 1 1-1.06-1.06Z" />
    </svg>
  );

  // Person SVG for interns instead of emoji
  const personSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Simplified animations with reduced motion
  const cardMotionProps = {
    whileHover: { scale: 1.05, rotateZ: 0.5 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }, // Fast, lightweight transitions
  };

  return (
    <motion.div
      {...cardMotionProps}
      className={`
        ${deptStyle.background}
        w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40
        rounded-xl ${deptStyle.shadow} shadow-md flex flex-col justify-between 
        py-2 px-3 cursor-pointer border ${deptStyle.border} select-none
        ${isIntern ? "border-dashed" : "border-opacity-70"}
        transition-colors duration-150
      `}
      onClick={onClick}
      draggable={isDraggable}
    >
      {/* Top section with department name and optional icon */}
      <div
        className={`text-xs sm:text-sm font-semibold ${deptStyle.text} flex items-center justify-between`}
      >
        <span className="tracking-tight">
          {isIntern
            ? card.isUniversal
              ? "Universal"
              : card.department
            : card.department}
        </span>
        {isIntern && (
          <span
            className={`rounded-full ${deptStyle.iconBg} p-1 flex items-center justify-center`}
          >
            {personSvg}
          </span>
        )}
      </div>

      {/* Card center with value or intern icon */}
      <div
        className={`flex items-center justify-center h-14 sm:h-16 relative ${deptStyle.text}`}
      >
        {isIntern ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 opacity-90">
            {graduateCapSvg}
          </div>
        ) : (
          <span className="text-3xl sm:text-4xl font-bold relative">
            {card.value}
          </span>
        )}
      </div>

      {/* Bottom section with department name or intern label */}
      <div
        className={`text-xs sm:text-sm font-semibold ${deptStyle.text} self-end opacity-80`}
      >
        {isIntern ? "Intern" : card.department}
      </div>
    </motion.div>
  );
};

export default Card;
