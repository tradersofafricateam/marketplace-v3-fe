"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCatalogueProducts } from "@/features/products/hooks/useCatalogueProducts";
import {
  publicProductQuery,
  publicSortMap,
} from "@/features/products/helpers/publicProductQuery";
import {
  applyCatalogueFilters,
  catalogueFilters,
  clearCatalogueFilters,
  removeCatalogueFilter,
  selectedCategoryIds,
} from "@/features/products/helpers/catalogueFilters";
import { emptyCatalogueFilters } from "@/features/products/constants/catalogue";
import type { CatalogueFilters, ProductView } from "@/features/products/types";
import { useCategoryTree } from "@/features/categories/hooks/useCategories";
import { flattenCategories } from "@/features/categories/helpers";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

export const useProductCatalogue = () => {
  const { currency, formatMoney } = useCurrency();
  const params = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ProductCatalogue");
  const signature = params.toString();
  const url = new URLSearchParams(signature);
  const appliedFilters = catalogueFilters(url);
  const apiQuery = publicProductQuery(url);
  const categoryQuery = useCategoryTree();
  const categories = flattenCategories(categoryQuery.data || []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<ProductView>("grid");
  const [draft, setDraft] = useState({ signature, filters: appliedFilters });
  // Reset URL-derived drafts synchronously, including when returning to an older URL.
  if (draft.signature !== signature)
    setDraft({ signature, filters: appliedFilters });
  const draftFilters =
    draft.signature === signature ? draft.filters : appliedFilters;
  const productsQuery = useCatalogueProducts(apiQuery);
  const sort =
    Object.entries(publicSortMap).find(
      ([, value]) => value === apiQuery.sortBy,
    )?.[0] || "relevance";
  const categoryIds = selectedCategoryIds(appliedFilters);
  const contextTitle = apiQuery.search
    ? t("searchTitle", { query: apiQuery.search })
    : categoryIds.length === 1
      ? categories.find((item) => item.id === categoryIds[0])?.name ||
        t("selectedCategory")
      : url.get("collection") === "popular"
        ? t("collections.popular")
        : url.get("collection") === "new"
          ? t("collections.new")
          : t("collections.all");
  const navigate = (next: URLSearchParams) =>
    router.push(`/${locale}/products${next.size ? `?${next}` : ""}`);
  const changeFilters = (next: Partial<CatalogueFilters>) =>
    setDraft({ signature, filters: { ...draftFilters, ...next } });
  const resetDraftFilters = () =>
    setDraft({ signature, filters: { ...emptyCatalogueFilters } });
  const applyFilters = () => {
    navigate(applyCatalogueFilters(url, draftFilters));
    setFiltersOpen(false);
  };
  const clearFilters = () => {
    resetDraftFilters();
    navigate(clearCatalogueFilters(url));
  };
  const changePage = (page: number) => {
    const next = new URLSearchParams(url);
    next.set("page", String(page));
    navigate(next);
  };
  const changeSort = (value: string) => {
    if (!(value in publicSortMap)) return;
    const next = new URLSearchParams(url);
    if ((value === "price-low" || value === "price-high") && currency)
      next.set("currency", currency);
    next.delete("sortBy");
    next.delete("page");
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    // Relevance must override a collection's implicit sort when explicitly chosen.
    if (value === "relevance" && next.has("collection"))
      next.set("sort", "relevance");
    navigate(next);
  };
  const chips: { key: string; categoryId?: string; label: string }[] =
    categoryIds.map((id) => ({
      key: "categories",
      categoryId: id,
      label:
        categories.find((item) => item.id === id)?.name ||
        t("selectedCategory"),
    }));
  for (const field of ["minPrice", "maxPrice"] as const)
    if (apiQuery[field] !== undefined)
      chips.push({
        key: field,
        label: t(field === "minPrice" ? "chipMin" : "chipMax", {
          value: apiQuery.currency
            ? formatMoney(apiQuery[field]!, apiQuery.currency)
            : String(apiQuery[field]),
        }),
      });
  if (apiQuery.currency)
    chips.push({
      key: "currency",
      label: t("chipCurrency", { value: apiQuery.currency }),
    });
  if (apiQuery.minRating !== undefined)
    chips.push({
      key: "minRating",
      label: t("filters.ratingUp", { rating: apiQuery.minRating }),
    });
  if (apiQuery.inventoryStatus)
    chips.push({
      key: "inventoryStatus",
      label: t(
        apiQuery.inventoryStatus === "in_stock" ? "inStock" : "outOfStock",
      ),
    });
  if (apiQuery.hasDiscount !== undefined)
    chips.push({
      key: "hasDiscount",
      label: t(apiQuery.hasDiscount ? "discounted" : "notDiscounted"),
    });
  if (apiQuery.countryOfOrigin)
    chips.push({
      key: "countryOfOrigin",
      label: t("chipCountry", { value: apiQuery.countryOfOrigin }),
    });
  if (apiQuery.sellerId)
    chips.push({ key: "sellerId", label: t("selectedSeller") });
  const closeFilters = () => {
    setDraft({
      signature,
      filters: catalogueFilters(new URLSearchParams(signature)),
    });
    setFiltersOpen(false);
  };
  return {
    locale,
    contextTitle,
    categoryIds,
    selectCategory: (id?: string) =>
      navigate(
        applyCatalogueFilters(url, {
          ...appliedFilters,
          category: id || "",
          categoryIds: [],
        }),
      ),
    view,
    setView,
    sort,
    changeSort,
    changePage,
    visibleProducts: productsQuery.data?.items || [],
    pagination: productsQuery.data?.pagination,
    isLoading: productsQuery.isLoadingCurrentData,
    isError: productsQuery.isError && !productsQuery.data,
    isRefreshing: productsQuery.isFetching && !!productsQuery.data,
    refreshError: productsQuery.isError && !!productsQuery.data,
    retry: productsQuery.refetch,
    draftFilters,
    changeFilters,
    resetDraftFilters,
    applyFilters,
    clearFilters,
    categoryQuery,
    chips,
    activeFilterCount: chips.length,
    removeFilter: (key: string, id?: string) =>
      navigate(removeCatalogueFilter(url, key, id)),
    draftChanged:
      JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters),
    filtersOpen,
    openFilters: () => {
      setDraft({ signature, filters: appliedFilters });
      setFiltersOpen(true);
    },
    closeFilters,
    hasSearch: !!apiQuery.search,
  };
};
