import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMarketSchema, insertBetSchema } from "@shared/schema";
import { z } from "zod";

// Validation schemas
const createMarketSchema = insertMarketSchema.extend({
  endDate: z.string().transform((val) => new Date(val))
});

const placeBetSchema = insertBetSchema.extend({
  amount: z.string()
});

const resolveMarketSchema = z.object({
  result: z.enum(["yes", "no", "cancelled"])
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data", details: error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const walletAddress = req.params.address;
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/users/:id/wallet", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { walletAddress } = req.body;
      const user = await storage.updateUserWallet(id, walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Market routes
  app.post("/api/markets", async (req, res) => {
    try {
      const marketData = createMarketSchema.parse(req.body);
      const market = await storage.createMarket(marketData);
      res.json(market);
    } catch (error) {
      res.status(400).json({ error: "Invalid market data", details: error });
    }
  });

  app.get("/api/markets", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const status = req.query.status as string;
      
      let markets;
      
      if (category) {
        markets = await storage.getMarketsByCategory(category);
      } else if (status === "active") {
        markets = await storage.getActiveMarkets();
      } else {
        markets = await storage.getAllMarkets(limit, offset);
      }
      
      res.json(markets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/markets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const market = await storage.getMarket(id);
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      res.json(market);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/markets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const market = await storage.updateMarket(id, updates);
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      res.json(market);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/markets/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { result } = resolveMarketSchema.parse(req.body);
      
      const market = await storage.updateMarket(id, {
        status: result === "cancelled" ? "cancelled" : "resolved",
        result: result,
        resolutionDate: new Date()
      });
      
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      
      res.json(market);
    } catch (error) {
      res.status(400).json({ error: "Invalid resolution data", details: error });
    }
  });

  app.get("/api/users/:userId/markets", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const markets = await storage.getUserMarkets(userId);
      res.json(markets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Bet routes
  app.post("/api/markets/:marketId/bets", async (req, res) => {
    try {
      const marketId = parseInt(req.params.marketId);
      const betData = placeBetSchema.parse({
        ...req.body,
        marketId
      });
      
      // Check if market exists and is active
      const market = await storage.getMarket(marketId);
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      
      if (market.status !== "active") {
        return res.status(400).json({ error: "Market is not active" });
      }
      
      if (new Date(market.endDate) <= new Date()) {
        return res.status(400).json({ error: "Market has ended" });
      }
      
      const bet = await storage.placeBet(betData);
      res.json(bet);
    } catch (error) {
      res.status(400).json({ error: "Invalid bet data", details: error });
    }
  });

  app.get("/api/markets/:marketId/bets", async (req, res) => {
    try {
      const marketId = parseInt(req.params.marketId);
      const bets = await storage.getMarketBets(marketId);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/bets", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const marketId = req.query.marketId ? parseInt(req.query.marketId as string) : undefined;
      
      let bets;
      if (marketId) {
        bets = await storage.getUserMarketBet(userId, marketId);
      } else {
        bets = await storage.getUserBets(userId);
      }
      
      res.json(bets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/bets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const bet = await storage.updateBet(id, updates);
      if (!bet) {
        return res.status(404).json({ error: "Bet not found" });
      }
      res.json(bet);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
