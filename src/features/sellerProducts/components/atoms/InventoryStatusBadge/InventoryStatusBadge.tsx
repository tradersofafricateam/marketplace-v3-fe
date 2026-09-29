import { cn } from "@/lib/utils";
import type { InventoryStatus } from "../../../types";

const InventoryStatusBadge = ({ status }: { status: InventoryStatus }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 text-xs font-medium",
      status === "in_stock" ? "text-emerald-700" : "text-red-600",
    )}
  >
    <span className={cn("size-1.5 rounded-full", status === "in_stock" ? "bg-emerald-500" : "bg-red-500")} />
    {status === "in_stock" ? "In stock" : "Out of stock"}
  </span>
);

export default InventoryStatusBadge;
