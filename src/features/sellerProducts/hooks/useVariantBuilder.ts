"use client";

import { useCallback } from "react";

import { generateVariantCombinations, mergeVariantCombinations } from "../helpers/variantCombinations";
import type { ProductVariant, ProductVariantOption } from "../types";

const MAX_OPTIONS = 3;

/** Keeps `variants` in sync with `variantOptions`, preserving already-entered price/discount/quantity. */
export const useVariantBuilder = ({
  options,
  variants,
  onOptionsChange,
  onVariantsChange,
}: {
  options: ProductVariantOption[];
  variants: ProductVariant[];
  onOptionsChange: (options: ProductVariantOption[]) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
}) => {
  const regenerate = useCallback(
    (nextOptions: ProductVariantOption[]) => {
      onOptionsChange(nextOptions);
      const combinations = generateVariantCombinations(nextOptions.filter((option) => option.values.length > 0));
      onVariantsChange(mergeVariantCombinations(combinations, variants));
    },
    [onOptionsChange, onVariantsChange, variants],
  );

  const addOption = useCallback(() => {
    if (options.length >= MAX_OPTIONS) return;
    regenerate([...options, { name: "", values: [], sortOrder: options.length }]);
  }, [options, regenerate]);

  const removeOption = useCallback(
    (index: number) => regenerate(options.filter((_, i) => i !== index)),
    [options, regenerate],
  );

  const setOptionName = useCallback(
    (index: number, name: string) =>
      regenerate(options.map((option, i) => (i === index ? { ...option, name } : option))),
    [options, regenerate],
  );

  const setOptionValues = useCallback(
    (index: number, values: string[]) =>
      regenerate(options.map((option, i) => (i === index ? { ...option, values } : option))),
    [options, regenerate],
  );

  const updateVariant = useCallback(
    (index: number, patch: Partial<Pick<ProductVariant, "price" | "discount" | "quantity">>) =>
      onVariantsChange(variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant))),
    [onVariantsChange, variants],
  );

  return { addOption, removeOption, setOptionName, setOptionValues, updateVariant, canAddOption: options.length < MAX_OPTIONS };
};
