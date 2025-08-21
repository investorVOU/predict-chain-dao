import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Vote, 
  User, 
  Trophy, 
  TrendingUp,
  Activity,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet, useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/predictions", label: "Markets", icon: TrendingUp },
  { path: "/dao", label: "Governance", icon: Vote },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/nfts", label: "Rewards", icon: Trophy },
];

export function Navigation() {
  const location = useLocation();
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ mobile = false, onLinkClick }: { mobile?: boolean; onLinkClick?: () => void }) => (
    <nav className={cn(
      "flex items-center",
      mobile ? "flex-col space-y-4 w-full" : "space-x-1"
    )}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path} onClick={onLinkClick}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size={mobile ? "default" : "sm"}
              className={cn(
                "relative transition-all duration-300",
                mobile && "w-full justify-start",
                isActive && "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary/5 rounded-md"
                  layoutId={mobile ? "activeMobileNav" : "activeNav"}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 shrink-0">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-primary">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gradient-primary">PredictChain</span>
              <span className="text-xs text-muted-foreground hidden sm:block">DAO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavLinks />
          </div>

          {/* Right Side - Wallet + Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Wallet Connection */}
            <div className="hidden sm:block">
              <ConnectWallet 
                theme="dark"
                btnTitle={
                  connectionStatus === "connected" && address 
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "Connect Wallet"
                }
                modalTitle="Connect Your Wallet"
                className="!bg-primary hover:!bg-primary-dark !text-primary-foreground !border-primary/20 !rounded-lg !px-3 !md:px-6 !py-2 !font-medium !transition-all !duration-300 hover:!shadow-glow-primary !text-sm"
              />
            </div>

            {/* Mobile Wallet (Shorter) */}
            <div className="block sm:hidden">
              <ConnectWallet 
                theme="dark"
                btnTitle={
                  connectionStatus === "connected" && address 
                    ? `${address.slice(0, 4)}...${address.slice(-2)}`
                    : "Connect"
                }
                modalTitle="Connect Your Wallet"
                className="!bg-primary hover:!bg-primary-dark !text-primary-foreground !border-primary/20 !rounded-lg !px-3 !py-2 !font-medium !transition-all !duration-300 hover:!shadow-glow-primary !text-xs"
              />
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gradient-primary">PredictChain</span>
                      <p className="text-xs text-muted-foreground">DAO</p>
                    </div>
                  </div>

                  <NavLinks 
                    mobile 
                    onLinkClick={() => setIsMobileMenuOpen(false)} 
                  />

                  {connectionStatus === "connected" && address && (
                    <div className="p-4 bg-card-elevated rounded-lg border border-border/40">
                      <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
                      <p className="font-mono text-sm text-foreground">
                        {address.slice(0, 8)}...{address.slice(-8)}
                      </p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}