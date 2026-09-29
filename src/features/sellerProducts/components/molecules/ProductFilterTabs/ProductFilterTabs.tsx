import { cn } from "@/lib/utils";
import type { ProductStatus } from "../../../types";

const tabs: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const ProductFilterTabs = ({
  value,
  onChange,
}: {
  value: ProductStatus | "all";
  onChange: (value: ProductStatus | "all") => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        onClick={() => onChange(tab.value)}
        className={cn(
          "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
          value === tab.value ? "bg-(--orange) text-white" : "bg-muted text-muted-foreground hover:bg-muted/70",
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProductFilterTabs;
