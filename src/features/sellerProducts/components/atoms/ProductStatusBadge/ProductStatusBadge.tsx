import { cn } from "@/lib/utils";
import type { ProductStatus } from "../../../types";

const styles: Record<ProductStatus, string> = {
  pending_approval: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-muted text-muted-foreground",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700",
  archived: "bg-slate-200 text-slate-700",
  deleted: "bg-red-100 text-red-700",
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize", styles[status])}>
    {status.replaceAll("_", " ")}
  </span>
);

export default ProductStatusBadge;
