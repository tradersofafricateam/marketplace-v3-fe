"use client";

import { useFreshQuery } from "@/lib/hooks/useFreshQuery";

import { useStore } from "@/store/authStore";
import { getSellerProduct } from "../api";

export const sellerProductKey = (id: string, userId?: string) => ["sellerProduct", id, userId] as const;

export const useSellerProduct = (id: string) => {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({
    queryKey: sellerProductKey(id, userId),
    queryFn: () => getSellerProduct(id),
    enabled: Boolean(id && userId),
  });

};
