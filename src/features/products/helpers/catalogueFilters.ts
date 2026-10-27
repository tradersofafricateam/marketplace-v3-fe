import type { CatalogueFilters } from "../types";
import { publicProductQuery } from "./publicProductQuery";
import {
  catalogueFilterKeys,
  emptyCatalogueFilters,
} from "../constants/catalogue";

export function catalogueFilters(params: URLSearchParams): CatalogueFilters {
  const query = publicProductQuery(params);
  return {
    ...emptyCatalogueFilters,
    category: query.categoryId || "",
    categoryIds:
      query.categoryIds
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) || [],
    minPrice:
      query.minPrice === undefined
        ? emptyCatalogueFilters.minPrice
        : String(query.minPrice),
    maxPrice:
      query.maxPrice === undefined
        ? emptyCatalogueFilters.maxPrice
        : String(query.maxPrice),
    priceCurrency: query.currency || "",
    rating: query.minRating === undefined ? "" : String(query.minRating),
    countryOfOrigin: query.countryOfOrigin || "",
    hasDiscount: query.hasDiscount,
    inventoryStatus: query.inventoryStatus,
    inStock: query.inventoryStatus === "in_stock",
  };
}

export function selectedCategoryIds(filters: CatalogueFilters) {
  return [
    ...new Set(
      [filters.category, ...(filters.categoryIds || [])].filter(Boolean),
    ),
  ];
}

export function applyCatalogueFilters(
  params: URLSearchParams,
  filters: CatalogueFilters,
) {
  const next = new URLSearchParams(params);
  const ids = selectedCategoryIds(filters);
  for (const key of [
    "category",
    "categoryId",
    "categoryIds",
    "rating",
    "inStock",
    "verified",
    "minOrder",
    "page",
  ])
    next.delete(key);
  const values = {
    categoryId: ids.length === 1 ? ids[0] : "",
    categoryIds: ids.length > 1 ? ids.join(",") : "",
    minPrice:
      filters.minPrice === emptyCatalogueFilters.minPrice
        ? ""
        : filters.minPrice,
    maxPrice:
      filters.maxPrice === emptyCatalogueFilters.maxPrice
        ? ""
        : filters.maxPrice,
    minRating: filters.rating,
    countryOfOrigin: filters.countryOfOrigin || "",
    currency: filters.priceCurrency || "",
    hasDiscount:
      filters.hasDiscount === undefined ? "" : String(filters.hasDiscount),
    inventoryStatus:
      filters.inventoryStatus || (filters.inStock ? "in_stock" : ""),
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  return next;
}

export function clearCatalogueFilters(params: URLSearchParams) {
  const next = new URLSearchParams(params);
  for (const key of catalogueFilterKeys) next.delete(key);
  next.delete("page");
  return next;
}

export function removeCatalogueFilter(
  params: URLSearchParams,
  key: string,
  categoryId?: string,
) {
  const next = new URLSearchParams(params);
  if (key === "categories") {
    const ids = selectedCategoryIds(catalogueFilters(params)).filter(
      (id) => id !== categoryId,
    );
    next.delete("category");
    next.delete("categoryId");
    next.delete("categoryIds");
    if (ids.length === 1) next.set("categoryId", ids[0]);
    if (ids.length > 1) next.set("categoryIds", ids.join(","));
  } else {
    next.delete(key);
    if (key === "minRating") next.delete("rating");
    if (key === "inventoryStatus") next.delete("inStock");
  }
  next.delete("page");
  return next;
}
