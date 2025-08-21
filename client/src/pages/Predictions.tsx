import { useState } from "react";
import { motion } from "framer-motion";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  TrendingUp,
  Plus,
  Calendar,
  DollarSign
} from "lucide-react";

const categories = ["All", "Cryptocurrency", "Politics", "Technology", "Sports", "Entertainment"];

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
  },
  {
    id: "4",
    title: "Tesla Stock Above $300",
    description: "Will Tesla's stock price exceed $300 per share by Q1 2025?",
    category: "Technology",
    endDate: "2025-03-31",
    totalStaked: 12.8,
    participants: 89,
    yesPercentage: 73,
    noPercentage: 27,
    status: "active" as const
  },
  {
    id: "5",
    title: "World Cup 2026 Host",
    description: "Will the USA host more World Cup 2026 matches than Canada and Mexico combined?",
    category: "Sports", 
    endDate: "2026-07-19",
    totalStaked: 34.5,
    participants: 178,
    yesPercentage: 61,
    noPercentage: 39,
    status: "active" as const
  },
  {
    id: "6",
    title: "AI Breakthrough 2024",
    description: "Will there be a major AGI breakthrough announced by a tech giant in 2024?",
    category: "Technology",
    endDate: "2024-12-31",
    totalStaked: 67.3,
    participants: 423,
    yesPercentage: 44,
    noPercentage: 56,
    status: "active" as const
  }
];

export default function Predictions() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPredictions = mockPredictions.filter(prediction => {
    const matchesCategory = selectedCategory === "All" || prediction.category === selectedCategory;
    const matchesSearch = prediction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prediction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary">Prediction Markets</h1>
            <p className="text-muted-foreground">Discover and participate in decentralized prediction markets</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark shadow-glow-primary w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Market
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="glass border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCategory === category 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass surface-interactive border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              Active Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{filteredPredictions.filter(p => p.status === "active").length}</p>
          </CardContent>
        </Card>

        <Card className="glass surface-interactive border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {filteredPredictions.reduce((acc, p) => acc + p.totalStaked, 0).toFixed(1)} ETH
            </p>
          </CardContent>
        </Card>

        <Card className="glass surface-interactive border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Ending Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {filteredPredictions.filter(p => {
                const daysLeft = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return daysLeft <= 7 && daysLeft > 0;
              }).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        {filteredPredictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PredictionCard {...prediction} />
          </motion.div>
        ))}
      </motion.div>

      {filteredPredictions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No markets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}