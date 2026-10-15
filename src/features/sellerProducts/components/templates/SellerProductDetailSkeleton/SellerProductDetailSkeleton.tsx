import { Skeleton } from "@/components/ui/skeleton";

const SidebarCardSkeleton = ({ rows }: { rows: number }) => (
  <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
    <Skeleton className="h-4 w-32 rounded" />
    <div className="mt-5 space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3.5 w-16 rounded" />
        </div>
      ))}
    </div>
  </section>
);

const SellerProductDetailSkeleton = () => (
  <div role="status" aria-label="Loading product" className="space-y-6">
    <Skeleton className="h-4 w-28 rounded" />

    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-11 w-36 rounded-xl" />
    </div>

    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="size-16 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
        <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          <Skeleton className="h-4 w-28 rounded" />
          <div className="mt-4 space-y-2.5">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <SidebarCardSkeleton rows={3} />
        <SidebarCardSkeleton rows={4} />
        <SidebarCardSkeleton rows={3} />
      </div>
    </div>
  </div>
);

export default SellerProductDetailSkeleton;
