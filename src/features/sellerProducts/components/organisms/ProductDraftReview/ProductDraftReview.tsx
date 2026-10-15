"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useSellerProduct } from "../../../hooks/useSellerProduct";
import { useUpdateProductStatus } from "../../../hooks/useUpdateProductStatus";
import { mapProductToFormState } from "../../../helpers/mapProductToFormState";
import ProductReviewStep from "../ProductReviewStep/ProductReviewStep";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";

export default function ProductDraftReview({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const query = useSellerProduct(productId);
  const { updateStatus, isUpdatingStatus } = useUpdateProductStatus();
  const { routes } = useGetAllRoutes();
  const locale = useLocale();

  if (query.isLoadingCurrentData) return <DashboardSkeleton />;
  if (query.isError || !query.data) {
    return <div role="alert" className="space-y-4 py-12 text-center">
      <p>Your draft is saved, but we couldn&apos;t load it for review.</p>
      <button type="button" onClick={() => void query.refetch()} className="font-semibold text-(--orange)">Try again</button>
      <Link href={routes.sellerProducts} className="block underline">Back to products</Link>
    </div>;
  }

  const product = query.data;
  const formatDate = (value: string) => new Date(value).toLocaleString(locale);
  const canSubmit = product.status === "draft" || product.status === "rejected";

  return <div className="space-y-6 rounded-2xl border border-border bg-background p-5 sm:p-7">
    <header className="space-y-2">
      <h1 className="heading-font text-2xl font-bold">Review your saved product</h1>
      <p className="text-sm text-muted-foreground">Your draft is saved. Review the details and submit it for approval when you are ready.</p>
    </header>
    <ProductReviewStep values={mapProductToFormState(product)} isEditing />
    <section className="rounded-xl border border-border p-4">
      <h2 className="mb-3 font-bold">Product history</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4"><dt>Created</dt><dd><time dateTime={product.createdAt}>{formatDate(product.createdAt)}</time></dd></div>
        <div className="flex justify-between gap-4"><dt>Last updated</dt><dd><time dateTime={product.updatedAt}>{formatDate(product.updatedAt)}</time></dd></div>
        <div className="flex justify-between gap-4"><dt>Status</dt><dd>{product.status.replaceAll("_", " ")}</dd></div>
      </dl>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <Link href={routes.sellerProducts} aria-disabled={isUpdatingStatus} onClick={(event) => { if (isUpdatingStatus) event.preventDefault(); }} className="text-sm font-semibold underline">Submit later</Link>
      {canSubmit ? <button
        type="button"
        disabled={isUpdatingStatus}
        onClick={() => updateStatus({ id: productId, status: "pending_approval" }, { onSuccess: onSubmitted })}
        className="inline-flex items-center gap-2 rounded-xl bg-(--orange) px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isUpdatingStatus && <LoaderCircle size={16} className="animate-spin" />}
        {isUpdatingStatus ? "Submitting…" : "Submit for approval"}
      </button> : <button type="button" onClick={onSubmitted} className="rounded-xl bg-(--orange) px-6 py-3 text-sm font-bold text-white">View product</button>}
    </div>
  </div>;
}
