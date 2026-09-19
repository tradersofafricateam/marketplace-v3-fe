import ProductNumberField from "../../atoms/ProductNumberField/ProductNumberField";
import type { ProductFormErrors, ProductFormHandlers, ProductFormState } from "../../../types";

const ProductPricingStep = ({
  values,
  errors,
  setFieldValue,
}: {
  values: ProductFormState;
  errors: ProductFormErrors;
} & ProductFormHandlers) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <ProductNumberField
      id="price"
      label="Price"
      required
      value={values.price}
      onValueChange={(value) => setFieldValue("price", value)}
      error={errors.price}
    />
    <ProductNumberField
      id="discount"
      label="Discount %"
      value={values.discount}
      onValueChange={(value) => setFieldValue("discount", value)}
      error={errors.discount}
    />
    <ProductNumberField
      id="quantity"
      decimals={false}
      label="Stock quantity"
      required
      value={values.quantity}
      onValueChange={(value) => setFieldValue("quantity", value)}
      error={errors.quantity}
    />
  </div>
);

export default ProductPricingStep;
