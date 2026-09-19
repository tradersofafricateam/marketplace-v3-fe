"use client";

import { currentQueryState } from "@/lib/query/currentQueryState";
import { useQuery } from "@tanstack/react-query";
import { getSellerVerificationStatus } from "../api";
import { useStore } from "@/store/authStore";

export const sellerVerificationKey = (userId?: string) =>
  ["sellerVerificationStatus", userId] as const;

export const useSellerVerificationStatus = () => {
  const userId = useStore((state) => state.currentUser?.id);
  const query = useQuery({
    queryKey: sellerVerificationKey(userId),
    queryFn: getSellerVerificationStatus,
    enabled: !!userId,
    staleTime: 30_000,
  });
  const current = currentQueryState(query);
  const status = userId ? current.data?.verificationStatus : undefined;
  return {
    ...query,
    ...current,
    status,
    canSubmit: status === "not_submitted" || status === "rejected",
  };
};
