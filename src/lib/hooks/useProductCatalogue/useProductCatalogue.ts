"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { usePublicProducts } from "@/features/products/hooks/usePublicProducts";
import { publicProductQuery, publicSortMap } from "@/features/products/helpers/publicProductQuery";
import type { CatalogueFilters, ProductView } from "@/features/products/types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

export const PRODUCT_PRICE_LIMIT = 1000000;

const emptyFilters: CatalogueFilters = {
  category: "",
  minPrice: "0",
  maxPrice: String(PRODUCT_PRICE_LIMIT),
  rating: "",
  verified: false,
  inStock: false,
  minOrder: "",
};

export const productSortOptions = [
  "relevance",
  "ranking",
  "newest",
  "price-low",
  "price-high",
  "rating",
  "reviews",
] as const;

export const useProductCatalogue = () => {
  const { currency } = useCurrency();
  const params = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ProductCatalogue");
  const categoryT = useTranslations("CategoryData");
  const categoryQuery = useCategories();
  const categories = categoryQuery.data ?? [];
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ProductView>("grid");
  const [draftFilters, setDraftFilters] = useState<CatalogueFilters>({
    ...emptyFilters,
    priceCurrency: params.get("currency") ?? "",
    category: params.get("categoryId") ?? params.get("category") ?? "",
    countryOfOrigin: params.get("countryOfOrigin") ?? "",
    hasDiscount: params.get("hasDiscount") === "true",
    minPrice: params.get("minPrice") ?? emptyFilters.minPrice,
    maxPrice: params.get("maxPrice") ?? emptyFilters.maxPrice,
    rating: params.get("minRating") ?? params.get("rating") ?? "",
    minOrder: params.get("minOrder") ?? "",
    verified: params.get("verified") === "1",
    inStock: params.get("inventoryStatus") === "in_stock" || params.get("inStock") === "1",
  });

  const query = params.get("q")?.trim() ?? "";
  const collection = params.get("collection") ?? "";
  const sort = params.get("sort") ?? Object.entries(publicSortMap).find(([, value]) => value === params.get("sortBy"))?.[0] ?? (collection === "popular" ? "ranking" : collection === "new" ? "newest" : "relevance");
  const appliedCategory = params.get("categoryId") ?? params.get("category") ?? "";
  const category = categories.find((item) => item.id === appliedCategory);
  const contextTitle =
    query ||
    (appliedCategory ? category?.name || categoryT(categoryQuery.isLoadingCurrentData ? "loading" : categoryQuery.isError ? "error" : "empty") : undefined) ||
    (collection === "popular"
      ? t("collections.popular")
      : collection === "new"
        ? t("collections.new")
        : t("collections.all"));

  const productsQuery = usePublicProducts(publicProductQuery(new URLSearchParams(params.toString())));
  const visibleProducts = productsQuery.data?.items ?? [];
  const pagination = productsQuery.data?.pagination;
  const changePage = (page: number) => {
    const next = new URLSearchParams(params.toString()); next.set("page", String(page));
    router.push(`/${locale}/products?${next}`);
  };

  const changeFilters = (next: Partial<CatalogueFilters>) => {
    setDraftFilters((current) => ({ ...current, ...next }));
  };

  const applyFilters = (filters = draftFilters) => {
    const next = new URLSearchParams(params.toString());
    const values: Record<string, string> = {
      categoryId: filters.category,
      countryOfOrigin: filters.countryOfOrigin || "",
      hasDiscount: filters.hasDiscount ? "true" : "",
      currency: filters.priceCurrency || currency,
      minPrice: filters.minPrice === emptyFilters.minPrice ? "" : filters.minPrice,
      maxPrice: filters.maxPrice === emptyFilters.maxPrice ? "" : filters.maxPrice,
      minRating: filters.rating,
      inventoryStatus: filters.inStock ? "in_stock" : "",
    };
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    ["category", "rating", "inStock", "verified", "minOrder"].forEach((key) => next.delete(key));
    next.delete("page");
    router.push(`/${locale}/products${next.size ? `?${next.toString()}` : ""}`);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(emptyFilters);
    applyFilters(emptyFilters);
  };

  const changeSort = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "price-low" || value === "price-high") next.set("currency", currency);
    next.delete("sortBy");
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    router.push(`/${locale}/products${next.size ? `?${next.toString()}` : ""}`);
  };

  const activeFilterCount = [
    draftFilters.category,
    draftFilters.minPrice !== emptyFilters.minPrice,
    draftFilters.maxPrice !== emptyFilters.maxPrice,
    draftFilters.rating,
    draftFilters.countryOfOrigin,
    draftFilters.hasDiscount,
    draftFilters.inStock,
  ].filter(Boolean).length;

  return {
    locale,
    contextTitle,
    visibleProducts,
    pagination,
    changePage,
    isLoading: productsQuery.isLoadingCurrentData,
    isError: productsQuery.isError,
    retry: productsQuery.refetch,
    draftFilters,
    activeFilterCount,
    sort,
    view,
    mobileFiltersOpen,
    changeFilters,
    applyFilters,
    clearFilters,
    changeSort,
    setView,
    openMobileFilters: () => setMobileFiltersOpen(true),
    closeMobileFilters: () => setMobileFiltersOpen(false),
  };
};
