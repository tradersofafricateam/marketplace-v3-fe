import type { Category } from "../types";

export function localizedCategoryText(value: unknown, locale: string): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const translations = value as Record<string, unknown>;
  const text = translations[locale] || translations.en;
  return typeof text === "string" ? text : "";
}

export function normalizeCategories(value: unknown, locale: string, parentId: string | null = null): Category[] {
  if (!Array.isArray(value)) throw new Error("Invalid category response");
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || typeof item.id !== "string") throw new Error("Invalid category record");
    if ((item.status && item.status !== "active") || item.deletedAt) return [];
    const name = localizedCategoryText(item.name, locale);
    if (!name) throw new Error("Category name is missing");
    return [{
      id: item.id, name, slug: typeof item.slug === "string" ? item.slug : "",
      description: localizedCategoryText(item.description, locale),
      parentId: item.parentId ?? parentId,
      icon: typeof item.icon === "string" ? item.icon : undefined,
      image: typeof item.image === "string" ? item.image : undefined,
      children: normalizeCategories(item.children ?? [], locale, item.id),
    }];
  });
}

export function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
}
