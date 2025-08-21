import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Predictions from "./pages/Predictions";
import DAO from "./pages/DAO";
import Profile from "./pages/Profile";
import NFTs from "./pages/NFTs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThirdwebProvider
    activeChain="ethereum"
    clientId="your-thirdweb-client-id" // Replace with actual client ID
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/dao" element={<DAO />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/nfts" element={<NFTs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThirdwebProvider>
);

export default App;
