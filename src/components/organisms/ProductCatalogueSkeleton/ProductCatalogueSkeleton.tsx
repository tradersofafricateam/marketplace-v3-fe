import Container from "@/components/atoms/Container/Container";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "../ProductGrid/ProductGrid";

export default function ProductCatalogueSkeleton() {
  return (
    <section className="bg-brand-subtle/35 pb-10 sm:pb-14">
      <Container>
        <div className="py-6 sm:py-7">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="h-9 w-60" />
          <div className="mt-2 flex items-end justify-between gap-3">
            <Skeleton className="h-5 w-3/5 max-w-80" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 py-3.5">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <div className="ml-auto flex gap-3 max-sm:w-full">
            <Skeleton className="h-11 flex-1 sm:w-44" />
            <Skeleton className="h-11 w-24" />
          </div>
        </div>
        <div className="pt-6 sm:pt-7">
          <ProductGrid loading count={12} />
        </div>
      </Container>
    </section>
  );
}
