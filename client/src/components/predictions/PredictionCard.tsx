import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePredictionMarket } from "@/hooks/useWeb3Contracts";
import { useAddress } from "@thirdweb-dev/react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  totalStaked: number;
  participants: number;
  yesPercentage: number;
  noPercentage: number;
  status: "active" | "resolved" | "pending";
  result?: "yes" | "no";
}

export function PredictionCard({
  id,
  title,
  description,
  category,
  endDate,
  totalStaked,
  participants,
  yesPercentage,
  noPercentage,
  status,
  result
}: PredictionCardProps) {
  const [betAmount, setBetAmount] = useState("0.01");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const { toast } = useToast();
  const address = useAddress();
  const { placeBet, resolveMarket } = usePredictionMarket(id); // Assuming id is the contract address

  const handlePlaceBet = async (position: 'yes' | 'no') => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place a bet",
        variant: "destructive"
      });
      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingBet(true);

    try {
      // Check if this is a real contract or mock data
      if (!placeBet) {
        throw new Error("Contract not deployed - this is demo data");
      }

      // Convert position to enum value (0 = Yes, 1 = No)
      const positionValue = position === 'yes' ? 0 : 1;

      // Place bet - this will prompt wallet confirmation
      await placeBet({
        args: [positionValue],
        overrides: {
          value: betAmount // Amount in ETH
        }
      });

      toast({
        title: "Bet placed successfully!",
        description: `You bet ${betAmount} ETH on ${position.toUpperCase()}`,
      });

      // Reset bet amount
      setBetAmount("0.01");

    } catch (error: any) {
      console.error("Error placing bet:", error);
      
      // More specific error handling
      if (error.message?.includes("demo data") || error.message?.includes("Contract not deployed")) {
        toast({
          title: "Demo Mode",
          description: "This is demo data - actual betting requires deployed contracts on Flare Network",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to place bet",
          description: error.message || "Transaction failed or was cancelled",
          variant: "destructive"
        });
      }
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleResolveMarket = async (marketResult: 0 | 1) => { // 0 for Yes, 1 for No
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to resolve the market",
        variant: "destructive"
      });
      return;
    }

    setIsResolving(true);

    try {
      // Check if this is a real contract or mock data
      if (!resolveMarket) {
        throw new Error("Contract not deployed - this is demo data");
      }

      await resolveMarket({
        args: [marketResult]
      });

      toast({
        title: "Market resolved successfully!",
        description: `The market was resolved as ${marketResult === 0 ? 'YES' : 'NO'}`,
      });

    } catch (error: any) {
      console.error("Error resolving market:", error);
      
      // More specific error handling
      if (error.message?.includes("demo data") || error.message?.includes("Contract not deployed")) {
        toast({
          title: "Demo Mode",
          description: "This is demo data - actual smart contract resolution requires deployed contracts on Flare Network",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to resolve market",
          description: error.message || "Transaction failed or was cancelled",
          variant: "destructive"
        });
      }
    } finally {
      setIsResolving(false);
    }
  };

  const timeRemaining = new Date(endDate).getTime() - Date.now();
  const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  // Calculate betting cutoff (1 hour before end time)
  const bettingCutoffTime = new Date(endDate).getTime() - (60 * 60 * 1000); // 1 hour before
  const timeToBettingCutoff = bettingCutoffTime - Date.now();
  const isBettingClosed = timeToBettingCutoff <= 0;
  const hoursUntilBettingEnds = Math.ceil(timeToBettingCutoff / (1000 * 60 * 60));

  const isMarketCreator = true; // This should be fetched from context or props
  const isResolved = status === "resolved";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="glass surface-interactive border-border/40 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge
                variant={isResolved ? "secondary" : "default"}
                className="text-xs"
              >
                {category}
              </Badge>
              <CardTitle className="text-lg leading-tight text-foreground">
                {title}
              </CardTitle>
            </div>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              className={cn(
                status === "active" && "bg-success/10 text-success border-success/20",
                status === "resolved" && result === "yes" && "bg-success/10 text-success border-success/20",
                status === "resolved" && result === "no" && "bg-destructive/10 text-destructive border-destructive/20"
              )}
            >
              {status === "resolved" ? `${result?.toUpperCase()} Won` : "Active"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prediction Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
              </div>
              <p className="text-sm font-medium">
                {isBettingClosed
                  ? "Betting Closed"
                  : hoursUntilBettingEnds > 24
                    ? `${Math.ceil(hoursUntilBettingEnds / 24)}d to bet`
                    : `${hoursUntilBettingEnds}h to bet`
                }
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-1" />
              </div>
              <p className="text-sm font-medium">{totalStaked} ETH</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
              </div>
              <p className="text-sm font-medium">{participants}</p>
            </div>
          </div>

          {/* Prediction Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-success font-medium">YES {yesPercentage}%</span>
              <span className="text-destructive font-medium">NO {noPercentage}%</span>
            </div>
            <div className="relative">
              <Progress
                value={yesPercentage}
                className="h-2 bg-destructive/20"
              />
              <div
                className="absolute top-0 left-0 h-2 bg-success rounded-full transition-all duration-300"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
          </div>

          {/* Betting Closed Notice */}
          {status === "active" && isBettingClosed && !isResolved && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-800 font-medium">
                🔒 Betting has closed for this market
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Event is in progress. Awaiting resolution.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {status === "active" && !isBettingClosed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                step="0.01"
                min="0.001"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 mr-2"
                onClick={() => handlePlaceBet('yes')}
                disabled={isPlacingBet || !address || isBettingClosed}
              >
                {isPlacingBet ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-1" />
                )}
                Bet Yes ({yesPercentage}%)
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                onClick={() => handlePlaceBet('no')}
                disabled={isPlacingBet || !address || isBettingClosed}
              >
                {isPlacingBet ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                Bet No ({noPercentage}%)
              </Button>
            </div>
          </div>
        )}

        {/* Resolution Button for Market Creator */}
        {status === "active" && isMarketCreator && timeRemaining <= 0 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              onClick={() => handleResolveMarket(0)} // Resolve as YES
              disabled={isResolving}
            >
              {isResolving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              Resolve as YES
            </Button>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white w-full"
              onClick={() => handleResolveMarket(1)} // Resolve as NO
              disabled={isResolving}
            >
              {isResolving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              Resolve as NO
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
    </motion.div>
  );
}