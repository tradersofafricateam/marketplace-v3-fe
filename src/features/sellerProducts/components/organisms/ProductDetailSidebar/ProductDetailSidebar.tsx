"use client";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { useLocale } from "next-intl";
import { getAssignedCategoryLabels } from "../../../helpers/assignedCategories";
import { calculateFinalPrice } from "../../../helpers/pricing";
import ProductDetailCard from "../../molecules/ProductDetailCard/ProductDetailCard";
import ProductDetailRow from "../../molecules/ProductDetailRow/ProductDetailRow";
import InventoryStatusBadge from "../../atoms/InventoryStatusBadge/InventoryStatusBadge";
import type { SellerProduct } from "../../../types";

const ProductDetailSidebar = ({
  product,
  formatMoney,
}: {
  product: SellerProduct;
  formatMoney: (amount: number, code: string) => string;
}) => {
  const categories = useCategories();
  const locale = useLocale();
  const categoryLabels = getAssignedCategoryLabels(product.categoryIds, product.categories, categories.data, locale);

  return (
    <div className="space-y-5">
      <ProductDetailCard title="Overview">
        <dl>
          <ProductDetailRow label="Type" value={product.productType === "SIMPLE" ? "Simple" : "Variable"} />
          <ProductDetailRow label="Country of origin" value={product.countryOfOrigin} />
          <ProductDetailRow label="Currency" value={product.currency} />
          {product.barcode && <ProductDetailRow label="Barcode" value={product.barcode} />}
        </dl>
      </ProductDetailCard>

      <ProductDetailCard title="Pricing & stock">
        <dl>
          {product.productType === "SIMPLE" ? (
            <>
              <ProductDetailRow label="Price" value={product.price == null ? "Price not set" : formatMoney(product.price, product.currency)} />
              {product.price != null && !!product.discount && (
                <>
                  <ProductDetailRow label="Discount" value={`${product.discount}%`} />
                  <ProductDetailRow
                    label="Final price"
                    value={formatMoney(calculateFinalPrice(product.price ?? 0, product.discount), product.currency)}
                  />
                </>
              )}
            </>
          ) : (
            <p className="pb-2.5 text-sm text-muted-foreground">Priced individually per variant - see the variants section.</p>
          )}
          <ProductDetailRow label="Stock" value={product.totalStock.toLocaleString()} />
          <ProductDetailRow label="Inventory" value={<InventoryStatusBadge status={product.inventoryStatus} />} />
        </dl>
      </ProductDetailCard>

      <ProductDetailCard title="Logistics">
        <dl>
          <ProductDetailRow
            label="Supply capacity"
            value={`${product.supplyCapacity.toLocaleString()} ${product.unitForSupplyCapacity}`}
          />
          <ProductDetailRow
            label="Minimum order"
            value={`${product.minOrdersAllowed.toLocaleString()} ${product.unitForMinOrder}`}
          />
          <ProductDetailRow
            label="Lead time"
            value={`${product.minDuration}–${product.maxDuration} ${product.durationUnit}`}
          />
        </dl>
      </ProductDetailCard>

      <ProductDetailCard title="Categories">
        {categoryLabels.length ? (
          <div className="flex flex-wrap gap-2">
            {categoryLabels.map(({ id, name }) => (
              <span key={id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {name ?? (categories.isLoadingCurrentData ? "Loading…" : "Assigned category unavailable")}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories assigned.</p>
        )}
      </ProductDetailCard>
    </div>
  );
};

export default ProductDetailSidebar;
