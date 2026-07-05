import { games } from '../data/games';

// 1. SINGLETON PATTERN
// Problem: We need a centralized, single source of truth for the game catalog and its packages, representing the Admin's configuration.
// Solution: Use a Singleton to ensure only one instance of the GameCatalog exists and provides global access to it.

export class GameCatalog {
    private static instance: GameCatalog;
    private gameData: any[];

    private constructor() {
        this.gameData = games;
        console.log("[Singleton] GameCatalog initialized.");
    }

    public static getInstance(): GameCatalog {
        if (!GameCatalog.instance) {
            GameCatalog.instance = new GameCatalog();
        }
        return GameCatalog.instance;
    }

    public getAllGames() {
        return this.gameData;
    }

    public getGameById(id: string) {
        return this.gameData.find(g => g.id === id);
    }
}
