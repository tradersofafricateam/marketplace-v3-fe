import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { useTranslations } from "next-intl";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { calculateFinalPrice } from "../../../helpers/pricing";
import type { ProductFormState } from "../../../types";

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const ProductReviewStep = ({ values, isEditing }: { values: ProductFormState; isEditing: boolean }) => {
  const { formatMoney } = useCurrency();
  const categoryT = useTranslations("CategoryData");
  const categories = useCategories();
  const categoryNames = categories.data?.filter((item) => values.categoryIds.includes(item.id)).map((item) => item.name).join(", ");
  const priceSummary =
    values.productType === "SIMPLE"
      ? formatMoney(calculateFinalPrice(Number(values.price) || 0, values.discount ? Number(values.discount) : null), values.currency)
      : `${values.variants.length} variant${values.variants.length === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border p-4">
        <SummaryRow label="Product name" value={values.productName || "—"} />
        <SummaryRow label="Type" value={values.productType === "SIMPLE" ? "Simple" : "Variable"} />
        <SummaryRow label="Categories" value={categories.isLoadingCurrentData ? categoryT("loading") : categories.isError ? categoryT("error") : categoryNames || "—"} />
        <SummaryRow label="Pricing" value={priceSummary} />
        <SummaryRow label="Photos" value={String(values.galleryImages.length)} />
      </div>
      {!isEditing && (
        <p className="rounded-xl bg-(--orange-light) p-4 text-sm leading-6 text-(--orange-dark)">
          Your product is saved as a draft first. Once you review it, publish it from your products list to make it
          visible to buyers.
        </p>
      )}
    </div>
  );
};

export default ProductReviewStep;
