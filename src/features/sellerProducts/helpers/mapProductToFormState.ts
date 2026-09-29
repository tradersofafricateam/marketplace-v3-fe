import { getLocalizedText } from "@/features/products/helpers";
import type { ProductFormState, SellerProduct } from "../types";

const toFieldString = (value: number | null | undefined) => (value === null || value === undefined ? "" : String(value));

/** Prefills the wizard from an existing product when editing - existing image URLs stay out of the File-only gallery/variant-image fields. */
export const mapProductToFormState = (product: SellerProduct): ProductFormState => ({
  productName: getLocalizedText(product.productName, "en"),
  productDescription: getLocalizedText(product.productDescription, "en"),
  categoryIds: product.categoryIds,
  countryOfOrigin: product.countryOfOrigin,
  currency: product.currency,
  productType: product.productType,
  price: toFieldString(product.price),
  discount: toFieldString(product.discount),
  quantity: toFieldString(product.quantity),
  barcode: product.barcode ?? "",
  supplyCapacity: toFieldString(product.supplyCapacity),
  unitForSupplyCapacity: product.unitForSupplyCapacity,
  minOrdersAllowed: toFieldString(product.minOrdersAllowed),
  unitForMinOrder: product.unitForMinOrder,
  minDuration: toFieldString(product.minDuration),
  maxDuration: toFieldString(product.maxDuration),
  durationUnit: product.durationUnit,
  variantOptions: product.variantOptions,
  variants: product.variants,
  galleryImages: [],
  primaryImageIndex: 0,
  variantImagesByColor: {},
});
