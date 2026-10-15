"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

import { updateProductWithImages } from "../helpers/prepareProductPayload";
import type { ProductFormState } from "../types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useUpdateProduct = ({ productId, onSuccess }: { productId: string; onSuccess: () => void }) => {
  const t = useTranslations("SellerProducts.wizard");
  const client = useQueryClient();
  const locale = useLocale();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormState) => {
      return updateProductWithImages(productId, values, locale);
    },
    retry: false,
    onSuccess: () => {
      toast.success(t("updated"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
      void client.invalidateQueries({ queryKey: ["sellerProduct", productId] });
      onSuccess();
    },
    onError: (error) => promiseErrorFunction(error, t("updateError")),
  });

  return { updateProduct: mutate, isUpdating: isPending };
};
