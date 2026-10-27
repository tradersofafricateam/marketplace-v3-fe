"use client";

import type { CatalogueFilters } from "@/features/products/types";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { PRODUCT_PRICE_LIMIT } from "@/features/products/constants/catalogue";

export const usePriceFilterCurrency = (
  filters: CatalogueFilters,
  onChange: (next: Partial<CatalogueFilters>) => void,
) => {
  const { currency, isLoading, isError, retry } = useCurrency();
  const priceCurrency = filters.priceCurrency || currency;
  const displayMin =
    filters.minPrice === "" ? undefined : Number(filters.minPrice);
  const displayMax =
    filters.maxPrice === "" ? undefined : Number(filters.maxPrice);
  return {
    displayMin,
    displayMax,
    displayLimit: Math.max(
      PRODUCT_PRICE_LIMIT,
      displayMin || 0,
      displayMax || 0,
    ),
    symbol: priceCurrency,
    isLoading,
    isError,
    retry,
    disabled: !priceCurrency,
    changeDisplayRange: ({ min, max }: { min?: number; max?: number }) => {
      if (!priceCurrency) return;
      onChange({
        minPrice: min === undefined ? "" : String(min),
        maxPrice: max === undefined ? "" : String(max),
        priceCurrency,
      });
    },
  };
};
