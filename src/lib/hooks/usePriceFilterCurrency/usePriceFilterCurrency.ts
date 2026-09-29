"use client";

import type { CatalogueFilters } from "@/features/products/types";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { PRODUCT_PRICE_LIMIT } from "@/lib/hooks/useProductCatalogue/useProductCatalogue";

export const usePriceFilterCurrency = (
  filters: CatalogueFilters,
  onChange: (next: Partial<CatalogueFilters>) => void,
) => {
  const { currency, isLoading, isError } = useCurrency();
  const priceCurrency = filters.priceCurrency || currency;
  const displayLimit = PRODUCT_PRICE_LIMIT;
  const displayMin = Number(filters.minPrice);
  const displayMax = Number(filters.maxPrice);
  const changeDisplayRange = ({ min, max }: { min: number; max: number }) => {
    if (!priceCurrency || isLoading || isError) return;
    onChange({ minPrice: String(min), maxPrice: String(max), priceCurrency });
  };

  return {
    displayLimit,
    displayMin,
    displayMax,
    symbol: priceCurrency,
    changeDisplayRange,
  };
};
