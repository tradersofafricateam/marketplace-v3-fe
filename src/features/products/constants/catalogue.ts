import type { CatalogueFilters } from "../types";

export const PRODUCT_PRICE_LIMIT = 1000000;
export const emptyCatalogueFilters: CatalogueFilters = {
  category: "",
  categoryIds: [],
  minPrice: "",
  maxPrice: "",
  rating: "",
  verified: false,
  inStock: false,
  minOrder: "",
  countryOfOrigin: "",
  hasDiscount: undefined,
  priceCurrency: "",
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
export const catalogueFilterKeys = [
  "category",
  "categoryId",
  "categoryIds",
  "minPrice",
  "maxPrice",
  "currency",
  "rating",
  "minRating",
  "inventoryStatus",
  "inStock",
  "hasDiscount",
  "countryOfOrigin",
  "sellerId",
  "verified",
  "minOrder",
] as const;
