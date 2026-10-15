import type { ProductVariant, ProductVariantOption } from "../types";

/**
 * Cartesian product of every option's values, in the order the seller
 * defined the options - matches the backend's own generation guide so
 * a submitted combination is never ambiguous.
 */
export const generateVariantCombinations = (
  options: ProductVariantOption[],
): Record<string, string>[] => {
  return options.reduce<Record<string, string>[]>(
    (combinations, option) =>
      combinations.flatMap((combination) =>
        option.values.map((value) => ({ ...combination, [option.name]: value })),
      ),
    [{}],
  );
};

/**
 * Merges freshly generated combinations with any prices/quantities already
 * entered for them. Matching is case-insensitive, and a match always adopts
 * the newly generated `attributes` (not the stored ones) - this way
 * normalizing a value's casing on blur doesn't wipe out its entered price
 * just because "red" no longer string-matches "Red".
 */
export const mergeVariantCombinations = (
  combinations: Record<string, string>[],
  existingVariants: ProductVariant[],
): ProductVariant[] =>
  combinations.map((attributes) => {
    const existing = existingVariants.find((variant) =>
      Object.entries(attributes).every(
        ([key, value]) => variant.attributes[key]?.toLowerCase() === value.toLowerCase(),
      ),
    );
    return existing
      ? { ...existing, attributes }
      : { attributes, price: 0, discount: null, quantity: 0, image: null };
  });

export const countCombinations = (options: ProductVariantOption[]): number =>
  options.reduce((total, option) => total * (option.values.length || 1), options.length ? 1 : 0);
