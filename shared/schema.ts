import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  playerHand: jsonb("player_hand").$type<Card[]>().notNull(),
  aiHand: jsonb("ai_hand").$type<Card[]>().notNull(),
  drawPile: jsonb("draw_pile").$type<Card[]>().notNull(),
  discardPile: jsonb("discard_pile").$type<Card[]>().notNull(),
  currentTurn: text("current_turn").notNull(),
  gameStatus: text("game_status").notNull(),
});

export const insertGameStateSchema = createInsertSchema(gameStates);

export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameStates.$inferSelect;

// Game related types
export type Card = {
  id: string;
  department: string;
  value: string;
  type: "department" | "intern";
  isUniversal?: boolean;
};

export type Player = "player" | "ai";