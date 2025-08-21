import { useState } from "react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { MarketCreationDialog } from "@/components/markets/MarketCreationDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMarkets } from "@/hooks/useMarkets";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Trophy,
  Activity,
  Plus
} from "lucide-react";

// Mock data for demonstration
const mockStats = [
  {
    title: "Total Markets",
    value: "247",
    change: "+12% from last month",
    icon: Activity,
    trend: "up" as const
  },
  {
    title: "Total Volume",
    value: "1,234 ETH",
    change: "+23% from last month", 
    icon: DollarSign,
    trend: "up" as const
  },
  {
    title: "Active Users",
    value: "8,924",
    change: "+5% from last month",
    icon: Users,
    trend: "up" as const
  },
  {
    title: "Your Rewards",
    value: "156",
    change: "3 pending claims",
    icon: Trophy,
    trend: "neutral" as const
  }
];

const mockPredictions = [
  {
    id: "1",
    title: "Will Bitcoin reach $100,000 by end of 2024?",
    description: "Predict whether Bitcoin's price will hit the $100k milestone before December 31st, 2024.",
    category: "Cryptocurrency",
    endDate: "2024-12-31",
    totalStaked: 45.6,
    participants: 234,
    yesPercentage: 67,
    noPercentage: 33,
    status: "active" as const
  },
  {
    id: "2", 
    title: "Next US Presidential Election Winner",
    description: "Will the Democratic candidate win the 2024 US Presidential Election?",
    category: "Politics",
    endDate: "2024-11-05",
    totalStaked: 89.2,
    participants: 567,
    yesPercentage: 52,
    noPercentage: 48,
    status: "active" as const
  },
  {
    id: "3",
    title: "Ethereum 2.0 Fully Deployed",
    description: "Will Ethereum complete its transition to Proof of Stake by Q2 2024?",
    category: "Technology",
    endDate: "2024-06-30",
    totalStaked: 23.4,
    participants: 145,
    yesPercentage: 85,
    noPercentage: 15,
    status: "resolved" as const,
    result: "yes" as const
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: markets = [], isLoading } = useMarkets(undefined, "active");
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-primary">
          Decentralized Prediction Markets
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Harness the wisdom of crowds. Make predictions, earn rewards, and shape the future through transparent, on-chain governance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-dark shadow-glow-primary w-full sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Market
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <TrendingUp className="w-5 h-5 mr-2" />
            Browse Markets
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {mockStats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Predictions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Featured Markets</h2>
          <Button variant="outline">View All Markets</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mockPredictions.map((prediction, index) => (
            <motion.div key={prediction.id} variants={itemVariants}>
              <PredictionCard {...prediction} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        initial="hidden" 
        animate="visible"
      >
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "0x742d...4e07", action: "staked 2.5 ETH on", market: "Bitcoin $100k", time: "2 minutes ago" },
                { user: "0x1a2b...9f8c", action: "created new market", market: "AI AGI by 2025", time: "15 minutes ago" },
                { user: "0x9e3f...2d1a", action: "claimed rewards from", market: "Ethereum 2.0", time: "1 hour ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div className="text-sm">
                    <span className="font-medium text-primary">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium text-foreground">{activity.market}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Creation Dialog */}
      <MarketCreationDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}