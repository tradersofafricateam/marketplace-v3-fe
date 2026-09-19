import { axiosInstance } from "@/lib/axiosInstance";
import { normalizeCategories } from "../helpers";
import type { Category } from "../types";

type CategoryResponse = { data: unknown; success?: boolean; pagination?: { totalPages: number } };

export async function getCategories(locale: string, signal?: AbortSignal): Promise<Category[]> {
  const categories = new Map<string, Category>();
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    const { data } = await axiosInstance.get<CategoryResponse>("/categories", {
      params: { page, limit: 100 }, headers: { "Accept-Language": locale }, signal,
    });
    if (data.success === false) throw new Error("Could not load categories");
    for (const category of normalizeCategories(data.data, locale)) categories.set(category.id, category);
    const pages = data.pagination?.totalPages ?? 1;
    if (!Number.isInteger(pages) || pages < 0) throw new Error("Invalid category pagination");
    totalPages = pages;
  }
  return [...categories.values()];
}

export async function getCategoryTree(locale: string, signal?: AbortSignal): Promise<Category[]> {
  const { data } = await axiosInstance.get<CategoryResponse>("/categories/tree", {
    headers: { "Accept-Language": locale }, signal,
  });
  if (data.success === false) throw new Error("Could not load categories");
  return normalizeCategories(data.data, locale);
}
