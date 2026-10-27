"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { getPublicProduct } from "@/features/products/api";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useAddToCart } from "./useAddToCart";

/** Validate current stock/MOQ; every variable product is configured on its detail page. */
export function useProductCardCart(productId: string) {
  const locale = useLocale();
  const t = useTranslations("Cart");
  const router = useRouter();
  const { routes } = useGetAllRoutes();
  const { addToCart, isAdding } = useAddToCart();
  const product = useMutation({
    mutationFn: () => getPublicProduct(productId, locale),
    retry: false,
    onSuccess: (details) => {
      const type = String(details.productType).toUpperCase();
      // Also protects cards with missing or outdated list metadata. Never auto-select,
      // including products with just one variant; the detail page owns that flow.
      if (type === "VARIABLE") {
        router.push(routes.productInfo(productId));
        return;
      }
      const quantity = Math.max(
        1,
        Math.ceil(Number(details.minOrdersAllowed ?? 1)),
      );
      const stock = Number(details.quantity);
      if (
        !Number.isFinite(stock) ||
        type !== "SIMPLE" ||
        !Number.isSafeInteger(quantity) ||
        stock < quantity ||
        details.quantity == null
      ) {
        toast.error(t("unavailable"));
        return;
      }
      addToCart({ productId, quantity });
    },
    onError: (error) => promiseErrorFunction(error, t("addError")),
  });
  const isPending = product.isPending || isAdding;
  return {
    addFromCard: () => {
      if (!isPending) product.mutate();
    },
    isPending,
  };
}
