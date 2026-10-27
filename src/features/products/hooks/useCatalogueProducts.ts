"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useStore } from "@/store/authStore";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { getPublicProducts, type PublicProductQuery } from "../api";
import { publicProductCard } from "../helpers/publicProduct";

/** Catalogue-only policy: validated data survives a refresh of this exact key. */
export function useCatalogueProducts(query: PublicProductQuery) {
  const locale = useLocale();
  const userId = useStore((state) => state.currentUser?.id);
  const initialized = useStore((state) => state.isAuthInitialized);
  const { currency, isLoading: currencyLoading } = useCurrency();
  const result = useQuery({
    // Keep the public-products prefix so existing inventory invalidations still apply.
    queryKey: [
      "publicProducts",
      "catalogue",
      userId ?? "anonymous",
      locale,
      currency,
      query,
    ],
    enabled: initialized && !currencyLoading,
    gcTime: 0,
    staleTime: 0,
    placeholderData: undefined,
    refetchOnMount: "always",
    queryFn: async ({ signal }) => {
      const response = await getPublicProducts(
        { ...query, lang: locale },
        signal,
      );
      return {
        items: response.data.map((product) =>
          publicProductCard(product, locale),
        ),
        pagination: response.pagination,
      };
    },
  });
  const data =
    initialized && !currencyLoading && !result.isPlaceholderData
      ? result.data
      : undefined;
  return {
    ...result,
    data,
    isLoadingCurrentData:
      !initialized || currencyLoading || (!data && !result.isError),
  };
}
