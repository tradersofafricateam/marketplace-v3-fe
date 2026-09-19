"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { updateProduct, uploadProductImages, uploadVariantImage } from "../api";
import { mapFormStateToPayload } from "../helpers/mapFormStateToPayload";
import type { ProductFormState } from "../types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useUpdateProduct = ({ productId, onSuccess }: { productId: string; onSuccess: () => void }) => {
  const t = useTranslations("SellerProducts.wizard");
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormState) => {
      await updateProduct({ id: productId, payload: mapFormStateToPayload(values) });

      const imageResults = await Promise.allSettled([
        values.galleryImages.length > 0
          ? uploadProductImages({ productId, files: values.galleryImages, primaryIndex: values.primaryImageIndex })
          : Promise.resolve(null),
        ...Object.entries(values.variantImagesByColor).map(([color, file]) =>
          uploadVariantImage({ productId, color, file }),
        ),
      ]);

      return { imagesFailed: imageResults.some((result) => result.status === "rejected") };
    },
    onSuccess: ({ imagesFailed }) => {
      toast.success(imagesFailed ? t("updatedWithImageWarning") : t("updated"));
      void client.invalidateQueries({ queryKey: ["sellerProducts"] });
      void client.invalidateQueries({ queryKey: ["sellerProduct", productId] });
      onSuccess();
    },
    onError: (error) => promiseErrorFunction(error, t("updateError")),
  });

  return { updateProduct: mutate, isUpdating: isPending };
};
