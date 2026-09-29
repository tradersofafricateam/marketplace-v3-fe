import NumericInput from "@/components/atoms/NumericInput/NumericInput";
import type { ProductVariant } from "../../../types";

const cellInputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-(--orange)";

const VariantCombinationRow = ({
  variant,
  onChange,
}: {
  variant: ProductVariant;
  onChange: (patch: Partial<Pick<ProductVariant, "price" | "discount" | "quantity">>) => void;
}) => (
  <tr className="border-b border-border last:border-0">
    <td className="py-2.5 pr-3 text-sm">
      {Object.entries(variant.attributes).map(([name, value]) => (
        <span key={name} className="mr-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {value}
        </span>
      ))}
    </td>
    <td className="py-2.5 pr-3">
      <NumericInput
        aria-label="Price"
        value={variant.price || ""}
        onValueChange={(value) => onChange({ price: value === "" ? NaN : Number(value) })}
        className={cellInputClass}
      />
    </td>
    <td className="py-2.5 pr-3">
      <NumericInput
        aria-label="Discount percentage"
        value={variant.discount ?? ""}
        onValueChange={(value) => onChange({ discount: value === "" ? null : Number(value) })}
        className={cellInputClass}
      />
    </td>
    <td className="py-2.5">
      <NumericInput
        aria-label="Quantity"
        value={variant.quantity}
        decimals={false}
        onValueChange={(value) => onChange({ quantity: value === "" ? NaN : Number(value) })}
        className={cellInputClass}
      />
    </td>
  </tr>
);

export default VariantCombinationRow;
