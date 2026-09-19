import { cn } from "@/lib/utils";
import type { ProductType } from "../../../types";

const options: { value: ProductType; label: string; description: string }[] = [
  { value: "SIMPLE", label: "Simple", description: "One price, one stock count" },
  { value: "VARIABLE", label: "Variable", description: "Multiple sizes, colors, etc." },
];

const ProductTypeToggle = ({
  value,
  onChange,
  disabled,
}: {
  value: ProductType;
  onChange: (value: ProductType) => void;
  disabled?: boolean;
}) => (
  <div className="grid grid-cols-2 gap-3">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        disabled={disabled}
        onClick={() => onChange(option.value)}
        className={cn(
          "rounded-xl border p-4 text-left transition-colors disabled:pointer-events-none disabled:opacity-60",
          value === option.value
            ? "border-(--orange) bg-(--orange-light)"
            : "border-border bg-background hover:border-(--orange)/40",
        )}
      >
        <p className={cn("text-sm font-bold", value === option.value && "text-(--orange-dark)")}>{option.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
      </button>
    ))}
  </div>
);

export default ProductTypeToggle;
