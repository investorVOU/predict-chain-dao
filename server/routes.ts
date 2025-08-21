import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Onchain markets endpoint - returns empty array since markets are fetched from blockchain
  app.get("/api/markets", (req, res) => {
    // All markets are stored and retrieved from blockchain
    // Frontend will use web3 hooks to fetch market data from smart contracts
    res.json([]);
  });

  // Onchain market endpoint - returns 404 since markets are on blockchain
  app.get("/api/markets/:id", (req, res) => {
    res.status(404).json({ error: "Market data is stored onchain. Use web3 hooks to fetch market data." });
  });

  // Users endpoint - returns empty array since user data is wallet-based
  app.get("/api/users/wallet/:address", (req, res) => {
    // User data is wallet-based, no database storage needed
    const walletAddress = req.params.address;
    res.json({
      walletAddress,
      createdAt: new Date().toISOString()
    });
  });

  // Placeholder endpoints for bets (onchain)
  app.get("/api/markets/:marketId/bets", (req, res) => {
    res.json([]);
  });

  app.get("/api/users/:userId/bets", (req, res) => {
    res.json([]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
