import { axiosInstance } from "@/lib/axiosInstance";
export type PublicProductQuery = {
  page?: number; limit?: number; categoryId?: string; categoryIds?: string; sellerId?: string;
  countryOfOrigin?: string; minPrice?: number; maxPrice?: number; currency?: string; minRating?: number;
  inventoryStatus?: "in_stock" | "out_of_stock"; hasDiscount?: boolean;
  sortBy?: "relevance" | "ranking" | "newest" | "price_low_to_high" | "price_high_to_low" | "highest_rating" | "most_reviewed";
  search?: string; lang?: string;
};
// A deliberately explicit query allowlist avoids forwarding UI-only URL parameters.
const allowed = new Set(["page", "limit", "categoryId", "categoryIds", "sellerId", "countryOfOrigin", "minPrice", "maxPrice", "currency", "minRating", "inventoryStatus", "hasDiscount", "sortBy", "search", "lang"]);
export function publicProductParams(query: PublicProductQuery) {
  return Object.fromEntries(Object.entries(query).flatMap(([key, value]) => {
    if (!allowed.has(key) || value === undefined || value === null) return [];
    const normalized = typeof value === "string" ? value.trim() : value;
    return normalized === "" || (typeof normalized === "number" && !Number.isFinite(normalized)) ? [] : [[key, normalized]];
  }));
}
export type PublicProductRecord = Record<string, unknown>;
export async function getPublicProducts(query: PublicProductQuery, signal?: AbortSignal): Promise<{ data: PublicProductRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const { data } = await axiosInstance.get("/products/", { params: publicProductParams(query), signal, headers: { "Cache-Control": "no-cache, no-store" } });
  if (data?.success === false || !Array.isArray(data?.data) || !data.pagination) throw new Error("Could not load products.");
  return data;
}
export async function getPublicProduct(id: string, lang: string, signal?: AbortSignal): Promise<PublicProductRecord> {
  const { data } = await axiosInstance.get(`/products/${encodeURIComponent(id)}`, { params: { lang }, signal, headers: { "Cache-Control": "no-cache, no-store" } });
  if (data?.success === false || !data?.data?.id) throw new Error("Could not load this product.");
  return data.data;
}
