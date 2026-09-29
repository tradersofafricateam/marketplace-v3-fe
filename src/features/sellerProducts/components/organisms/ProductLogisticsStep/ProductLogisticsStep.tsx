import SearchableSelect from "@/components/molecules/SearchableSelect/SearchableSelect";
import { marketplaceUnits } from "../../../constants/productOptions";
import ProductNumberField from "../../atoms/ProductNumberField/ProductNumberField";
import DashboardTextField from "@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField";
import DashboardSelectField from "@/features/dashboard/components/atoms/DashboardSelectField/DashboardSelectField";
import type { ProductFormErrors, ProductFormHandlers, ProductFormState } from "../../../types";

const durationUnitOptions = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
];

const ProductLogisticsStep = ({
  values,
  errors,
  handleChange,
  setFieldValue,
}: {
  values: ProductFormState;
  errors: ProductFormErrors;
} & ProductFormHandlers) => (
  <div className="space-y-6">
    <fieldset>
      <legend className="mb-3 text-sm font-bold">Supply capacity</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProductNumberField
          id="supplyCapacity"
          label="Maximum quantity you can supply"
          required
          value={values.supplyCapacity}
          onValueChange={(value) => setFieldValue("supplyCapacity", value)}
          error={errors.supplyCapacity}
        />
        <SearchableSelect
          id="unitForSupplyCapacity"
          label="Unit"
          required
          value={values.unitForSupplyCapacity}
          options={marketplaceUnits}
          onChange={(value) => setFieldValue("unitForSupplyCapacity", value)}
          error={errors.unitForSupplyCapacity}
        />
      </div>
    </fieldset>

    <fieldset className="border-t border-border pt-6">
      <legend className="mb-3 text-sm font-bold">Minimum order</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProductNumberField
          id="minOrdersAllowed"
          label="Minimum quantity a buyer can order"
          required
          value={values.minOrdersAllowed}
          onValueChange={(value) => setFieldValue("minOrdersAllowed", value)}
          error={errors.minOrdersAllowed}
        />
        <SearchableSelect
          id="unitForMinOrder"
          label="Unit"
          required
          value={values.unitForMinOrder}
          options={marketplaceUnits}
          onChange={(value) => setFieldValue("unitForMinOrder", value)}
          error={errors.unitForMinOrder}
        />
      </div>
    </fieldset>

    <fieldset className="border-t border-border pt-6">
      <legend className="mb-3 text-sm font-bold">Lead time</legend>
      <div className="grid gap-4 sm:grid-cols-3">
        <ProductNumberField
          id="minDuration"
          decimals={false}
      label="Minimum"
          required
          value={values.minDuration}
          onValueChange={(value) => setFieldValue("minDuration", value)}
          error={errors.minDuration}
        />
        <ProductNumberField
          id="maxDuration"
          decimals={false}
      label="Maximum"
          required
          value={values.maxDuration}
          onValueChange={(value) => setFieldValue("maxDuration", value)}
          error={errors.maxDuration}
        />
        <DashboardSelectField
          id="durationUnit"
          name="durationUnit"
          label="Unit"
          options={durationUnitOptions}
          value={values.durationUnit}
          error={errors.durationUnit}
          onChange={handleChange}
        />
      </div>
    </fieldset>

    <DashboardTextField
      id="barcode"
      name="barcode"
      label="Barcode (optional)"
      value={values.barcode}
      onChange={handleChange}
    />
  </div>
);

export default ProductLogisticsStep;
