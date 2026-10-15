"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LoaderCircle } from "lucide-react";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { getLocalizedText } from "@/features/products/helpers";
import { useSellerProduct } from "../../../hooks/useSellerProduct";
import { useUpdateProductStatus } from "../../../hooks/useUpdateProductStatus";
import { useDeleteProduct } from "../../../hooks/useDeleteProduct";
import ProductStatusBadge from "../../atoms/ProductStatusBadge/ProductStatusBadge";
import ProductDetailGallery from "../../organisms/ProductDetailGallery/ProductDetailGallery";
import ProductDescriptionCard from "../../organisms/ProductDescriptionCard/ProductDescriptionCard";
import ProductVariantsTable from "../../organisms/ProductVariantsTable/ProductVariantsTable";
import ProductDetailSidebar from "../../organisms/ProductDetailSidebar/ProductDetailSidebar";
import ConfirmDeleteDialog from "../../molecules/ConfirmDeleteDialog/ConfirmDeleteDialog";
import ProductInventoryDialog from "../../organisms/ProductInventoryDialog";
import SellerProductDetailSkeleton from "../SellerProductDetailSkeleton/SellerProductDetailSkeleton";

export default function SellerProductDetailTemplate({ productId }: { productId: string }) {
  const router = useRouter();
  const query = useSellerProduct(productId);
  const { updateStatus, isUpdatingStatus } = useUpdateProductStatus();
  const { deleteProduct, isDeleting } = useDeleteProduct();
  const { routes } = useGetAllRoutes();
  const locale = useLocale();
  const { formatMoney } = useCurrency();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (query.isLoadingCurrentData) return <SellerProductDetailSkeleton />;

  if (query.isError || !query.data) {
    return (
      <div role="alert" className="space-y-4 py-16 text-center">
        <p>We couldn&apos;t load this product.</p>
        <button type="button" onClick={() => void query.refetch()} className="font-semibold text-(--orange)">
          Try again
        </button>
        <Link href={routes.sellerProducts} className="block underline">
          Back to products
        </Link>
      </div>
    );
  }

  const product = query.data;
  const name = getLocalizedText(product.productName, locale);
  const description = getLocalizedText(product.productDescription, locale);
  const canSubmit = product.status === "draft" || product.status === "rejected";
  const images = [...product.images].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
  );

  return (
    <div className="space-y-6">
      <Link href={routes.sellerProducts} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
        ‹ My products
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b border-border pb-6">
        <div className="min-w-0 flex flex-wrap items-center gap-3">
          <h1 className="heading-font break-words text-2xl font-bold sm:text-3xl">{name}</h1>
          <ProductStatusBadge status={product.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setInventoryOpen(true)}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            Edit inventory
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
          >
            Delete
          </button>
          <Link
            href={routes.sellerProductEdit(product.id)}
            className="rounded-xl bg-(--orange) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--orange-dark)"
          >
            Edit product
          </Link>
        </div>
      </header>

      {canSubmit && (
        <section className="rounded-2xl border border-orange-200 bg-(--orange-light) p-5 sm:p-7">
          <h2 className="text-lg font-bold">{product.status === "draft" ? "Your draft is saved" : "Ready to resubmit?"}</h2>
          <p className="text-body mt-2">
            Review your product below. Submit it for approval now, or return to your products and submit it later.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => updateStatus({ id: product.id, status: "pending_approval" })}
              className="inline-flex items-center gap-2 rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {isUpdatingStatus && <LoaderCircle size={16} className="animate-spin" />}
              {isUpdatingStatus ? "Submitting…" : "Submit now"}
            </button>
            <Link href={routes.sellerProducts} className="text-sm font-semibold underline">
              Submit later
            </Link>
          </div>
        </section>
      )}

      {product.status === "pending_approval" && (
        <p role="status" className="rounded-xl bg-muted p-5">
          Your product has been submitted and is awaiting approval.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ProductDetailGallery images={images} name={name} />
          <ProductDescriptionCard description={description} />
          {product.productType === "VARIABLE" && (
            <ProductVariantsTable
              options={product.variantOptions}
              variants={product.variants}
              currency={product.currency}
              formatMoney={formatMoney}
            />
          )}
        </div>

        <ProductDetailSidebar product={product} formatMoney={formatMoney} />
      </div>

      {inventoryOpen && (
        <ProductInventoryDialog id={product.id} product={product} onClose={() => setInventoryOpen(false)} />
      )}

      <ConfirmDeleteDialog
        open={deleteOpen}
        title="Delete this product?"
        description={`"${name}" will be removed from your catalog. This can't be undone.`}
        pending={isDeleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteProduct(product.id, { onSuccess: () => router.push(routes.sellerProducts) })}
      />
    </div>
  );
}
