import { z } from "zod";

// Onchain data types - no database schemas needed
export interface Market {
  contractAddress: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  endDate: Date;
  resolutionDate?: Date;
  status: "active" | "resolved" | "cancelled";
  result?: "yes" | "no" | "cancelled";
  totalStaked: string;
  yesStaked: string;
  noStaked: string;
  participantCount: number;
}

export interface Bet {
  marketAddress: string;
  user: string;
  position: "yes" | "no";
  amount: string;
  txHash: string;
  blockNumber: number;
  claimed: boolean;
  payout: string;
  timestamp: Date;
}

export interface User {
  walletAddress: string;
  createdAt: Date;
}

// Validation schemas for onchain operations
export const createMarketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  endDate: z.string().transform((val) => new Date(val))
});

export const placeBetSchema = z.object({
  position: z.enum(["yes", "no"]),
  amount: z.string()
});

export const resolveMarketSchema = z.object({
  result: z.enum(["yes", "no", "cancelled"])
});

export type CreateMarket = z.infer<typeof createMarketSchema>;
export type PlaceBet = z.infer<typeof placeBetSchema>;
export type ResolveMarket = z.infer<typeof resolveMarketSchema>;
