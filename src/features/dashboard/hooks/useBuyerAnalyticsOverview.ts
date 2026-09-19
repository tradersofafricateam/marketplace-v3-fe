"use client";

import { useFreshQuery } from "@/lib/hooks/useFreshQuery";

import { getBuyerAnalyticsOverview } from "@/features/dashboard/api";
import { useStore } from "@/store/authStore";
import type { BuyerAnalyticsDateRange } from "@/features/dashboard/types";

export const useBuyerAnalyticsOverview = (range: BuyerAnalyticsDateRange) => {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({
    queryKey: ["buyerAnalyticsOverview", userId, range.dateFrom, range.dateTo],
    queryFn: () => getBuyerAnalyticsOverview(range),
    staleTime: 60 * 1000,
    enabled: !!userId,
  });

};
