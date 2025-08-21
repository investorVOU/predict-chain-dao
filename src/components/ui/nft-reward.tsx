import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Target,
  Crown,
  Award,
  Zap,
  ExternalLink
} from "lucide-react";

interface NFTRewardProps {
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

export function NFTRewardCard(nft: NFTRewardProps) {
  const TypeIcon = typeIcons[nft.type];
  
  return (
    <motion.div
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
            className={`absolute top-2 left-2 text-xs ${rarityColors[nft.rarity]}`}
          >
            {nft.rarity}
          </Badge>

          {/* Type Icon */}
          <div className="absolute top-2 right-2 p-1 rounded-md bg-background/80">
            <TypeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </div>

          {/* Earned Indicator */}
          {nft.earned && (
            <div className="absolute bottom-2 right-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-success rounded-full flex items-center justify-center">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
}