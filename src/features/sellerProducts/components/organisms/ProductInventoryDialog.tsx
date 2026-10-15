"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { useProductInventory } from "../../hooks/useProductInventory";
import ProductNumberField from "../atoms/ProductNumberField/ProductNumberField";
import type { SellerProduct } from "../../types";

function InventoryForm({ product, onClose }: { product: SellerProduct; onClose: () => void }) {
  const mutation = useProductInventory(product.id);
  const variable = product.productType === "VARIABLE";
  const rows = variable ? product.variants.map((variant) => ({ id: variant.id || "", label: Object.values(variant.attributes).join(" / "), quantity: variant.quantity })) : [{ id: "quantity", label: "Stock quantity", quantity: product.quantity ?? 0 }];
  const [quantities, setQuantities] = useState(() => Object.fromEntries(rows.map((row) => [row.id, String(row.quantity)])));
  const valid = rows.length > 0 && rows.every((row) => row.id && /^\d+$/.test(quantities[row.id]) && Number.isSafeInteger(Number(quantities[row.id])));
  return <div className="mt-5 space-y-4">
    {rows.map((row) => <ProductNumberField key={row.id} id={`stock-${row.id}`} label={row.label} value={quantities[row.id]} decimals={false} onValueChange={(value) => setQuantities({ ...quantities, [row.id]: value })} />)}
    {mutation.isError && <p role="alert" className="text-sm text-destructive">Inventory could not be saved. Try again.</p>}
    <button type="button" disabled={!valid || mutation.isPending} onClick={() => mutation.mutate(variable ? { variants: rows.map((row) => ({ variantId: row.id, quantity: Number(quantities[row.id]) })) } : { quantity: Number(quantities.quantity) }, { onSuccess: onClose })} className="rounded-xl bg-(--orange) px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{mutation.isPending ? "Saving…" : "Save inventory"}</button>
  </div>;
}
export default function ProductInventoryDialog({
  id,
  product,
  onClose,
}: {
  id: string;
  /** Pass this when the caller already has the full product loaded, to avoid an extra fetch. */
  product?: SellerProduct;
  onClose: () => void;
}) {
  const query = useSellerProduct(id, { enabled: !product });
  const isLoading = !product && query.isLoadingCurrentData;
  const isError = !product && (query.isError || !query.data);
  const resolvedProduct = product ?? query.data;
  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}><Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40" /><Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background p-6"><Dialog.Title className="text-xl font-semibold">Update inventory</Dialog.Title><Dialog.Description className="mt-2 text-sm text-muted-foreground">Change available stock without editing the product’s other details.</Dialog.Description>{isLoading ? <p role="status" className="mt-5">Loading stock…</p> : isError || !resolvedProduct ? <button type="button" onClick={() => void query.refetch()} className="mt-5">Could not load stock. Try again</button> : <InventoryForm product={resolvedProduct} onClose={onClose} />}<Dialog.Close className="mt-4 text-sm">Close</Dialog.Close></Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
