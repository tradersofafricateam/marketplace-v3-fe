"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

import { createProductWithImages } from "../helpers/prepareProductPayload";
import type { ProductFormState } from "../types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useCreateProduct = ({
  onSuccess,
}: {
  onSuccess: (productId: string) => void;
}) => {
  const t = useTranslations("SellerProducts.wizard");
  const client = useQueryClient();
  const locale = useLocale();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormState) => {
      return createProductWithImages(values, locale);
    },
    retry: false,
    onSuccess: (product) => {
      toast.success(t("created"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
      onSuccess(product.id);
    },
    onError: (error) => promiseErrorFunction(error, t("createError")),
  });

  return { createProduct: mutate, isCreating: isPending };
};
