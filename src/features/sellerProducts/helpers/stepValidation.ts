import type { ProductFormErrors, ProductFormState } from "../types";

export const stepFields: Record<string, (keyof ProductFormState)[]> = {
  basicInfo: ["productName", "productDescription", "countryOfOrigin", "currency", "categoryIds"],
  pricing: ["price", "discount", "quantity"],
  variants: ["variantOptions", "variants"],
  logistics: ["supplyCapacity", "unitForSupplyCapacity", "minOrdersAllowed", "unitForMinOrder", "minDuration", "maxDuration", "durationUnit"],
  images: ["galleryImages", "variantImagesByColor"],
};

export function errorsForFields(errors: ProductFormErrors, fields?: (keyof ProductFormState)[]): ProductFormErrors {
  return fields ? Object.fromEntries(Object.entries(errors).filter(([key]) => fields.includes(key as keyof ProductFormState))) : errors;
}
