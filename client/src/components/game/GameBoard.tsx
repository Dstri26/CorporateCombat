import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hand from "./Hand";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { createDeck, shuffleDeck, dealInitialHands, checkWinCondition } from "@/lib/game";
import type { Card as CardType, Player } from "@shared/schema";

export default function GameBoard() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [aiHand, setAiHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
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

  const drawCard = (player: Player) => {
    if (deck.length === 0) {
      // Reshuffle discard pile if deck is empty
      const newDeck = shuffleDeck([...discardPile.slice(0, -1)]);
      setDeck(newDeck);
      setDiscardPile([discardPile[discardPile.length - 1]]);
    }

    const [newCard, ...remainingDeck] = deck;
    if (player === "player") {
      setPlayerHand(prev => [...prev, newCard]);
    } else {
      setAiHand(prev => [...prev, newCard]);
    }
    setDeck(remainingDeck);
  };

  const handleCardPlay = (card: CardType) => {
    if (currentTurn !== "player" || gameStatus !== "playing") return;

    // Add card to discard pile
    setDiscardPile(prev => [...prev, card]);

    // Remove card from player's hand
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));

    // Draw new card
    drawCard("player");

    // Check win condition
    const updatedHand = playerHand.filter(c => c.id !== card.id);
    if (checkWinCondition(updatedHand)) {
      setGameStatus("won");
      return;
    }

    setCurrentTurn("ai");
    // AI turn happens after a short delay
    setTimeout(() => {
      handleAITurn();
    }, 1000);
  };

  const handleAITurn = () => {
    if (aiHand.length === 0) return;

    // Simple AI: just play the first card
    const cardToPlay = aiHand[0];

    // Add to discard pile
    setDiscardPile(prev => [...prev, cardToPlay]);

    // Remove from AI hand
    setAiHand(prev => prev.filter(c => c.id !== cardToPlay.id));

    // Draw new card
    drawCard("ai");

    // Check win condition
    if (checkWinCondition(aiHand)) {
      setGameStatus("lost");
      return;
    }

    setCurrentTurn("player");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl bg-card rounded-lg p-8 shadow-lg">
        {/* AI Hand (face down) */}
        <div className="mb-8">
          <Hand 
            cards={aiHand.map(card => ({ ...card, value: 0 }))} 
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

        {/* Game Area */}
        <div className="flex justify-center gap-8 mb-8">
          {/* Draw Pile */}
          <div className="relative">
            {deck.length > 0 && (
              <div 
                className="w-32 h-48 bg-primary rounded-lg shadow-md flex items-center justify-center cursor-pointer"
                onClick={() => currentTurn === "player" && drawCard("player")}
              >
                <span className="text-white font-bold">
                  Draw ({deck.length})
                </span>
              </div>
            )}
          </div>

          {/* Discard Pile */}
          <div className="relative">
            {discardPile.length > 0 && (
              <Card card={discardPile[discardPile.length - 1]} />
            )}
          </div>
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