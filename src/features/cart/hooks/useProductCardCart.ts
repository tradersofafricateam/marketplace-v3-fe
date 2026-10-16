"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { getPublicProduct } from "@/features/products/api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useAddToCart } from "./useAddToCart";

/** Fetch current stock and minimum order before adding from a catalogue card. */
export function useProductCardCart(productId: string) {
  const locale = useLocale();
  const t = useTranslations("Cart");
  const [choices, setChoices] = useState<{ id: string; label: string; quantity: number }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const { addToCart, isAdding } = useAddToCart();
  const product = useMutation({
    mutationFn: () => getPublicProduct(productId, locale),
    retry: false,
    onSuccess: (details) => {
      const type = String(details.productType).toUpperCase();
      const quantity = Math.max(1, Math.ceil(Number(details.minOrdersAllowed ?? 1)));
      if (type === "VARIABLE") {
        const variants = Array.isArray(details.variants) ? details.variants : [];
        const available = variants.flatMap((value) => {
          if (!value || typeof value !== "object") return [];
          const variant = value as Record<string, unknown>;
          const stock = Number(variant.quantity);
          if (typeof variant.id !== "string" || !Number.isFinite(stock) || !Number.isSafeInteger(quantity) || stock < quantity) return [];
          const attributes = variant.attributes && typeof variant.attributes === "object" ? Object.values(variant.attributes) : [];
          return [{ id: variant.id, label: attributes.join(" / "), quantity }];
        });
        if (!available.length) { toast.error(t("unavailable")); return; }
        if (available.length === 1) {
          addToCart({ productId, variantId: available[0].id, quantity });
          return;
        }
        setChoices(available);
        setSelectedId(available[0].id);
        return;
      }
      const stock = Number(details.quantity);
      if (!Number.isFinite(stock) || type !== "SIMPLE" || !Number.isSafeInteger(quantity) || stock < quantity || details.quantity == null) {
        toast.error(t("unavailable"));
        return;
      }
      addToCart({ productId, quantity });
    },
    onError: (error) => promiseErrorFunction(error, t("addError")),
  });
  const isPending = product.isPending || isAdding;
  return {
    addFromCard: () => { if (!isPending) product.mutate(); },
    isPending,
    choices,
    selectedId,
    setSelectedId,
    closeChoices: () => setChoices([]),
    addSelected: () => {
      const variant = choices.find((choice) => choice.id === selectedId);
      if (!variant || isPending) return;
      addToCart({ productId, variantId: variant.id, quantity: variant.quantity });
      setChoices([]);
    },
  };
}
