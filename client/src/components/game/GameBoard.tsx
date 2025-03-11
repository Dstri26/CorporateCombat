import { useState, useEffect } from "react";
import Hand from "./Hand";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { 
  createDeck, 
  shuffleDeck, 
  dealInitialHands, 
  checkWinCondition,
  sortHand
} from "@/lib/game";
import type { Card as CardType, Player } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function GameBoard() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [aiHand, setAiHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Player>("player");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [canDraw, setCanDraw] = useState(true);

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
  };

  const drawCard = (source: "deck" | "discard") => {
    if (currentTurn !== "player" || !canDraw || gameStatus !== "playing") return;

    if (source === "deck") {
      if (deck.length === 0) {
        // Reshuffle discard pile if deck is empty
        const newDeck = shuffleDeck([...discardPile.slice(0, -1)]);
        setDeck(newDeck);
        setDiscardPile([discardPile[discardPile.length - 1]]);
        return;
      }

      const [newCard, ...remainingDeck] = deck;
      setPlayerHand(prev => sortHand([...prev, newCard]));
      setDeck(remainingDeck);
    } else if (discardPile.length > 0) {
      const topCard = discardPile[discardPile.length - 1];
      setPlayerHand(prev => sortHand([...prev, topCard]));
      setDiscardPile(prev => prev.slice(0, -1));
    }

    setCanDraw(false);
  };

  const handleCardClick = (card: CardType) => {
    if (currentTurn !== "player" || gameStatus !== "playing") return;

    // If we haven't drawn yet, can't play cards
    if (canDraw) {
      toast({
        title: "Draw First",
        description: "You must draw a card before discarding."
      });
      return;
    }

    // Only allow discarding when player has more than 7 cards
    if (playerHand.length <= 7) {
      toast({
        title: "Cannot Discard",
        description: "You must have more than 7 cards to discard."
      });
      return;
    }

    // Remove card from player's hand and add to discard pile
    setPlayerHand(prev => sortHand(prev.filter(c => c.id !== card.id)));
    setDiscardPile(prev => [...prev, card]);

    // After discarding, check if we have exactly 7 cards and a valid winning hand
    const updatedHand = playerHand.filter(c => c.id !== card.id);
    if (updatedHand.length === 7 && checkWinCondition(updatedHand)) {
      setGameStatus("won");
      toast({
        title: "I SUBMIT MY RESIGNATION™!",
        description: "Congratulations! You've built the perfect Career Portfolio™!"
      });
      return;
    }

    // Continue with AI's turn
    setCurrentTurn("ai");
    setCanDraw(true);
    setTimeout(handleAITurn, 1000);
  };

  const handleAITurn = () => {
    if (aiHand.length === 0) return;

    // AI draws a card
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setAiHand(prev => sortHand([...prev, newCard]));
      setDeck(remainingDeck);

      // AI discards a card (simple strategy: discard first card)
      const cardToDiscard = aiHand[0];
      setDiscardPile(prev => [...prev, cardToDiscard]);
      setAiHand(prev => sortHand(prev.filter(c => c.id !== cardToDiscard.id)));

      // Check if AI won
      const updatedHand = aiHand.filter(c => c.id !== cardToDiscard.id);
      if (updatedHand.length === 7 && checkWinCondition(updatedHand)) {
        setGameStatus("lost");
        toast({
          title: "Game Over",
          description: "The AI has built a better Career Portfolio™!"
        });
        return;
      }
    }

    setCurrentTurn("player");
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
                ? "I SUBMIT MY RESIGNATION™! 🎉"
                : "Game Over - The AI built a better portfolio! 📉"}
          </h2>
          {currentTurn === "player" && canDraw && gameStatus === "playing" && (
            <p className="text-muted-foreground mt-2">Draw a card to start your turn</p>
          )}
        </div>

        {/* Game Area */}
        <div className="flex justify-center gap-8 mb-8">
          {/* Draw Pile */}
          <div className="relative">
            {deck.length > 0 && (
              <div 
                className={`w-32 h-48 bg-primary rounded-lg shadow-md flex items-center justify-center 
                  ${currentTurn === "player" && canDraw ? "cursor-pointer hover:opacity-90" : "opacity-50"}`}
                onClick={() => drawCard("deck")}
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
              <div onClick={() => currentTurn === "player" && canDraw && drawCard("discard")}>
                <Card card={discardPile[discardPile.length - 1]} />
              </div>
            )}
          </div>
        </div>

        {/* Player Hand */}
        <Hand 
          cards={playerHand}
          onCardClick={handleCardClick}
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