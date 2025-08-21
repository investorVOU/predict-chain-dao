import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDAO } from "@/hooks/useWeb3Contracts";
import { useAddress } from "@thirdweb-dev/react";
import { toast } from "@/hooks/use-toast";
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  Shield,
  Coins,
  Settings
} from "lucide-react";

// Mock data for demonstration
const mockProposals = [
  {
    id: 1,
    title: "Implement New Prediction Category: Climate",
    description: "Add climate and environmental predictions to the platform with specialized validation mechanisms.",
    proposer: "0x742d...4e07",
    type: "PLATFORM_UPGRADE",
    votesFor: 12500,
    votesAgainst: 3200,
    totalVotes: 15700,
    endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
    status: "active",
    quorumMet: true
  },
  {
    id: 2,
    title: "Reduce Platform Fee to 2%",
    description: "Lower the platform fee from 2.5% to 2% to increase user participation and competitiveness.",
    proposer: "0x1a2b...9f8c",
    type: "PARAMETER_CHANGE", 
    votesFor: 8900,
    votesAgainst: 11200,
    totalVotes: 20100,
    endTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    status: "active",
    quorumMet: true
  },
  {
    id: 3,
    title: "Allocate Treasury Funds for Marketing",
    description: "Allocate 100 ETH from treasury for Q1 marketing and user acquisition campaigns.",
    proposer: "0x9e3f...2d1a",
    type: "TREASURY_ALLOCATION",
    votesFor: 15600,
    votesAgainst: 4400,
    totalVotes: 20000,
    endTime: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    status: "passed",
    quorumMet: true
  }
];

const proposalTypeColors = {
  PLATFORM_UPGRADE: "bg-blue-500",
  PARAMETER_CHANGE: "bg-yellow-500", 
  TREASURY_ALLOCATION: "bg-green-500",
  MARKET_APPROVAL: "bg-purple-500"
};

const proposalTypeIcons = {
  PLATFORM_UPGRADE: Settings,
  PARAMETER_CHANGE: TrendingUp,
  TREASURY_ALLOCATION: Coins,
  MARKET_APPROVAL: Shield
};

export default function Governance() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const address = useAddress();
  const { createProposal, vote, executeProposal } = useDAO();

  const handleVote = async (proposalId: number, choice: "FOR" | "AGAINST") => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to vote on proposals.",
        variant: "destructive",
      });
      return;
    }

    try {
      await vote([proposalId, choice === "FOR" ? 0 : 1]); // 0 for FOR, 1 for AGAINST
      toast({
        title: "Vote Cast",
        description: `Successfully voted ${choice} on proposal #${proposalId}`,
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">DAO Governance</h1>
          <p className="text-muted-foreground mt-2">
            Participate in platform governance and shape the future of PredictChain
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-dark"
          onClick={() => setShowCreateProposal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { title: "Total Proposals", value: "127", icon: Vote, change: "+8%" },
          { title: "Active Votes", value: "12", icon: Users, change: "+2" },
          { title: "Your Voting Power", value: "2,450", icon: TrendingUp, change: "+150" },
          { title: "Participation Rate", value: "78.2%", icon: CheckCircle, change: "+5.4%" }
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Proposals */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-foreground">Active Proposals</h2>
        
        <div className="space-y-4">
          {mockProposals.map((proposal) => {
            const IconComponent = proposalTypeIcons[proposal.type as keyof typeof proposalTypeIcons];
            const voteProgress = (proposal.votesFor / proposal.totalVotes) * 100;
            const timeRemaining = getTimeRemaining(proposal.endTime);
            
            return (
              <motion.div key={proposal.id} variants={itemVariants}>
                <Card className="glass border-border/40 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${proposalTypeColors[proposal.type as keyof typeof proposalTypeColors]}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Proposed by {proposal.proposer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                          {proposal.status}
                        </Badge>
                        {proposal.quorumMet && (
                          <Badge variant="outline" className="text-success border-success">
                            Quorum Met
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{proposal.description}</p>
                    
                    {/* Vote Progress */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-success">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="text-destructive">Against: {proposal.votesAgainst.toLocaleString()}</span>
                      </div>
                      <Progress value={voteProgress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {timeRemaining}
                      </div>
                      
                      {proposal.status === 'active' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-success border-success hover:bg-success/10"
                            onClick={() => handleVote(proposal.id, "FOR")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Vote For
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleVote(proposal.id, "AGAINST")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Vote Against
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}