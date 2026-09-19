"use client";

import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Archive, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useUpdateProductStatus } from "../../../hooks/useUpdateProductStatus";
import { useDeleteProduct } from "../../../hooks/useDeleteProduct";
import { getLocalizedText } from "@/features/products/helpers";
import ProductStatusBadge from "../../atoms/ProductStatusBadge/ProductStatusBadge";
import InventoryStatusBadge from "../../atoms/InventoryStatusBadge/InventoryStatusBadge";
import ConfirmDeleteDialog from "../../molecules/ConfirmDeleteDialog/ConfirmDeleteDialog";
import type { SellerProductListItem } from "../../../types";

const rowActions = (status: SellerProductListItem["status"]) => ({
  canPublish: status === "draft" || status === "inactive",
  canDeactivate: status === "active",
  canArchive: status === "active" || status === "inactive",
});

const SellerProductsTable = ({ products }: { products: SellerProductListItem[] }) => {
  const { formatMoney } = useCurrency();
  const { routes } = useGetAllRoutes();
  const { updateStatus, isUpdatingStatus } = useUpdateProductStatus();
  const { deleteProduct, isDeleting } = useDeleteProduct();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>();

  const pendingDeleteProduct = products.find((product) => product.id === pendingDeleteId);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-background">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
            <th className="py-3 pl-4">Product</th>
            <th className="py-3">Status</th>
            <th className="py-3">Inventory</th>
            <th className="py-3">Price</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const actions = rowActions(product.status);
            const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
            return (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {primaryImage && (
                        <Image src={primaryImage.url} alt="" fill sizes="44px" className="object-cover" />
                      )}
                    </span>
                    <span className="text-sm font-semibold">{getLocalizedText(product.productName, "en")}</span>
                  </div>
                </td>
                <td className="py-3">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="py-3">
                  <InventoryStatusBadge status={product.inventoryStatus} />
                </td>
                <td className="py-3 text-sm font-medium">
                  {product.productType === "SIMPLE" ? (product.price == null ? "—" : formatMoney(product.price, product.currency)) : "Varies"}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={routes.sellerProductEdit(product.id)}
                      aria-label="Edit product"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={15} />
                    </Link>
                    {actions.canPublish && (
                      <button
                        type="button"
                        aria-label="Publish product"
                        disabled={isUpdatingStatus}
                        onClick={() => updateStatus({ id: product.id, status: "active" })}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-emerald-600 disabled:opacity-50"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {actions.canDeactivate && (
                      <button
                        type="button"
                        aria-label="Deactivate product"
                        disabled={isUpdatingStatus}
                        onClick={() => updateStatus({ id: product.id, status: "inactive" })}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-amber-600 disabled:opacity-50"
                      >
                        <EyeOff size={15} />
                      </button>
                    )}
                    {actions.canArchive && (
                      <button
                        type="button"
                        aria-label="Archive product"
                        disabled={isUpdatingStatus}
                        onClick={() => updateStatus({ id: product.id, status: "archived" })}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                      >
                        <Archive size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Delete product"
                      onClick={() => setPendingDeleteId(product.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDeleteDialog
        open={Boolean(pendingDeleteProduct)}
        title="Delete this product?"
        description={
          pendingDeleteProduct
            ? `"${getLocalizedText(pendingDeleteProduct.productName, "en")}" will be removed from your catalog. This can't be undone.`
            : ""
        }
        pending={isDeleting}
        onClose={() => setPendingDeleteId(undefined)}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteProduct(pendingDeleteId, { onSuccess: () => setPendingDeleteId(undefined) });
        }}
      />
    </div>
  );
};

export default SellerProductsTable;
