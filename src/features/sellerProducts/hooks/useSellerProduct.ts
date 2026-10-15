"use client";

import { useLocale } from "next-intl";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";

import { useStore } from "@/store/authStore";
import { getSellerProduct } from "../api";

export const sellerProductKey = (id: string, userId?: string) => ["sellerProduct", id, userId] as const;

export const useSellerProduct = (id: string, options: { enabled?: boolean } = {}) => {
  const locale = useLocale();
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({
    queryKey: [...sellerProductKey(id, userId), locale],
    queryFn: ({ signal }) => getSellerProduct(id, locale, signal),
    enabled: Boolean(id && userId) && (options.enabled ?? true),
  });
};
