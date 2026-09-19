import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardStatCard = ({
  label,
  value,
  hint,
  isLoading = false,
}: {
  label: string;
  value: string;
  hint?: string;
  isLoading?: boolean;
}) => (
  <div aria-busy={isLoading} className="rounded-2xl border border-border bg-background p-5">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    {isLoading ? <Skeleton className="mt-2 h-9 w-20" /> : <p className="heading-font mt-2 text-2xl font-bold text-foreground sm:text-3xl">
      {value}
    </p>}
    {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export default memo(DashboardStatCard);
