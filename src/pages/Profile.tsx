import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Wallet, 
  TrendingUp, 
  Trophy, 
  Activity,
  Star,
  Copy,
  ExternalLink,
  Target,
  DollarSign,
  Users
} from "lucide-react";
import { useAddress, useConnectionStatus } from "@thirdweb-dev/react";

const mockProfileData = {
  username: "PredictionMaster",
  joinDate: "March 2024",
  totalPredictions: 47,
  correctPredictions: 32,
  accuracyRate: 68,
  totalEarnings: 12.4,
  reputation: 847,
  rank: "Expert Predictor",
  votingPower: 156,
  level: 7,
  experienceToNextLevel: 340,
  totalExperience: 1560
};

const recentPredictions = [
  {
    id: "1",
    title: "Bitcoin $100k by 2024",
    prediction: "YES",
    stake: 2.5,
    status: "active",
    confidence: 85
  },
  {
    id: "2", 
    title: "Tesla Stock Above $300",
    prediction: "NO",
    stake: 1.8,
    status: "won",
    payout: 3.2,
    confidence: 72
  },
  {
    id: "3",
    title: "Ethereum 2.0 Deployed Q2",
    prediction: "YES", 
    stake: 0.5,
    status: "won",
    payout: 0.8,
    confidence: 90
  },
  {
    id: "4",
    title: "AI AGI by 2025",
    prediction: "NO",
    stake: 3.1,
    status: "lost",
    confidence: 65
  }
];

const achievements = [
  { name: "First Prediction", icon: Target, unlocked: true },
  { name: "Win Streak", icon: TrendingUp, unlocked: true },
  { name: "Big Winner", icon: DollarSign, unlocked: true },
  { name: "Community Leader", icon: Users, unlocked: false },
  { name: "Fortune Teller", icon: Star, unlocked: false },
  { name: "Diamond Hands", icon: Trophy, unlocked: false }
];

export default function Profile() {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();

  // If not connected, show connection prompt
  if (connectionStatus !== "connected" || !address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Please connect your wallet to view your profile and participate in predictions</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Generate user-specific data based on wallet address
  const getUserData = (walletAddress: string) => {
    const hash = walletAddress.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const predictions = 15 + (Math.abs(hash) % 50);
    const accuracy = 55 + (Math.abs(hash) % 35);
    const earnings = (Math.abs(hash) % 20) + 1;
    
    return {
      ...mockProfileData,
      totalPredictions: predictions,
      accuracyRate: accuracy,
      correctPredictions: Math.floor(predictions * (accuracy / 100)),
      totalEarnings: earnings,
      reputation: 300 + (Math.abs(hash) % 700),
      level: 1 + Math.floor(predictions / 10),
      experienceToNextLevel: 500 - (predictions * 10)
    };
  };

  const userProfile = getUserData(address);
  const displayAddress = address;

  const copyAddress = () => {
    navigator.clipboard.writeText(displayAddress);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "text-success bg-success/10 border-success/20";
      case "lost": return "text-destructive bg-destructive/10 border-destructive/20";
      case "active": return "text-warning bg-warning/10 border-warning/20";
      default: return "text-muted-foreground bg-muted/10 border-border/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass border-border/40 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {mockProfileData.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{userProfile.username}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="font-mono text-sm">
                      {displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="p-1 h-auto hover:bg-primary/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="p-1 h-auto hover:bg-primary/10"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {userProfile.rank}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Member since {userProfile.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">Level {userProfile.level}</span>
                </div>
                <div className="w-32">
                  <Progress 
                    value={(userProfile.experienceToNextLevel / (userProfile.experienceToNextLevel + 200)) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userProfile.experienceToNextLevel} XP to next level
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Activity className="w-4 h-4 mr-2" />
                Predictions Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{userProfile.totalPredictions}</p>
              <p className="text-xs text-success">+3 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Target className="w-4 h-4 mr-2" />
                Accuracy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{userProfile.accuracyRate}%</p>
              <p className="text-xs text-success">Above average</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{userProfile.totalEarnings} ETH</p>
              <p className="text-xs text-success">+{(userProfile.totalEarnings * 0.2).toFixed(1)} ETH this month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Trophy className="w-4 h-4 mr-2" />
                Reputation Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{userProfile.reputation}</p>
              <p className="text-xs text-success">Top 15%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Recent Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPredictions.map((prediction, index) => (
                  <div key={prediction.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border/20">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm text-foreground">{prediction.title}</p>
                      <div className="flex items-center space-x-3 text-xs">
                        <Badge 
                          variant="outline" 
                          className={`${prediction.prediction === "YES" ? "text-success" : "text-destructive"}`}
                        >
                          {prediction.prediction}
                        </Badge>
                        <span className="text-muted-foreground">Stake: {prediction.stake} ETH</span>
                        {prediction.payout && (
                          <span className="text-success">+{prediction.payout} ETH</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getStatusColor(prediction.status)}>
                        {prediction.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{prediction.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={achievement.name}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        achievement.unlocked 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : "bg-muted/10 border-border/20 text-muted-foreground"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Icon className={`w-8 h-8 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-sm font-medium">{achievement.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}