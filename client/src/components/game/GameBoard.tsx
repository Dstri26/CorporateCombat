import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hand from "./Hand";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import {
  createDeck,
  shuffleDeck,
  dealInitialHands,
  checkWinCondition,
  sortHand,
} from "@/lib/game";
import type { Card as CardType, Player } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function GameOverDialog({
  isOpen,
  playerHand,
  aiHand,
  winner,
  onClose,
}: {
  isOpen: boolean;
  playerHand: CardType[];
  aiHand: CardType[];
  winner: "player" | "ai";
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-4xl slate-900/95 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-center mb-4 md:mb-6">
            {winner === "player" ? (
              <span className="text-primary">Congratulations! You've Won!</span>
            ) : (
              <span className="text-destructive">Game Over - AI Wins!</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-4">
            <h3 className="text-base md:text-lg font-medium text-slate-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2 text-red-400"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              AI's Final Hand:
            </h3>
            <Hand cards={aiHand} isPlayerHand={false} />
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-base md:text-lg font-medium text-slate-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2 text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              Your Final Hand:
            </h3>
            <Hand cards={playerHand} isPlayerHand={true} />
          </div>

          <div className="flex justify-center pt-2 md:pt-4">
            <Button
              onClick={onClose}
              size="lg"
              className="px-6 md:px-8 bg-primary hover:bg-primary/90 text-white"
            >
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GameBoard() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [aiHand, setAiHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Player>("player");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing",
  );
  const [canDraw, setCanDraw] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const { playerHand, aiHand, remainingDeck } = dealInitialHands(newDeck);

    setDeck(remainingDeck);
    setPlayerHand(sortHand(playerHand));
    setAiHand(sortHand(aiHand));
    setDiscardPile([]);
    setCurrentTurn("player");
    setGameStatus("playing");
    setCanDraw(true);
    setShowGameOver(false);
  };

  const drawCard = (source: "deck" | "discard") => {
    if (currentTurn !== "player" || !canDraw || gameStatus !== "playing")
      return;

    if (source === "deck") {
      if (deck.length === 0) {
        const newDeck = shuffleDeck([...discardPile.slice(0, -1)]);
        setDeck(newDeck);
        setDiscardPile([discardPile[discardPile.length - 1]]);
        return;
      }
      const [newCard, ...remainingDeck] = deck;
      setPlayerHand((prev) => sortHand([...prev, newCard]));
      setDeck(remainingDeck);
    } else if (discardPile.length > 0) {
      const topCard = discardPile[discardPile.length - 1];
      setPlayerHand((prev) => sortHand([...prev, topCard]));
      setDiscardPile((prev) => prev.slice(0, -1));
    }
    setCanDraw(false);
  };

  const handleCardClick = (card: CardType) => {
    if (currentTurn !== "player" || gameStatus !== "playing") return;

    if (canDraw) {
      toast({
        title: "Draw First",
        description: "You must draw a card before discarding.",
      });
      return;
    }
    if (playerHand.length <= 7) {
      toast({
        title: "Cannot Discard",
        description: "You must have more than 7 cards to discard.",
      });
      return;
    }
    setPlayerHand((prev) => sortHand(prev.filter((c) => c.id !== card.id)));
    setDiscardPile((prev) => [...prev, card]);

    const updatedHand = playerHand.filter((c) => c.id !== card.id);
    if (updatedHand.length === 7 && checkWinCondition(updatedHand)) {
      setGameStatus("won");
      setShowGameOver(true);
      toast({
        title: "I SUBMIT MY RESIGNATION™!",
        description:
          "Congratulations! You've built the perfect Career Portfolio™!",
      });
      return;
    }

    setCurrentTurn("ai");
    setCanDraw(true);
    setTimeout(handleAITurn, 1000);
  };

  const handleAITurn = () => {
    if (aiHand.length === 0) return;
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setAiHand((prev) => sortHand([...prev, newCard]));
      setDeck(remainingDeck);

      const cardToDiscard = aiHand[0];
      setDiscardPile((prev) => [...prev, cardToDiscard]);
      setAiHand((prev) =>
        sortHand(prev.filter((c) => c.id !== cardToDiscard.id)),
      );

      const updatedHand = aiHand.filter((c) => c.id !== cardToDiscard.id);
      if (updatedHand.length === 7 && checkWinCondition(updatedHand)) {
        setGameStatus("lost");
        setShowGameOver(true);
        toast({
          title: "Game Over",
          description: "The AI has built a better Career Portfolio™!",
        });
        return;
      }
    }
    setCurrentTurn("player");
  };

  return (
    <motion.div
      className="min-h-screen w-screen bg-gradient-to-b from-slate-900 to-slate-800 py-2 md:py-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[2000px] mx-auto px-2 md:px-4">
        {/* AI Hand */}
        <motion.div
          className="mb-4 md:mb-6 p-3 md:p-4 bg-slate-800/40 backdrop-blur-md rounded-lg md:rounded-xl border border-slate-700/50"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-slate-300 mb-2 text-base md:text-lg font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2 text-red-400"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            Opponent's Hand
          </h3>
          <Hand
            cards={aiHand.map((card) => ({ ...card, value: "?" }))}
            isPlayerHand={false}
          />
        </motion.div>

        {/* Game Area: Draw Pile, Status Banner, Discard Pile */}
        <motion.div
          className="flex justify-center items-center gap-4 md:gap-8 mb-4 md:mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Draw Pile */}
          <div className="relative">
            {deck.length > 0 ? (
              <motion.div
                className={`
                  w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40
                  bg-gradient-to-br from-primary via-primary/90 to-primary/70
                  rounded-xl shadow-lg flex flex-col items-center justify-center relative
                  transition-all duration-200 group
                  ${
                    currentTurn === "player" && canDraw
                      ? "cursor-pointer hover:shadow-primary/30 hover:shadow-2xl"
                      : "opacity-50"
                  }
                  overflow-hidden border-t-2 border-primary-light
                `}
                onClick={() => drawCard("deck")}
                whileHover={{
                  scale: currentTurn === "player" && canDraw ? 1.08 : 1,
                  rotateY: currentTurn === "player" && canDraw ? 5 : 0,
                  boxShadow:
                    currentTurn === "player" && canDraw
                      ? "0 20px 30px -10px rgba(56, 189, 248, 0.4)"
                      : "none",
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-1 p-2">
                    {Array(12)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="rounded-sm bg-white/10"></div>
                      ))}
                  </div>
                </div>

                <div className="text-center text-white relative z-10">
                  <span className="block text-base sm:text-lg md:text-xl font-bold mb-1">
                    Draw
                  </span>
                  <span className="flex items-center justify-center gap-1 text-sm opacity-90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                    </svg>
                    {deck.length}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-light/20 rounded-full blur-xl"></div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-light/20 rounded-full blur-lg"></div>
              </motion.div>
            ) : (
              <div className="w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-sm">
                Empty
              </div>
            )}
          </div>

          {/* Compact Game Status Banner */}
          <motion.div className="text-center">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {gameStatus === "playing"
                ? `${currentTurn === "player" ? "Your" : "AI's"} Turn`
                : gameStatus === "won"
                  ? "I SUBMIT MY RESIGNATION™!"
                  : "Game Over"}
            </h2>
            {currentTurn === "player" &&
              canDraw &&
              gameStatus === "playing" && (
                <p className="text-slate-400 text-xs md:text-sm">
                  Draw a card to start your turn
                </p>
              )}
          </motion.div>

          {/* Discard Pile */}
          <div className="relative">
            {discardPile.length > 0 ? (
              <motion.div
                className={`
                  transition-all duration-200 relative
                  ${currentTurn === "player" && canDraw ? "cursor-pointer" : ""}
                `}
                onClick={() =>
                  currentTurn === "player" && canDraw && drawCard("discard")
                }
                whileHover={{
                  scale: currentTurn === "player" && canDraw ? 1.08 : 1,
                  rotateZ: currentTurn === "player" && canDraw ? 2 : 0,
                }}
              >
                {currentTurn === "player" && canDraw && (
                  <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <Card card={discardPile[discardPile.length - 1]} />
              </motion.div>
            ) : (
              <div className="w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-sm">
                Discard
              </div>
            )}
          </div>
        </motion.div>

        {/* Player Hand */}
        <motion.div
          className="p-3 md:p-4 bg-slate-800/40 backdrop-blur-md rounded-lg md:rounded-xl border border-slate-700/50 mb-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-slate-300 mb-2 text-base md:text-lg font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z"
                clipRule="evenodd"
              />
              <path d="M15.01 11.25a.75.75 0 00-1.5 0v2.664l-2.13-2.13a.75.75 0 10-1.06 1.06l3.19 3.19a.75.75 0 001.06 0l3.19-3.19a.75.75 0 10-1.06-1.06l-2.13 2.13V11.25z" />
            </svg>
            Your Hand
          </h3>
          <Hand
            cards={playerHand}
            onCardClick={handleCardClick}
            isPlayerHand={true}
          />
        </motion.div>

        {/* Game Controls */}
        <motion.div
          className="flex justify-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={startNewGame}
            variant="outline"
            size="default"
            className="text-base md:text-lg px-4 md:px-8 border-primary text-primary hover:bg-primary/10"
          >
            New Game
          </Button>
        </motion.div>
      </div>

      {/* Game Over Dialog */}
      <GameOverDialog
        isOpen={showGameOver}
        playerHand={playerHand}
        aiHand={aiHand}
        winner={gameStatus === "won" ? "player" : "ai"}
        onClose={startNewGame}
      />
    </motion.div>
  );
}
