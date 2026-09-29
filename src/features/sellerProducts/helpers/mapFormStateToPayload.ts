import type { CreateProductPayload, ProductFormState } from "../types";

const toNumber = (value: string) => (value.trim() === "" ? null : Number(value));

/** Maps in-memory wizard state to the JSON payload the backend expects - never sends backend-owned fields. */
export const mapFormStateToPayload = (values: ProductFormState): CreateProductPayload => ({
  productName: { en: values.productName.trim() },
  productDescription: { en: values.productDescription },
  categoryIds: values.categoryIds,
  countryOfOrigin: values.countryOfOrigin,
  currency: values.currency,
  productType: values.productType,
  price: values.productType === "SIMPLE" ? toNumber(values.price) : null,
  discount: values.productType === "SIMPLE" ? toNumber(values.discount) : null,
  quantity: values.productType === "SIMPLE" ? toNumber(values.quantity) : null,
  barcode: values.barcode.trim() || null,
  supplyCapacity: Number(values.supplyCapacity),
  unitForSupplyCapacity: values.unitForSupplyCapacity,
  minOrdersAllowed: Number(values.minOrdersAllowed),
  unitForMinOrder: values.unitForMinOrder,
  minDuration: Number(values.minDuration),
  maxDuration: Number(values.maxDuration),
  durationUnit: values.durationUnit,
  variantOptions:
    values.productType === "VARIABLE"
      ? values.variantOptions.map(({ name, values: optionValues, sortOrder }) => ({
          name,
          values: optionValues,
          sortOrder,
        }))
      : [],
  variants:
    values.productType === "VARIABLE"
      ? values.variants.map(({ attributes, price, discount, quantity }) => ({
          attributes,
          price,
          discount,
          quantity,
        }))
      : [],
});
