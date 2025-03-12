import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trophy,
  Users,
  Database,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Updated tutorial steps with both concise and detailed content
const tutorialSteps = [
  {
    title: "Welcome to Corporate Combat™",
    summary: "A strategic card game of corporate climbing and career building.",
    details: [
      "Corporate Combat™ is a fast-paced card game where players compete to build the perfect Career Portfolio™.",
      "Using department cards and Wild Interns, you'll strategically collect sequences that represent your corporate expertise.",
      "Quick thinking, tactical draws, and perfectly timed discards are your path to victory in this corporate battlefield.",
    ],
    icon: Trophy,
    color: "bg-gradient-to-r from-purple-600 to-blue-500",
    image: "/api/placeholder/600/300",
  },
  {
    title: "The Goal - Your Career Portfolio™",
    summary: "Win by collecting EXACTLY 7 cards in specific sequences.",
    details: [
      "To win, you must build a Career Portfolio™ of EXACTLY 7 cards in your hand.",
      "This must include 4 cards from one department in sequence (ascending or descending) and 3 cards from another department also in sequence.",
      "For example: Technology 5-6-7-8 plus HR A-K-Q would be a winning hand.",
      "Wild Interns can substitute for any card in a sequence but become locked to that position once used.",
    ],
    icon: Briefcase,
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
    image: "/api/placeholder/600/300",
  },
  {
    title: "The Cards",
    summary: "Master 4 departments and strategic Wild Intern cards.",
    details: [
      "The deck contains 54 cards across 4 corporate departments: Technology (DEV), Human Resources (HR), Marketing (MKT), and Finance (FIN).",
      "Each department has 12 cards ranked: 1, 2, 3, 4, 5, 6, 7, 8, 9, A, E, O.",
      "There are 6 Wild Intern cards: 4 department-specific (can only replace cards in their department) and 2 universal (can replace any card).",
      "Recognition of card sequences and strategic use of Wild Interns is crucial to victory.",
    ],
    icon: Database,
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    image: "/api/placeholder/600/300",
  },
  {
    title: "Your Turn",
    summary: "Draw one card, discard one card. Always maintain 7 cards.",
    details: [
      "On your turn, first draw exactly ONE card from either:",
      "- The Draw Pile (face down)",
      "- The Discard Pile (only the top card, and only if it's a department or intern card)",
      "After drawing, you MUST discard exactly ONE card to the Discard Pile.",
      "You must always maintain EXACTLY 7 cards in your hand - no more, no less.",
      "Skipping turns is not allowed. The game keeps moving at corporate speed!",
    ],
    icon: Users,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    image: "/api/placeholder/600/300",
  },
  {
    title: "Winning the Game",
    summary:
      "Declare 'I SUBMIT MY RESIGNATION™!' when you have your perfect portfolio.",
    details: [
      "As soon as you have assembled your perfect Career Portfolio™ of 7 cards:",
      "- 4 cards from one department in sequence",
      "- 3 cards from another department in sequence",
      "You must immediately declare 'I SUBMIT MY RESIGNATION™!' to win the game.",
      "If two players have winning hands simultaneously, the first to make the declaration wins.",
      "Remember: timing is everything in the corporate world!",
    ],
    icon: Trophy,
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
    image: "/api/placeholder/600/300",
  },
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeState, setFadeState] = useState("in");
  const [expandedView, setExpandedView] = useState(false);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setFadeState("out");
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setExpandedView(false);
        setFadeState("in");
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setFadeState("out");
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setExpandedView(false);
        setFadeState("in");
      }, 300);
    }
  };

  const toggleView = () => {
    setExpandedView(!expandedView);
  };

  // Progress indicator
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const CurrentIcon = tutorialSteps[currentStep].icon;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 bg-gray-900 min-h-screen flex items-center justify-center">
      <Card className="w-full border-0 shadow-xl overflow-hidden bg-gray-800 text-white">
        <CardHeader
          className={`${tutorialSteps[currentStep].color} p-4 sm:p-5 md:p-6 text-white relative`}
        >
          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
              <CurrentIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
              {tutorialSteps[currentStep].title}
            </CardTitle>
          </div>
          <div className="w-full bg-black/20 h-1 mt-3 sm:mt-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div
            className={`transition-opacity duration-300 ${fadeState === "in" ? "opacity-100" : "opacity-0"}`}
          >
            <div className="bg-gray-700 rounded-xl overflow-hidden mb-4 sm:mb-5 md:mb-6"></div>

            {/* Collapsed view (summary) */}
            <div className="mb-3 sm:mb-4">
              <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
                {tutorialSteps[currentStep].summary}
              </p>
            </div>

            {/* Toggle button */}
            <Button
              onClick={toggleView}
              variant="ghost"
              className="w-full flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-5 md:mb-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 py-2 sm:py-2.5 text-sm sm:text-base"
            >
              {expandedView ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  <span>Show Details</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>

            {/* Expanded view (details) */}
            {expandedView && (
              <div className="mb-4 sm:mb-5 md:mb-6 bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-600 animate-fadeIn">
                {tutorialSteps[currentStep].details.map((detail, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base text-gray-200 mb-2 sm:mb-3 last:mb-0"
                  >
                    {detail}
                  </p>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Previous</span>
              </Button>

              <div className="flex space-x-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full ${currentStep === index ? "bg-white" : "bg-gray-600"}`}
                  />
                ))}
              </div>

              {currentStep < tutorialSteps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              ) : (
                <Link href="/game">
                  <Button className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-500 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3">
                    <span className="hidden xs:inline">Start Game</span>
                    <span className="xs:hidden">Start</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
