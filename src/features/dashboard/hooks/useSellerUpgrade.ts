"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { submitSellerUpgrade } from "../api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { sellerVerificationKey } from "./useSellerVerificationStatus";
import type { SellerVerificationStatus } from "../types";
import { useStore } from "@/store/authStore";

export const useSellerUpgrade = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const t = useTranslations("Dashboard.becomeSellerModal");
  const currentUser = useStore((state) => state.currentUser);
  const client = useQueryClient();

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: submitSellerUpgrade,
    onSuccess: async () => {
      toast.success(t("success"));
      if (currentUser) {
        const queryKey = sellerVerificationKey(currentUser.id);
        await client.cancelQueries({ queryKey });
        client.setQueryData<SellerVerificationStatus>(queryKey, {
          verificationStatus: "pending",
          submittedAt: new Date().toISOString(),
          rejectionReason: null,
        });
        void client.invalidateQueries({ queryKey });
      }
      onSuccess?.();
    },
    onError: (error) => promiseErrorFunction(error, t("submitError")),
  });

  return { submit, isSubmitting };
};
