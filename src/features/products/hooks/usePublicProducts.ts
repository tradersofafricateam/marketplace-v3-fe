"use client";
import { useLocale } from "next-intl";
import { useStore } from "@/store/authStore";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";
import { getPublicProduct, getPublicProducts, type PublicProductQuery } from "../api";
import { publicProductCard, publicProductDetail } from "../helpers/publicProduct";
export function usePublicProducts(query: PublicProductQuery = {}, enabled = true) {
  const locale = useLocale();
  const userId = useStore((state) => state.currentUser?.id);
  const initialized = useStore((state) => state.isAuthInitialized);
  return useFreshQuery({ queryKey: ["publicProducts", userId ?? "anonymous", locale, query], enabled: initialized && enabled, gcTime: 0,
    queryFn: async ({ signal }) => { const response = await getPublicProducts({ ...query, lang: locale }, signal); return { items: response.data.map((product) => publicProductCard(product, locale)), pagination: response.pagination }; },
  });
}
export function usePublicProduct(id: string) {
  const locale = useLocale();
  const userId = useStore((state) => state.currentUser?.id);
  const initialized = useStore((state) => state.isAuthInitialized);
  return useFreshQuery({ queryKey: ["publicProduct", userId ?? "anonymous", locale, id], enabled: initialized && !!id, gcTime: 0,
    queryFn: async ({ signal }) => publicProductDetail(await getPublicProduct(id, locale, signal)),
  });
}
