import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const tutorialSteps = [
  {
    title: "Welcome to Corporate Combat™",
    content: "Learn how to climb the corporate ladder in this strategic card game!"
  },
  {
    title: "Your Hand",
    content: "You start with 7 cards representing different departments (HR, IT, Finance, etc.)"
  },
  {
    title: "Career Portfolio™",
    content: "To win, collect 4 cards from one department and 3 from another to create your Career Portfolio™"
  },
  {
    title: "Department Purge",
    content: "When you draw a '7' card, you can purge that department's cards from your opponent's hand"
  },
  {
    title: "Taking Turns",
    content: "On your turn, play one card and draw another. Strategic card management is key to victory!"
  }
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tutorial</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">
              {tutorialSteps[currentStep].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {tutorialSteps[currentStep].content}
            </p>
          </motion.div>

          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === tutorialSteps.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
