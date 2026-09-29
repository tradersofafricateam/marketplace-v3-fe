"use client";

import { useFreshQuery } from "@/lib/hooks/useFreshQuery";

import { useStore } from "@/store/authStore";
import { getSellerProducts } from "../api";
import type { SellerProductsQuery } from "../types";

export const sellerProductsKey = (
  query: SellerProductsQuery,
  userId?: string,
) => ["sellerProducts", userId, query] as const;

export const useSellerProducts = (query: SellerProductsQuery = {}) => {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({
    queryKey: sellerProductsKey(query, userId),
    queryFn: ({ signal }) => getSellerProducts(query, signal),
    enabled: !!userId,
  });
};
