import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  contractAddress: text("contract_address"),
  endDate: timestamp("end_date").notNull(),
  resolutionDate: timestamp("resolution_date"),
  status: text("status").notNull().default("active"), // active, resolved, cancelled
  result: text("result"), // yes, no, cancelled
  totalStaked: decimal("total_staked", { precision: 18, scale: 6 }).default("0"),
  yesStaked: decimal("yes_staked", { precision: 18, scale: 6 }).default("0"),
  noStaked: decimal("no_staked", { precision: 18, scale: 6 }).default("0"),
  participantCount: integer("participant_count").default(0),
  metadata: json("metadata"), // Additional market data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  marketId: integer("market_id").references(() => markets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  position: text("position").notNull(), // "yes" or "no"
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  txHash: text("tx_hash"),
  blockNumber: integer("block_number"),
  claimed: boolean("claimed").default(false),
  payout: decimal("payout", { precision: 18, scale: 6 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMarketSchema = createInsertSchema(markets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalStaked: true,
  yesStaked: true,
  noStaked: true,
  participantCount: true,
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  createdAt: true,
  claimed: true,
  payout: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Market = typeof markets.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof bets.$inferSelect;
