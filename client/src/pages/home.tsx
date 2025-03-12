import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Trophy,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Info,
  Play,
} from "lucide-react";

export default function Home() {
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden w-screen">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Floating card elements */}
        <motion.div
          initial={{ opacity: 0, rotate: -10, y: 50 }}
          animate={{ opacity: 0.1, rotate: -5, y: 0 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-10 w-40 h-56 bg-blue-400/10 rounded-xl border border-blue-400/20"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 10, y: -50 }}
          animate={{ opacity: 0.1, rotate: 5, y: 0 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-40 -right-10 w-40 h-56 bg-primary/10 rounded-xl border border-primary/20"
        ></motion.div>
      </div>

      {/* Logo and title section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-block mb-6 p-3 bg-slate-800/80 rounded-full border border-slate-700 backdrop-blur-sm">
          <Briefcase className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tight">
          Corporate Combat™
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-slate-900/30 p-3 sm:p-4 rounded-lg">
          Build your perfect Career Portfolio™ and outmaneuver your AI opponent
          in this strategic card game of corporate climbing.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-4xl w-full mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[
          {
            icon: Brain,
            title: "Strategic Gameplay",
            description:
              "Build your perfect Career Portfolio™ by collecting and sequencing department cards.",
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: GraduationCap,
            title: "Intern Power",
            description:
              "Use Wild Interns to fill gaps in your department sequences and secure your corporate future.",
            color: "from-emerald-500 to-teal-500",
          },
          {
            icon: Bot,
            title: "AI Challenge",
            description:
              "Face off against an AI opponent that adapts to your gameplay style and tests your strategic skills.",
            color: "from-violet-500 to-purple-500",
          },
          {
            icon: Trophy,
            title: "Corporate Victory",
            description:
              "Submit your resignation in style by assembling your winning combination before your opponent!",
            color: "from-amber-500 to-orange-500",
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={item}
              className="group bg-slate-800/50 rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-slate-700 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className={`bg-gradient-to-r ${feature.color} p-1.5 sm:p-2 rounded-lg text-white`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to action buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link href="/game" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/20 hover:shadow-2xl flex items-center justify-center gap-2 rounded-xl"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            Challenge the AI
          </Button>
        </Link>
        <Link href="/tutorial" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full text-base sm:text-lg px-5 sm:px-6 py-6 sm:py-7 rounded-xl border-slate-600 hover:bg-slate-800 hover:border-primary/50 flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            Learn the Rules
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 opacity-70" />
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-2 bottom-2 sm:bottom-4 text-slate-500 text-xs sm:text-sm text-center px-4 w-100"
      >
        Corporate Combat™ | The ultimate card game of corporate strategy
      </motion.div>

      {/* Add this to your global CSS for the grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
}
