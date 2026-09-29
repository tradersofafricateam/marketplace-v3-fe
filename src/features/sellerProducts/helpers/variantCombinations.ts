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

/** Merges freshly generated combinations with any prices/quantities already entered for them. */
export const mergeVariantCombinations = (
  combinations: Record<string, string>[],
  existingVariants: ProductVariant[],
): ProductVariant[] =>
  combinations.map((attributes) => {
    const existing = existingVariants.find((variant) =>
      Object.entries(attributes).every(([key, value]) => variant.attributes[key] === value),
    );
    return (
      existing ?? {
        attributes,
        price: 0,
        discount: null,
        quantity: 0,
        image: null,
      }
    );
  });

/** One image is required per unique Color value (spec 3.19); variants sharing a color may share an image. */
export const getRequiredColors = (options: ProductVariantOption[]): string[] =>
  options.find((option) => option.name.toLowerCase() === "color")?.values ?? [];

export const getMissingColorImages = (
  options: ProductVariantOption[],
  variantImagesByColor: Record<string, File | string>,
): string[] =>
  getRequiredColors(options).filter((color) => !variantImagesByColor[color]);

export const countCombinations = (options: ProductVariantOption[]): number =>
  options.reduce((total, option) => total * (option.values.length || 1), options.length ? 1 : 0);
