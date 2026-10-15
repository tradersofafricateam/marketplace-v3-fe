import type { PublicProductQuery } from "../api";
export const publicSortMap: Record<string, NonNullable<PublicProductQuery["sortBy"]>> = {
  relevance: "relevance", ranking: "ranking", newest: "newest", "price-low": "price_low_to_high", "price-high": "price_high_to_low", rating: "highest_rating", reviews: "most_reviewed",
};
export function publicProductQuery(params: URLSearchParams): PublicProductQuery {
  const query: PublicProductQuery = {};
  for (const field of ["categoryId", "categoryIds", "sellerId", "countryOfOrigin", "currency", "search"] as const) {
    const value = params.get(field)?.trim(); if (value) query[field] = value;
  }
  query.categoryId ||= params.get("category") || undefined;
  query.search ||= params.get("q")?.trim() || undefined;
  for (const field of ["page", "limit", "minPrice", "maxPrice", "minRating"] as const) {
    const raw = params.get(field) ?? (field === "minRating" ? params.get("rating") : null);
    if (raw === null || !raw.trim()) continue;
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0 && (!["page", "limit"].includes(field) || (Number.isInteger(value) && value > 0))) query[field] = value;
  }
  const inventory = params.get("inventoryStatus") || (params.get("inStock") === "1" ? "in_stock" : undefined);
  if (inventory === "in_stock" || inventory === "out_of_stock") query.inventoryStatus = inventory;
  if (params.get("hasDiscount") === "true" || params.get("hasDiscount") === "false") query.hasDiscount = params.get("hasDiscount") === "true";
  const sort = params.get("sortBy") || params.get("sort") || (params.get("collection") === "popular" ? "ranking" : params.get("collection") === "new" ? "newest" : "relevance");
  query.sortBy = publicSortMap[sort] || (Object.values(publicSortMap).includes(sort as NonNullable<PublicProductQuery["sortBy"]>) ? sort as PublicProductQuery["sortBy"] : "relevance");
  return query;
}
