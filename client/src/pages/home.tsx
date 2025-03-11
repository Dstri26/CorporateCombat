import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, Brain, Trophy, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Corporate Combat™
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Think you can build the perfect Career Portfolio™? The AI is waiting to challenge your strategic prowess.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Strategic Gameplay</h3>
          </div>
          <p className="text-slate-400">
            Build your perfect Career Portfolio™ by collecting and sequencing department cards.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Intern Power</h3>
          </div>
          <p className="text-slate-400">
            Use Wild Interns to fill gaps in your department sequences.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">AI Challenge</h3>
          </div>
          <p className="text-slate-400">
            Face off against an AI opponent that's ready to test your strategic skills.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Corporate Victory</h3>
          </div>
          <p className="text-slate-400">
            Submit your resignation in style by building the winning combination first!
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/game">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/20 hover:shadow-2xl"
          >
            Challenge the AI
          </Button>
        </Link>
        <Link href="/tutorial">
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg"
          >
            Learn the Rules
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}