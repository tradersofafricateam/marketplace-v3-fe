import { localizedCategoryText } from "@/features/categories/helpers";
import type { AssignedProductCategory } from "../types";

/** Saved assignments can include categories excluded from the active public catalogue. */
export function getAssignedCategoryLabels(
  selectedIds: readonly string[],
  existing: readonly AssignedProductCategory[] = [],
  available: readonly { id: string; name: string }[] = [],
  locale = "en",
) {
  const names = new Map(available.map(({ id, name }) => [id, name]));
  for (const category of existing) {
    const name = localizedCategoryText(category.name, locale);
    if (name.trim()) names.set(category.id, name);
  }
  return selectedIds.map((id) => ({ id, name: names.get(id) || null }));
}
