import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, DollarSign, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { toast } from "@/hooks/use-toast";
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
  const [selectedOption, setSelectedOption] = useState<"yes" | "no" | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const address = useAddress();

  const isResolved = status === "resolved";
  
  const handlePlaceBet = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOption || !betAmount || parseFloat(betAmount) <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Please select a position and enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlacingBet(true);
      // This would interact with the smart contract to place the bet
      // For now, just show success message
      toast({
        title: "Bet Placed!",
        description: `Successfully bet ${betAmount} ETH on ${selectedOption.toUpperCase()}`,
      });
      setSelectedOption(null);
      setBetAmount("");
    } catch (error) {
      toast({
        title: "Bet Failed",
        description: "Failed to place bet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };
  const timeRemaining = new Date(endDate).getTime() - Date.now();
  const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

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
              {isResolved ? `${result?.toUpperCase()} Won` : "Active"}
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
                {daysLeft > 0 ? `${daysLeft}d left` : "Ended"}
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

          {/* Action Buttons */}
          {!isResolved && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedOption === "yes" ? "default" : "outline"}
                onClick={() => setSelectedOption("yes")}
                className={cn(
                  "flex items-center justify-center space-x-2",
                  selectedOption === "yes" && "bg-success hover:bg-success/90 text-white border-success"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                <span>YES</span>
              </Button>
              <Button
                variant={selectedOption === "no" ? "default" : "outline"}
                onClick={() => setSelectedOption("no")}
                className={cn(
                  "flex items-center justify-center space-x-2",
                  selectedOption === "no" && "bg-destructive hover:bg-destructive/90 text-white border-destructive"
                )}
              >
                <TrendingDown className="w-4 h-4" />
                <span>NO</span>
              </Button>
            </div>
          )}

          {selectedOption && !isResolved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="pt-3 border-t border-border/40 space-y-3"
            >
              {!address ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your wallet to place a bet
                  </p>
                  <ConnectWallet size="sm" className="w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bet Amount (ETH)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.1"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark"
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet}
                  >
                    {isPlacingBet ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing Bet...
                      </>
                    ) : (
                      `Stake ${betAmount || '0'} ETH on ${selectedOption.toUpperCase()}`
                    )}
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}