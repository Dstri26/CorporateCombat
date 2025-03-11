import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hand from "./Hand";
import { Button } from "@/components/ui/button";
import { createDeck, shuffleDeck, dealInitialHands, checkWinCondition } from "@/lib/game";
import type { Card, Player } from "@shared/schema";

export default function GameBoard() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Player>("player");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const { playerHand, aiHand, remainingDeck } = dealInitialHands(newDeck);
    
    setDeck(remainingDeck);
    setPlayerHand(playerHand);
    setAiHand(aiHand);
    setDiscardPile([]);
    setCurrentTurn("player");
    setGameStatus("playing");
  };

  const handleCardPlay = (card: Card) => {
    if (currentTurn !== "player" || gameStatus !== "playing") return;

    // Add card to discard pile
    setDiscardPile(prev => [...prev, card]);
    
    // Remove card from player's hand
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    
    // Draw new card
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setPlayerHand(prev => [...prev, newCard]);
      setDeck(remainingDeck);
    }

    // Check win condition
    if (checkWinCondition(playerHand)) {
      setGameStatus("won");
      return;
    }

    setCurrentTurn("ai");
    // AI turn would happen here
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl bg-card rounded-lg p-8 shadow-lg">
        {/* AI Hand (face down) */}
        <div className="mb-8">
          <Hand 
            cards={aiHand.map(card => ({ ...card, value: "?" }))} 
            isPlayerHand={false}
          />
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">
            {gameStatus === "playing" 
              ? `Current Turn: ${currentTurn === "player" ? "Your" : "AI's"} Turn`
              : gameStatus === "won" 
                ? "You've won! Time for a promotion! 🎉"
                : "Game Over - Better luck next quarter! 📉"}
          </h2>
        </div>

        {/* Discard Pile */}
        <div className="flex justify-center mb-8">
          {discardPile.length > 0 && (
            <Card card={discardPile[discardPile.length - 1]} />
          )}
        </div>

        {/* Player Hand */}
        <Hand 
          cards={playerHand}
          onCardClick={handleCardPlay}
          isPlayerHand={true}
        />

        {/* Game Controls */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={startNewGame}
            variant="secondary"
          >
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
