import { createProduct, updateProduct } from "../api";
import { mapFormStateToPayload } from "./mapFormStateToPayload";
import type { ProductFormState } from "../types";

/** Build one multipart request; existing gallery photos are retained by the server. */
export async function prepareProductPayload(values: ProductFormState, locale: string) {
  if (!values.galleryImages.length && !values.existingImages?.length) {
    throw new Error("Add at least one product image before saving.");
  }
  return mapFormStateToPayload(values, values.sourceLanguage || locale);
}

export async function createProductWithImages(values: ProductFormState, locale: string) {
  const payload = await prepareProductPayload(values, locale);
  return createProduct(payload);
}

export async function updateProductWithImages(id: string, values: ProductFormState, locale: string) {
  const payload = await prepareProductPayload(values, locale);
  return updateProduct({ id, payload });
}
