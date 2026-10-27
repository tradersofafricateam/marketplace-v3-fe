import { Skeleton } from "@/components/ui/skeleton";
import type { ProductView } from "@/features/products/types";
import {
  productBodyClassName,
  productCardClassName,
  productMediaClassName,
} from "@/features/products/constants/productPresentation";

export default function ProductCardSkeleton({
  view = "grid",
}: {
  view?: ProductView;
}) {
  const list = view === "list";
  return (
    <div
      aria-hidden="true"
      data-product-card-skeleton
      className={`${productCardClassName} ${list ? "flex-row! gap-4 border-b border-border/60 pb-5 sm:gap-6" : ""}`}
    >
      <Skeleton
        className={`${productMediaClassName} ${list ? "w-28 shrink-0 self-start sm:w-44" : "w-full"}`}
      />
      <div
        className={`${productBodyClassName} ${list ? "pt-0! sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:content-center sm:gap-x-6" : ""}`}
      >
        <Skeleton className="mb-1 h-4 w-1/2 sm:col-start-1" />
        <Skeleton className="h-[1.375rem] w-4/5 sm:col-start-1" />
        <Skeleton className="mt-1.5 h-6 w-2/5 sm:col-start-1" />
        <Skeleton
          className={`h-11 w-28 rounded-full ${list ? "mt-2 sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:my-auto" : "mt-2"}`}
        />
      </div>
    </div>
  );
}
