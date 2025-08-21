import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Market, Bet } from "@shared/schema";

// Market queries
export function useMarkets(category?: string, status?: string) {
  return useQuery({
    queryKey: ["/api/markets", { category, status }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (status) params.append("status", status);
      
      const url = `/api/markets${params.toString() ? `?${params.toString()}` : ""}`;
      return apiRequest(url);
    },
  });
}

export function useMarket(id: number) {
  return useQuery({
    queryKey: ["/api/markets", id],
    queryFn: () => apiRequest(`/api/markets/${id}`),
    enabled: !!id,
  });
}

export function useUserMarkets(userId: number) {
  return useQuery({
    queryKey: ["/api/users", userId, "markets"],
    queryFn: () => apiRequest(`/api/users/${userId}/markets`),
    enabled: !!userId,
  });
}

// Bet queries
export function useMarketBets(marketId: number) {
  return useQuery({
    queryKey: ["/api/markets", marketId, "bets"],
    queryFn: () => apiRequest(`/api/markets/${marketId}/bets`),
    enabled: !!marketId,
  });
}

export function useUserBets(userId: number, marketId?: number) {
  return useQuery({
    queryKey: ["/api/users", userId, "bets", { marketId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (marketId) params.append("marketId", marketId.toString());
      
      const url = `/api/users/${userId}/bets${params.toString() ? `?${params.toString()}` : ""}`;
      return apiRequest(url);
    },
    enabled: !!userId,
  });
}

// Mutations
export function useCreateMarket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest("/api/markets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
    },
  });
}

export function usePlaceBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ marketId, ...data }: { marketId: number } & any) => 
      apiRequest(`/api/markets/${marketId}/bets`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/markets", variables.marketId] });
      queryClient.invalidateQueries({ queryKey: ["/api/markets", variables.marketId, "bets"] });
    },
  });
}

export function useResolveMarket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ marketId, result }: { marketId: number; result: string }) => 
      apiRequest(`/api/markets/${marketId}/resolve`, {
        method: "POST",
        body: JSON.stringify({ result }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/markets", variables.marketId] });
    },
  });
}