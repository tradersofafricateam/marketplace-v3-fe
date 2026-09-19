import { useMemo } from "react";
import { useLocale } from "next-intl";
import SearchableSelect from "@/components/molecules/SearchableSelect/SearchableSelect";
import { getCountryOptions } from "../../../constants/productOptions";
import CurrencySelect from "@/features/currencies/components/molecules/CurrencySelect/CurrencySelect";
import DashboardTextField from "@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField";
import RichTextEditor from "@/components/molecules/RichTextEditor/RichTextEditor";
import ProductTypeToggle from "../../atoms/ProductTypeToggle/ProductTypeToggle";
import CategoryMultiSelect from "../../molecules/CategoryMultiSelect/CategoryMultiSelect";
import type { ProductFormErrors, ProductFormHandlers, ProductFormState } from "../../../types";

const ProductBasicInfoStep = ({
  values,
  errors,
  handleChange,
  setFieldValue,
}: {
  values: ProductFormState;
  errors: ProductFormErrors;
} & ProductFormHandlers) => {
  const locale = useLocale();
  const countries = useMemo(() => getCountryOptions(locale), [locale]);
  return (
  <div className="space-y-6">
    <DashboardTextField
      id="productName"
      name="productName"
      label="Product name"
      required
      value={values.productName}
      onChange={handleChange}
      error={errors.productName}
    />

    <RichTextEditor
      label="Product description"
      value={values.productDescription}
      onChange={(html) => setFieldValue("productDescription", html)}
      placeholder="Describe what makes this product stand out - quality, sourcing, packaging..."
      error={errors.productDescription}
    />

    <div className="grid gap-4 sm:grid-cols-2">
      <SearchableSelect
        options={countries}
        id="countryOfOrigin"
        label="Country of origin"
        required
        value={values.countryOfOrigin}
        onChange={(value) => setFieldValue("countryOfOrigin", value)}
        error={errors.countryOfOrigin}
      />
      <CurrencySelect value={values.currency} onChange={(value) => setFieldValue("currency", value)} error={errors.currency} />
    </div>

    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">Product type</span>
      <ProductTypeToggle value={values.productType} onChange={(value) => setFieldValue("productType", value)} />
    </div>

    <CategoryMultiSelect
      selectedIds={values.categoryIds}
      onChange={(ids) => setFieldValue("categoryIds", ids)}
      error={errors.categoryIds}
    />
  </div>
);
};

export default ProductBasicInfoStep;
