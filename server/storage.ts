import { users, markets, bets, type User, type Market, type Bet, type InsertUser, type InsertMarket, type InsertBet } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(id: number, walletAddress: string): Promise<User | undefined>;
  
  // Market methods
  createMarket(market: InsertMarket): Promise<Market>;
  getMarket(id: number): Promise<Market | undefined>;
  getAllMarkets(limit?: number, offset?: number): Promise<Market[]>;
  getUserMarkets(userId: number): Promise<Market[]>;
  updateMarket(id: number, updates: Partial<Market>): Promise<Market | undefined>;
  getMarketsByCategory(category: string): Promise<Market[]>;
  getActiveMarkets(): Promise<Market[]>;
  
  // Bet methods
  placeBet(bet: InsertBet): Promise<Bet>;
  getMarketBets(marketId: number): Promise<Bet[]>;
  getUserBets(userId: number): Promise<Bet[]>;
  getUserMarketBet(userId: number, marketId: number): Promise<Bet[]>;
  updateBet(id: number, updates: Partial<Bet>): Promise<Bet | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private markets: Map<number, Market>;
  private bets: Map<number, Bet>;
  private currentUserId: number;
  private currentMarketId: number;
  private currentBetId: number;

  constructor() {
    this.users = new Map();
    this.markets = new Map();
    this.bets = new Map();
    this.currentUserId = 1;
    this.currentMarketId = 1;
    this.currentBetId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserWallet(id: number, walletAddress: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, walletAddress };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Market methods
  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const id = this.currentMarketId++;
    const now = new Date();
    const market: Market = {
      ...insertMarket,
      id,
      totalStaked: "0",
      yesStaked: "0",
      noStaked: "0",
      participantCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.markets.set(id, market);
    return market;
  }

  async getMarket(id: number): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async getAllMarkets(limit = 50, offset = 0): Promise<Market[]> {
    const allMarkets = Array.from(this.markets.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return allMarkets.slice(offset, offset + limit);
  }

  async getUserMarkets(userId: number): Promise<Market[]> {
    return Array.from(this.markets.values()).filter(
      (market) => market.creatorId === userId
    );
  }

  async updateMarket(id: number, updates: Partial<Market>): Promise<Market | undefined> {
    const market = this.markets.get(id);
    if (market) {
      const updatedMarket = { 
        ...market, 
        ...updates, 
        updatedAt: new Date() 
      };
      this.markets.set(id, updatedMarket);
      return updatedMarket;
    }
    return undefined;
  }

  async getMarketsByCategory(category: string): Promise<Market[]> {
    return Array.from(this.markets.values()).filter(
      (market) => market.category === category
    );
  }

  async getActiveMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values()).filter(
      (market) => market.status === "active" && new Date(market.endDate) > new Date()
    );
  }

  // Bet methods
  async placeBet(insertBet: InsertBet): Promise<Bet> {
    const id = this.currentBetId++;
    const now = new Date();
    const bet: Bet = {
      ...insertBet,
      id,
      claimed: false,
      payout: "0",
      createdAt: now
    };
    this.bets.set(id, bet);
    
    // Update market statistics
    const market = await this.getMarket(bet.marketId);
    if (market) {
      const amount = parseFloat(bet.amount);
      const newTotalStaked = parseFloat(market.totalStaked) + amount;
      const newParticipantCount = market.participantCount + 1;
      
      let updates: Partial<Market> = {
        totalStaked: newTotalStaked.toString(),
        participantCount: newParticipantCount
      };
      
      if (bet.position === "yes") {
        updates.yesStaked = (parseFloat(market.yesStaked) + amount).toString();
      } else {
        updates.noStaked = (parseFloat(market.noStaked) + amount).toString();
      }
      
      await this.updateMarket(bet.marketId, updates);
    }
    
    return bet;
  }

  async getMarketBets(marketId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(
      (bet) => bet.marketId === marketId
    );
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(
      (bet) => bet.userId === userId
    );
  }

  async getUserMarketBet(userId: number, marketId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(
      (bet) => bet.userId === userId && bet.marketId === marketId
    );
  }

  async updateBet(id: number, updates: Partial<Bet>): Promise<Bet | undefined> {
    const bet = this.bets.get(id);
    if (bet) {
      const updatedBet = { ...bet, ...updates };
      this.bets.set(id, updatedBet);
      return updatedBet;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
