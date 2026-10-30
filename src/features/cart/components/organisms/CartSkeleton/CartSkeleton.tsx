import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { purchaseColumns } from "@/lib/constants/purchaseStyles";
export default function CartSkeleton() {
  const t = useTranslations("CartPage");
  return <Container className="py-10 xl:px-14"><div role="status" aria-label={t("loading")}><Skeleton className="mb-4 h-5 w-36" /><Skeleton className="h-9 w-44" /><Skeleton className="mb-8 mt-3 h-5 w-3/5" /><div className={purchaseColumns}><div className="space-y-5"><Skeleton className="h-14 w-full" />{[0, 1].map((i) => <div key={i} className="flex gap-4 py-4"><Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-11 w-40" /></div></div>)}</div><Skeleton className="h-80 rounded-2xl" /></div></div></Container>;
}
