import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddress, useConnect, useConnectionStatus, metamaskWallet } from "@thirdweb-dev/react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, DollarSign, Target, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const createMarketSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  endDate: z.string().min(1, "Please select an end date"),
});

type CreateMarketForm = z.infer<typeof createMarketSchema>;

interface MarketCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "politics", label: "Politics" },
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "economy", label: "Economy" },
  { value: "science", label: "Science" },
  { value: "other", label: "Other" },
];

export function MarketCreationDialog({ open, onOpenChange }: MarketCreationDialogProps) {
  const address = useAddress();
  const connect = useConnect();
  const connectionStatus = useConnectionStatus();
  const queryClient = useQueryClient();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleConnect = async () => {
    try {
      const metamask = metamaskWallet();
      await connect(metamask);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const form = useForm<CreateMarketForm>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      endDate: "",
    },
  });

  const createMarketMutation = useMutation({
    mutationFn: async (data: CreateMarketForm & { creatorId: number; contractAddress?: string }) => {
      return await apiRequest("/api/markets", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
      toast({
        title: "Market Created!",
        description: "Your prediction market has been created successfully.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create market. Please try again.",
        variant: "destructive",
      });
      console.error("Market creation error:", error);
    },
  });

  const onSubmit = async (data: CreateMarketForm) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to create a market.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeploying(true);
      
      // For now, create market without contract deployment
      // In a real implementation, you would deploy the smart contract here
      const marketData = {
        ...data,
        creatorId: 1, // This should be the actual user ID from your auth system
      };

      await createMarketMutation.mutateAsync(marketData);
    } catch (error) {
      console.error("Contract deployment error:", error);
      toast({
        title: "Deployment Error",
        description: "Failed to deploy market contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Create Prediction Market</span>
          </DialogTitle>
          <DialogDescription>
            Create a new on-chain prediction market where users can bet on the outcome.
          </DialogDescription>
        </DialogHeader>

        {!address ? (
          <div className="text-center py-8 space-y-4">
            <div className="p-4 border-2 border-dashed border-border rounded-lg">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                You need to connect your wallet to create prediction markets on-chain
              </p>
              <Button onClick={handleConnect} className="bg-primary hover:bg-primary-dark text-primary-foreground">
                {connectionStatus === "connecting" ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Will Bitcoin reach $100,000 by end of 2024?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, concise question that can be answered with YES or NO
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about the prediction, including resolution criteria and any relevant context..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain the context, resolution criteria, and any important details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={today}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      When betting closes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Market Economics</span>
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Platform fee: 2.5% of total volume</p>
                <p>• Winners share the remaining pool proportionally</p>
                <p>• Market creator receives platform fees</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMarketMutation.isPending || isDeploying}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMarketMutation.isPending || isDeploying}
                className="bg-primary hover:bg-primary-dark"
              >
                {createMarketMutation.isPending || isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isDeploying ? "Deploying..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Create Market
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}