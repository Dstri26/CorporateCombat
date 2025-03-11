import { users, type User, type InsertUser } from "@shared/schema";
import { gameStates, type GameState, type InsertGameState } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameState(id: number): Promise<GameState | undefined>;
  createGameState(state: InsertGameState): Promise<GameState>;
  updateGameState(id: number, state: Partial<GameState>): Promise<GameState | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameStates: Map<number, GameState>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.gameStates = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameState(id: number): Promise<GameState | undefined> {
    return this.gameStates.get(id);
  }

  async createGameState(insertState: InsertGameState): Promise<GameState> {
    const id = this.currentId++;
    const state: GameState = { ...insertState, id };
    this.gameStates.set(id, state);
    return state;
  }

  async updateGameState(id: number, state: Partial<GameState>): Promise<GameState | undefined> {
    const existingState = this.gameStates.get(id);
    if (!existingState) return undefined;

    const updatedState = { ...existingState, ...state };
    this.gameStates.set(id, updatedState);
    return updatedState;
  }
}

export const storage = new MemStorage();