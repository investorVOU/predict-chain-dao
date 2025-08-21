import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Gift, 
  Award,
  Crown,
  Target,
  Zap,
  ExternalLink
} from "lucide-react";

interface NFTReward {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type: "achievement" | "milestone" | "seasonal" | "special";
  earned: boolean;
  earnedDate?: string;
  requirements?: string;
}

const mockNFTs: NFTReward[] = [
  {
    id: "1",
    name: "First Prediction",
    description: "Commemorates your very first prediction on PredictChain DAO",
    image: "🎯",
    rarity: "common",
    type: "achievement", 
    earned: true,
    earnedDate: "March 15, 2024"
  },
  {
    id: "2",
    name: "Accuracy Master", 
    description: "Achieved 80% accuracy rate over 25 predictions",
    image: "🏹",
    rarity: "rare",
    type: "achievement",
    earned: true,
    earnedDate: "April 2, 2024"
  },
  {
    id: "3",
    name: "Big Winner",
    description: "Won over 10 ETH from successful predictions", 
    image: "💎",
    rarity: "epic",
    type: "milestone",
    earned: true,
    earnedDate: "April 20, 2024"
  },
  {
    id: "4",
    name: "DAO Founder",
    description: "Early adopter badge for joining in the first 1000 users",
    image: "👑", 
    rarity: "legendary",
    type: "special",
    earned: false,
    requirements: "Be among the first 1000 users (currently #1,247)"
  },
  {
    id: "5", 
    name: "Governance Guardian",
    description: "Participated in 10+ DAO governance votes",
    image: "🛡️",
    rarity: "rare",
    type: "achievement",
    earned: false,
    requirements: "Vote on 10 proposals (7/10 complete)"
  },
  {
    id: "6",
    name: "Market Maker",
    description: "Created your first prediction market",
    image: "⚡",
    rarity: "uncommon",
    type: "achievement", 
    earned: false,
    requirements: "Create a prediction market"
  },
  {
    id: "7",
    name: "Season 1 Champion",
    description: "Top 100 predictor in Season 1",
    image: "🏆",
    rarity: "legendary",
    type: "seasonal",
    earned: false,
    requirements: "Finish in top 100 this season (currently #156)"
  },
  {
    id: "8",
    name: "Win Streak",
    description: "Achieved 5 consecutive correct predictions",
    image: "🔥",
    rarity: "epic", 
    type: "achievement",
    earned: false,
    requirements: "Win 5 predictions in a row (current streak: 2)"
  }
];

const rarityColors = {
  common: "bg-gray-500/20 text-gray-400 border-gray-500/20",
  uncommon: "bg-green-500/20 text-green-400 border-green-500/20", 
  rare: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  epic: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
};

const typeIcons = {
  achievement: Target,
  milestone: Star,
  seasonal: Crown,
  special: Award
};

export default function NFTs() {
  const [filter, setFilter] = useState<"all" | "earned" | "available">("all");

  const filteredNFTs = mockNFTs.filter(nft => {
    if (filter === "earned") return nft.earned;
    if (filter === "available") return !nft.earned;
    return true;
  });

  const earnedCount = mockNFTs.filter(nft => nft.earned).length;
  const totalCount = mockNFTs.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="text-center space-y-2 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary">NFT Rewards</h1>
          <p className="text-muted-foreground">Collect unique NFTs by participating in PredictChain DAO</p>
          
          {/* Progress */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{earnedCount}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalCount - earnedCount}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{((earnedCount / totalCount) * 100).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className="flex-shrink-0"
          >
            All NFTs
          </Button>
          <Button
            variant={filter === "earned" ? "default" : "outline"}
            onClick={() => setFilter("earned")}
            size="sm"
            className="bg-success/10 text-success border-success/20 hover:bg-success/20 flex-shrink-0"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Earned ({earnedCount})
          </Button>
          <Button
            variant={filter === "available" ? "default" : "outline"}
            onClick={() => setFilter("available")}
            size="sm"
            className="flex-shrink-0"
          >
            <Gift className="w-4 h-4 mr-2" />
            Available ({totalCount - earnedCount})
          </Button>
        </div>
      </motion.div>

      {/* NFT Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {filteredNFTs.map((nft, index) => {
          const TypeIcon = typeIcons[nft.type];
          
          return (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`glass border-border/40 overflow-hidden transition-all duration-300 ${
                nft.earned ? "shadow-glow-primary" : "opacity-75"
              }`}>
                {/* NFT Image */}
                <div className={`aspect-square flex items-center justify-center text-4xl sm:text-6xl relative ${
                  nft.earned 
                    ? "bg-gradient-to-br from-primary/10 to-secondary/10" 
                    : "bg-muted/20 grayscale"
                }`}>
                  {nft.image}
                  
                  {/* Rarity Badge */}
                  <Badge 
                    className={`absolute top-2 left-2 ${rarityColors[nft.rarity]}`}
                  >
                    {nft.rarity}
                  </Badge>

                  {/* Type Icon */}
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-background/80">
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Earned Indicator */}
                  {nft.earned && (
                    <div className="absolute bottom-2 right-2">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">{nft.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {nft.description}
                  </p>

                  {nft.earned ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-success font-medium">✓ Earned</span>
                        <span className="text-muted-foreground">{nft.earnedDate}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(`https://opensea.io/assets/nft-${nft.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on OpenSea
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <strong>Requirements:</strong>
                        <p className="mt-1">{nft.requirements}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        disabled
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Not Unlocked
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredNFTs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No NFTs found</h3>
          <p className="text-muted-foreground">
            {filter === "earned" 
              ? "You haven't earned any NFTs yet. Start participating to unlock rewards!"
              : "All NFTs are already earned! You're a true champion!"
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}