import { useState, useEffect } from "react";
import Hand from "./Hand";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import { 
  createDeck, 
  shuffleDeck, 
  dealInitialHands, 
  checkWinCondition,
  canPurgeDepartment,
  purgeDepartmentFromHand
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
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [canDraw, setCanDraw] = useState(true);

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
    setCanDraw(true);
    setSelectedCard(null);
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
      setPlayerHand(prev => [...prev, newCard]);
      setDeck(remainingDeck);
    } else if (discardPile.length > 0) {
      const topCard = discardPile[discardPile.length - 1];
      setPlayerHand(prev => [...prev, topCard]);
      setDiscardPile(prev => prev.slice(0, -1));
    }

    setCanDraw(false);
  };

  const handleCardClick = (card: CardType) => {
    if (currentTurn !== "player" || gameStatus !== "playing") return;

    // If we haven't drawn yet, can't play cards
    if (canDraw) {
      toast({
        title: "Draw a card first",
        description: "You must draw a card before playing one."
      });
      return;
    }

    // If card is a 7, allow department purge
    if (canPurgeDepartment(card)) {
      setAiHand(prev => purgeDepartmentFromHand(prev, card.department));
      toast({
        title: "Department Purge!",
        description: `Purged all ${card.department} cards from opponent's hand`
      });
    }

    // Add card to discard pile
    setDiscardPile(prev => [...prev, card]);

    // Remove card from player's hand
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));

    // Check win condition
    const updatedHand = playerHand.filter(c => c.id !== card.id);
    if (checkWinCondition(updatedHand)) {
      setGameStatus("won");
      toast({
        title: "Congratulations!",
        description: "You've built the perfect Career Portfolio™!"
      });
      return;
    }

    // Reset turn state
    setCurrentTurn("ai");
    setCanDraw(true);
    setSelectedCard(null);

    // AI turn happens after a short delay
    setTimeout(handleAITurn, 1000);
  };

  const handleAITurn = () => {
    if (aiHand.length === 0) return;

    // AI draws a card
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setAiHand(prev => [...prev, newCard]);
      setDeck(remainingDeck);
    }

    // Simple AI: just play the first card
    const cardToPlay = aiHand[0];

    // If it's a 7, purge that department from player's hand
    if (canPurgeDepartment(cardToPlay)) {
      setPlayerHand(prev => purgeDepartmentFromHand(prev, cardToPlay.department));
      toast({
        title: "AI Department Purge!",
        description: `AI purged all ${cardToPlay.department} cards from your hand`
      });
    }

    // Add to discard pile
    setDiscardPile(prev => [...prev, cardToPlay]);

    // Remove from AI hand
    setAiHand(prev => prev.filter(c => c.id !== cardToPlay.id));

    // Check win condition
    if (checkWinCondition(aiHand)) {
      setGameStatus("lost");
      toast({
        title: "Game Over",
        description: "The AI has built a better Career Portfolio™!"
      });
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
                ? "Congratulations! You've built the perfect Career Portfolio™! 🎉"
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