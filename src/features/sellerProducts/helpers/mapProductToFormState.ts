import { getLocalizedText } from "@/features/products/helpers";
import type { ProductFormState, SellerProduct } from "../types";

const toFieldString = (value: number | null | undefined) => (value === null || value === undefined ? "" : String(value));

/** Prefills the wizard from an existing product when editing - existing image URLs stay out of the File-only gallery/variant-image fields. */
export const mapProductToFormState = (product: SellerProduct): ProductFormState => ({
  sourceLanguage: product.sourceLanguage || "en",
  productName: getLocalizedText(product.productName, product.sourceLanguage || "en"),
  productDescription: getLocalizedText(product.productDescription, product.sourceLanguage || "en"),
  categoryIds: product.categoryIds,
  countryOfOrigin: product.countryOfOrigin,
  currency: product.currency,
  productType: String(product.productType).toUpperCase() as ProductFormState["productType"],
  price: toFieldString(product.price),
  discount: toFieldString(product.discount),
  quantity: toFieldString(product.quantity),
  barcode: product.barcode ?? "",
  weight: toFieldString(product.weight),
  weightUnit: product.weightUnit ?? "",
  length: toFieldString(product.length),
  width: toFieldString(product.width),
  height: toFieldString(product.height),
  dimensionUnit: product.dimensionUnit ?? "",
  supplyCapacity: toFieldString(product.supplyCapacity),
  unitForSupplyCapacity: product.unitForSupplyCapacity,
  minOrdersAllowed: toFieldString(product.minOrdersAllowed),
  unitForMinOrder: product.unitForMinOrder,
  minDuration: toFieldString(product.minDuration),
  maxDuration: toFieldString(product.maxDuration),
  durationUnit: product.durationUnit,
  variantOptions: (product.variantOptions ?? []).map((option) => ({ ...option, values: option.values.map((value) => value.trim().toLowerCase()) })),
  variants: (product.variants ?? []).map((variant) => ({ ...variant, attributes: Object.fromEntries(Object.entries(variant.attributes).map(([name, value]) => [name, value.trim().toLowerCase()])) })),
  existingImages: product.images ?? [],
  galleryImages: [],
  primaryImageIndex: Math.max(0, product.images?.findIndex((image) => image.isPrimary) ?? 0),
  variantImageFiles: {},
});
