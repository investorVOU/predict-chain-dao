import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Calendar
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "rejected" | "pending";
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorumRequired: number;
  category: "governance" | "treasury" | "technical" | "community";
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Implement Market Creation Fee Reduction",
    description: "Reduce the market creation fee from 0.1 ETH to 0.05 ETH to encourage more market creation and participation.",
    proposer: "0x742d35Cc6b67e2e825b8dF4E07c4e07",
    status: "active",
    endDate: "2024-01-15",
    votesFor: 1247,
    votesAgainst: 234,
    totalVotes: 1481,
    quorumRequired: 1000,
    category: "governance"
  },
  {
    id: "2", 
    title: "Treasury Allocation for Marketing Campaign",
    description: "Allocate 100 ETH from the treasury for a 6-month marketing campaign to increase platform awareness and user adoption.",
    proposer: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    status: "active",
    endDate: "2024-01-20",
    votesFor: 892,
    votesAgainst: 445,
    totalVotes: 1337,
    quorumRequired: 1000,
    category: "treasury"
  },
  {
    id: "3",
    title: "Upgrade Smart Contract Architecture",
    description: "Implement upgradeable proxy pattern for core smart contracts to enable future improvements without disrupting existing markets.",
    proposer: "0x9e3f2d1a4b5c6e7f8a9b0c1d2e3f4a5b",
    status: "passed",
    endDate: "2024-01-05",
    votesFor: 1678,
    votesAgainst: 123,
    totalVotes: 1801,
    quorumRequired: 1000,
    category: "technical"
  },
  {
    id: "4",
    title: "Community Rewards Program",
    description: "Launch a rewards program that distributes governance tokens to active participants based on their prediction accuracy and volume.",
    proposer: "0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    status: "rejected",
    endDate: "2023-12-28",
    votesFor: 432,
    votesAgainst: 789,
    totalVotes: 1221,
    quorumRequired: 1000,
    category: "community"
  }
];

const categoryColors = {
  governance: "bg-primary/10 text-primary border-primary/20",
  treasury: "bg-warning/10 text-warning border-warning/20", 
  technical: "bg-secondary/10 text-secondary border-secondary/20",
  community: "bg-success/10 text-success border-success/20"
};

export default function DAO() {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      case "active": return <Clock className="w-4 h-4 text-warning" />;
      default: return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getVotePercentage = (proposal: Proposal) => {
    if (proposal.totalVotes === 0) return { forPercentage: 0, againstPercentage: 0 };
    const forPercentage = (proposal.votesFor / proposal.totalVotes) * 100;
    const againstPercentage = (proposal.votesAgainst / proposal.totalVotes) * 100;
    return { forPercentage, againstPercentage };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">DAO Governance</h1>
            <p className="text-muted-foreground">Shape the future of PredictChain through decentralized governance</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark shadow-glow-primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Proposal
          </Button>
        </div>

        {/* DAO Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Vote className="w-4 h-4 mr-2" />
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {mockProposals.filter(p => p.status === "active").length}
              </p>
            </CardContent>
          </Card>

          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                Total Voters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">2,847</p>
            </CardContent>
          </Card>

          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <CheckCircle className="w-4 h-4 mr-2" />
                Passed Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {mockProposals.filter(p => p.status === "passed").length}
              </p>
            </CardContent>
          </Card>

          <Card className="glass surface-interactive border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Your Voting Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">156</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Proposals List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="space-y-6"
      >
        {mockProposals.map((proposal, index) => {
          const { forPercentage, againstPercentage } = getVotePercentage(proposal);
          const daysLeft = Math.ceil((new Date(proposal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="glass surface-interactive border-border/40 overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge className={categoryColors[proposal.category]}>
                          {proposal.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(proposal.status)}
                          <span className="text-sm font-medium capitalize">{proposal.status}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-foreground">{proposal.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Proposed by {proposal.proposer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {proposal.status === "active" 
                          ? `${daysLeft} days left` 
                          : `Ended ${Math.abs(daysLeft)} days ago`
                        }
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{proposal.description}</p>

                  {/* Voting Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-success font-medium">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        For: {proposal.votesFor} ({forPercentage.toFixed(1)}%)
                      </span>
                      <span className="flex items-center text-destructive font-medium">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Against: {proposal.votesAgainst} ({againstPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="relative">
                      <Progress value={forPercentage} className="h-3 bg-destructive/20" />
                      <div 
                        className="absolute top-0 left-0 h-3 bg-success rounded-full transition-all duration-300"
                        style={{ width: `${forPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Total votes: {proposal.totalVotes}</span>
                      <span>Quorum: {proposal.quorumRequired}</span>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  {proposal.status === "active" && (
                    <div className="flex space-x-3 pt-4 border-t border-border/40">
                      <Button 
                        className="flex-1 bg-success hover:bg-success/90 text-white"
                        onClick={() => console.log(`Voting FOR proposal ${proposal.id}`)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Vote For
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => console.log(`Voting AGAINST proposal ${proposal.id}`)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Vote Against
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}