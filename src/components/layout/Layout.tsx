import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl"
      >
        {children}
      </motion.main>
    </div>
  );
}