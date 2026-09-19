import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useVariantBuilder } from "../../../hooks/useVariantBuilder";
import { countCombinations } from "../../../helpers/variantCombinations";
import VariantCombinationRow from "../../molecules/VariantCombinationRow/VariantCombinationRow";
import type { ProductFormErrors, ProductVariant, ProductVariantOption } from "../../../types";

const inputClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-(--orange)";

const ProductVariantsStep = ({
  options,
  variants,
  errors,
  onOptionsChange,
  onVariantsChange,
}: {
  options: ProductVariantOption[];
  variants: ProductVariant[];
  errors: ProductFormErrors;
  onOptionsChange: (options: ProductVariantOption[]) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
}) => {
  const { addOption, removeOption, setOptionName, setOptionValues, updateVariant, canAddOption } = useVariantBuilder({
    options,
    variants,
    onOptionsChange,
    onVariantsChange,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold">Variant options (up to 3)</span>
          <button
            type="button"
            onClick={addOption}
            disabled={!canAddOption}
            className="flex items-center gap-1.5 rounded-lg border border-(--orange)/30 px-3 py-1.5 text-xs font-semibold text-(--orange) transition hover:bg-(--orange-light) disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus size={14} /> Add option
          </button>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-xl border border-border p-3 sm:flex-row sm:items-center">
              <input
                placeholder="Option name, e.g. Color"
                value={option.name}
                onChange={(e) => setOptionName(index, e.target.value)}
                className={cn(inputClass, "sm:w-40")}
              />
              <input
                placeholder="Values, comma-separated, e.g. Red, Blue"
                value={option.values.join(", ")}
                onChange={(e) =>
                  setOptionValues(
                    index,
                    e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                  )
                }
                className={cn(inputClass, "flex-1")}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                aria-label="Remove option"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {options.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Add at least one option (e.g. Size, Color) to generate purchasable variants.
            </p>
          )}
        </div>
        {errors.variantOptions && <p className="mt-2 text-xs font-medium text-destructive">{errors.variantOptions}</p>}
      </div>

      {variants.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-bold">
            {variants.length} combination{variants.length === 1 ? "" : "s"} generated
            {countCombinations(options) !== variants.length && ` (of ${countCombinations(options)} possible)`}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] px-3">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                  <th className="py-2.5 pl-3">Combination</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Discount %</th>
                  <th className="py-2.5">Quantity</th>
                </tr>
              </thead>
              <tbody className="px-3">
                {variants.map((variant, index) => (
                  <VariantCombinationRow
                    key={JSON.stringify(variant.attributes)}
                    variant={variant}
                    onChange={(patch) => updateVariant(index, patch)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {errors.variants && <p className="mt-2 text-xs font-medium text-destructive">{errors.variants}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductVariantsStep;
