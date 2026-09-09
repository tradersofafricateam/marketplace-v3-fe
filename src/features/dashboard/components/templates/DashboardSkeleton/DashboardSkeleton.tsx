import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="flex min-h-screen bg-muted/30">
    <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:block">
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </aside>

    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="size-8 rounded-full" />
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </main>
    </div>
  </div>
);

export default DashboardSkeleton;
