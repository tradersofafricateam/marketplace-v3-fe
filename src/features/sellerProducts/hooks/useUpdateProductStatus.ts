"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { updateProductStatus } from "../api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useUpdateProductStatus = () => {
  const t = useTranslations("SellerProducts.status");
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      toast.success(t("updated"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error) => promiseErrorFunction(error, t("updateError")),
  });

  return { updateStatus: mutate, isUpdatingStatus: isPending };
};
