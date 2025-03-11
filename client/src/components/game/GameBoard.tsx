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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Game Status Banner */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            {gameStatus === "playing" 
              ? `${currentTurn === "player" ? "Your" : "AI's"} Turn`
              : gameStatus === "won" 
                ? "I SUBMIT MY RESIGNATION™!"
                : "Game Over"}
          </h2>
          {currentTurn === "player" && canDraw && gameStatus === "playing" && (
            <p className="text-slate-400 text-lg">
              Draw a card to start your turn
            </p>
          )}
        </div>

        {/* Game Board */}
        <div className="bg-slate-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          {/* AI Hand */}
          <div className="mb-12 p-6 bg-slate-900/30 rounded-xl">
            <h3 className="text-slate-400 mb-4 text-lg font-medium">Opponent's Hand</h3>
            <Hand 
              cards={aiHand.map(card => ({ ...card, value: "?" }))} 
              isPlayerHand={false}
            />
          </div>

          {/* Game Area */}
          <div className="flex justify-center gap-12 mb-12">
            {/* Draw Pile */}
            <div className="relative">
              {deck.length > 0 && (
                <div 
                  className={`
                    w-36 h-52 bg-gradient-to-br from-primary to-primary/80 
                    rounded-xl shadow-lg flex items-center justify-center 
                    transition-all duration-200
                    ${currentTurn === "player" && canDraw 
                      ? "cursor-pointer hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl" 
                      : "opacity-50"}
                  `}
                  onClick={() => drawCard("deck")}
                >
                  <div className="text-center text-white">
                    <span className="block text-2xl font-bold mb-2">Draw</span>
                    <span className="text-lg opacity-80">({deck.length})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Discard Pile */}
            <div className="relative">
              {discardPile.length > 0 ? (
                <div 
                  className={`
                    transition-all duration-200
                    ${currentTurn === "player" && canDraw 
                      ? "cursor-pointer hover:scale-105" 
                      : ""}
                  `}
                  onClick={() => currentTurn === "player" && canDraw && drawCard("discard")}
                >
                  <Card card={discardPile[discardPile.length - 1]} />
                </div>
              ) : (
                <div className="w-36 h-52 border-2 border-dashed border-slate-700 rounded-xl" />
              )}
            </div>
          </div>

          {/* Player Hand */}
          <div className="p-6 bg-slate-900/30 rounded-xl">
            <h3 className="text-slate-400 mb-4 text-lg font-medium">Your Hand</h3>
            <Hand 
              cards={playerHand}
              onCardClick={handleCardClick}
              isPlayerHand={true}
            />
          </div>

          {/* Game Controls */}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={startNewGame}
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              New Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}