import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocket, WebSocketServer } from "ws";
import type { GameState } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });

  // WebSocket handling for real-time game updates
  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection established");

    ws.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log("Received WebSocket message:", data.type);

        switch (data.type) {
          case "UPDATE_GAME_STATE":
            if (data.gameId && data.state) {
              const updatedState = await storage.updateGameState(
                data.gameId,
                data.state
              );
              if (updatedState) {
                ws.send(JSON.stringify({
                  type: "GAME_STATE_UPDATED",
                  state: updatedState
                }));
              }
            }
            break;
          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({ 
          type: "ERROR", 
          message: "Invalid message format" 
        }));
      }
    });
  });

  // REST endpoints
  app.post("/api/games", async (req, res) => {
    try {
      const gameState = await storage.createGameState(req.body);
      res.json(gameState);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameState = await storage.getGameState(parseInt(req.params.id));
      if (!gameState) {
        res.status(404).json({ error: "Game not found" });
        return;
      }
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return httpServer;
}