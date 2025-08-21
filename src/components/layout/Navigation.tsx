import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Vote, 
  User, 
  Trophy, 
  TrendingUp,
  Wallet,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@thirdweb-dev/react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/predictions", label: "Markets", icon: TrendingUp },
  { path: "/dao", label: "Governance", icon: Vote },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/nfts", label: "Rewards", icon: Trophy },
];

export function Navigation() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-primary">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient-primary">PredictChain</span>
            <span className="text-xs text-muted-foreground">DAO</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "relative px-4 py-2 transition-all duration-300",
                    isActive && "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-md"
                      layoutId="activeNav"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ConnectWallet 
              theme="dark"
              btnTitle="Connect Wallet"
              modalTitle="Connect Your Wallet"
              className="!bg-primary hover:!bg-primary-dark !text-primary-foreground !border-primary/20 !rounded-lg !px-6 !py-2 !font-medium !transition-all !duration-300 hover:!shadow-glow-primary"
            />
          </div>
        </div>
      </div>
    </header>
  );
}