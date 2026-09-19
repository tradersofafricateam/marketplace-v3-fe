"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { deleteProduct } from "../api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useDeleteProduct = () => {
  const t = useTranslations("SellerProducts.list");
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success(t("deleted"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error) => promiseErrorFunction(error, t("deleteError")),
  });

  return { deleteProduct: mutate, isDeleting: isPending };
};
