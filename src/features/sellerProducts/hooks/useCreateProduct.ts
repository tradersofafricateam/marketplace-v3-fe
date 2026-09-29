"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { createProduct, uploadProductImages, uploadVariantImage } from "../api";
import { mapFormStateToPayload } from "../helpers/mapFormStateToPayload";
import type { ProductFormState } from "../types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useCreateProduct = ({
  onSuccess,
}: {
  onSuccess: (productId: string) => void;
}) => {
  const t = useTranslations("SellerProducts.wizard");
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormState) => {
      const product = await createProduct(mapFormStateToPayload(values));

      const imageResults = await Promise.allSettled([
        values.galleryImages.length > 0
          ? uploadProductImages({
              productId: product.id,
              files: values.galleryImages,
              primaryIndex: values.primaryImageIndex,
            })
          : Promise.resolve(null),
        ...Object.entries(values.variantImagesByColor).map(([color, file]) =>
          uploadVariantImage({ productId: product.id, color, file }),
        ),
      ]);

      return {
        product,
        imagesFailed: imageResults.some(
          (result) => result.status === "rejected",
        ),
      };
    },
    onSuccess: ({ product, imagesFailed }) => {
      toast.success(imagesFailed ? t("createdWithImageWarning") : t("created"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
      onSuccess(product.id);
    },
    onError: (error) => promiseErrorFunction(error, t("createError")),
  });

  return { createProduct: mutate, isCreating: isPending };
};
