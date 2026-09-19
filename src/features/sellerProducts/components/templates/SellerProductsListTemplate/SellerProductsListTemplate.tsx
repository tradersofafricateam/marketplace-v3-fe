"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useSellerProducts } from "../../../hooks/useSellerProducts";
import ProductFilterTabs from "../../molecules/ProductFilterTabs/ProductFilterTabs";
import SellerProductsTable from "../../organisms/SellerProductsTable/SellerProductsTable";
import SellerProductsEmptyState from "../../organisms/SellerProductsEmptyState/SellerProductsEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductStatus } from "../../../types";

const SellerProductsListTemplate = () => {
  const { routes } = useGetAllRoutes();
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const { data, isLoadingCurrentData, isError, refetch } = useSellerProducts(
    statusFilter === "all" ? {} : { status: statusFilter },
  );

  const hasNoProductsAtAll = statusFilter === "all" && !isLoadingCurrentData && !isError && data?.items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-(--orange)">Catalog</p>
          <h1 className="heading-font mt-1 text-2xl font-bold">Products</h1>
        </div>
        <Link
          href={routes.sellerProductNew}
          className="flex items-center gap-2 rounded-xl bg-(--orange) px-5 py-2.5 text-sm font-bold text-white transition hover:bg-(--orange-dark)"
        >
          <Plus size={17} /> Add product
        </Link>
      </div>

      {isLoadingCurrentData ? (
        <div role="status" aria-label="Loading products" className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : hasNoProductsAtAll ? (
        <SellerProductsEmptyState />
      ) : (
        <>
          <ProductFilterTabs value={statusFilter} onChange={setStatusFilter} />

          {isError && (
            <div role="alert" className="rounded-2xl border border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">We couldn&apos;t load your products.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoadingCurrentData && !isError && data && data.items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No products match this filter.
            </p>
          )}

          {!isLoadingCurrentData && !isError && data && data.items.length > 0 && <SellerProductsTable products={data.items} />}
        </>
      )}
    </div>
  );
};

export default SellerProductsListTemplate;
