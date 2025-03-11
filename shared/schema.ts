import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  playerHand: jsonb("player_hand").$type<string[]>().notNull(),
  aiHand: jsonb("ai_hand").$type<string[]>().notNull(),
  drawPile: jsonb("draw_pile").$type<string[]>().notNull(),
  discardPile: jsonb("discard_pile").$type<string[]>().notNull(),
  currentTurn: text("current_turn").notNull(),
  gameStatus: text("game_status").notNull(),
  careerPortfolio: jsonb("career_portfolio").$type<string[]>().notNull(),
});

export const insertGameStateSchema = createInsertSchema(gameStates);

export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameStates.$inferSelect;

// Game related types
export type Card = {
  id: string;
  department: string;
  value: number;
  action?: string;
};

export type Player = "player" | "ai";
