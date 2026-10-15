import Image from "next/image";

import { calculateFinalPrice } from "../../../helpers/pricing";
import ProductDetailCard from "../../molecules/ProductDetailCard/ProductDetailCard";
import type { ProductVariant, ProductVariantOption } from "../../../types";

const ProductVariantsTable = ({
  options,
  variants,
  currency,
  formatMoney,
}: {
  options: ProductVariantOption[];
  variants: ProductVariant[];
  currency: string;
  formatMoney: (amount: number, code: string) => string;
}) => (
  <ProductDetailCard title={`Variants (${variants.length})`}>
    {options.length > 0 && (
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
        {options.map((option) => (
          <p key={option.name} className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{option.name}: </span>
            {option.values.join(", ")}
          </p>
        ))}
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
            <th className="py-2 pr-3">Variant</th>
            <th className="py-2 pr-3">SKU</th>
            <th className="py-2 pr-3">Price</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, index) => (
            <tr key={variant.id ?? index} className="border-b border-border text-sm last:border-0">
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2.5">
                  {variant.image && (
                    <span className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                      <Image src={variant.image} alt="" fill sizes="32px" className="object-contain p-0.5" />
                    </span>
                  )}
                  {Object.values(variant.attributes).join(" / ")}
                </div>
              </td>
              <td className="py-2.5 pr-3 text-muted-foreground">{variant.sku ?? "—"}</td>
              <td className="py-2.5 pr-3 font-semibold">
                {formatMoney(calculateFinalPrice(variant.price, variant.discount), currency)}
                {!!variant.discount && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">
                    {formatMoney(variant.price, currency)}
                  </span>
                )}
              </td>
              <td className="py-2.5">{variant.quantity.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ProductDetailCard>
);

export default ProductVariantsTable;
