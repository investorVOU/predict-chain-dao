import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, Clock, Users, DollarSign } from "lucide-react";

export function OutcomeResolutionGuide() {
  return (
    <Card className="max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          How Market Resolution & Rewards Work
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Multi-Chain Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🌐 Multi-Chain EVM Support</h3>
          <p className="text-muted-foreground mb-3">
            PredictChain DAO supports all EVM-compatible chains including:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Ethereum</Badge>
            <Badge variant="outline">Polygon</Badge>
            <Badge variant="outline">Binance Smart Chain</Badge>
            <Badge variant="outline">Arbitrum</Badge>
            <Badge variant="outline">Optimism</Badge>
            <Badge variant="outline">Base</Badge>
            <Badge variant="outline">Avalanche</Badge>
            <Badge variant="outline">Fantom</Badge>
            <Badge variant="secondary">Sepolia (Testnet)</Badge>
            <Badge variant="secondary">Goerli (Testnet)</Badge>
            <Badge variant="secondary">Mumbai (Testnet)</Badge>
          </div>
        </div>

        {/* Resolution Process */}
        <div>
          <h3 className="text-lg font-semibold mb-3">⚖️ How Markets Are Resolved</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">1. Market Creator Resolution</p>
                <p className="text-sm text-muted-foreground">
                  After the market end time, the creator can resolve the outcome to YES or NO
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">2. DAO Governance Resolution</p>
                <p className="text-sm text-muted-foreground">
                  The community can vote through DAO governance to resolve disputed outcomes
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium">3. Emergency Resolution</p>
                <p className="text-sm text-muted-foreground">
                  Platform owner can resolve after 7 days if creator is inactive
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-3">💰 How Rewards & Losses Work</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800 dark:text-green-300">Winners</p>
              </div>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Share the losing side's total pool</li>
                <li>• Proportional to your bet amount</li>
                <li>• Plus your original bet back</li>
                <li>• Minus 2.5% platform fee</li>
                <li>• Gain reputation points</li>
                <li>• Eligible for NFT rewards</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="font-semibold text-red-800 dark:text-red-300">Losers</p>
              </div>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Lose entire bet amount</li>
                <li>• Bet goes to winners' pool</li>
                <li>• Lose reputation points</li>
                <li>• Still recorded in profile history</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Fees */}
        <div>
          <h3 className="text-lg font-semibold mb-3">💼 Platform Economics</h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-800 dark:text-blue-300">Platform Fee: 2.5%</p>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Automatically deducted from winnings</li>
              <li>• Collected by smart contract</li>
              <li>• Withdrawable by contract owners</li>
              <li>• Used for platform development & maintenance</li>
            </ul>
          </div>
        </div>

        {/* On-Chain Benefits */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
            🔒 Fully On-Chain Benefits
          </h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            All data is stored on the blockchain: your bets, winnings, reputation, NFT rewards, 
            and governance participation. This ensures transparency, immutability, and true ownership 
            of your prediction history across all supported EVM chains.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}