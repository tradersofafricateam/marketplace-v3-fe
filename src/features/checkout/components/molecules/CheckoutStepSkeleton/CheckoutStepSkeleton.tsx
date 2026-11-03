import { Skeleton } from "@/components/ui/skeleton";
import type { CheckoutStep } from "../../../types";
export default function CheckoutStepSkeleton({ step, label }: { step: CheckoutStep; label: string }) {
  return <div role="status" aria-label={label} className="space-y-4">
    {step === "address" ? <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}</div> : step === "payment" ? <><Skeleton className="h-20 rounded-xl" /><Skeleton className="h-20 rounded-xl" /></> : step === "delivery" ? [0, 1].map((i) => <div key={i} className="space-y-3 border-t border-border pt-5"><Skeleton className="mb-4 h-6 w-40" />{[0, 1, 2].map((j) => <Skeleton key={j} className="h-24 rounded-xl" />)}</div>) : <><div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-28 rounded-xl" /><Skeleton className="h-28 rounded-xl" /></div><Skeleton className="h-6 w-40" />{[0, 1].map((i) => <div key={i} className="flex gap-3 py-3"><Skeleton className="size-14 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-5 w-4/5" /><Skeleton className="h-4 w-2/5" /></div></div>)}<Skeleton className="h-20 rounded-xl" /></>}
  </div>;
}
