import type { CreateProductPayload, ProductFormState } from "../types";
import { variantImageKey } from "./variantImageKey";

const appendImage = (form: FormData, field: string, file: File) => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use JPG, PNG or WebP product images.");
  }
  form.append(field, file);
};

/** Serialize the API's multipart fields without backend-owned ids or SKUs. */
export const mapFormStateToPayload = (
  values: ProductFormState,
  sourceLanguage = values.sourceLanguage || "en",
): CreateProductPayload => {
  const form = new FormData();
  form.append("productName", values.productName.trim());
  form.append("productDescription", values.productDescription);
  form.append("sourceLanguage", sourceLanguage);
  form.append("productType", values.productType === "SIMPLE" ? "simple" : "variable");
  for (const field of [
    "countryOfOrigin", "currency", "supplyCapacity", "unitForSupplyCapacity",
    "minOrdersAllowed", "unitForMinOrder", "minDuration", "maxDuration", "durationUnit",
  ] as const) {
    form.append(field, values[field]);
  }
  for (const field of ["barcode", "weight", "weightUnit", "length", "width", "height", "dimensionUnit"] as const) {
    const value = values[field];
    if (value?.trim()) form.append(field, value.trim());
  }
  for (const id of values.categoryIds) form.append("categoryIds", id);

  if (values.productType === "SIMPLE") {
    form.append("price", values.price);
    form.append("quantity", values.quantity);
    // An empty discount clears an existing discount on edit.
    form.append("discount", values.discount.trim() || "0");
  } else {
    form.append("variantOptions", JSON.stringify(values.variantOptions.map(({ name, values, sortOrder }) => ({ name, values: values.map((value) => value.trim().toLowerCase()), sortOrder }))));
    const variants = values.variants.filter((variant) => variant.price > 0).map((variant) => {
      const file = values.variantImageFiles[variantImageKey(variant.attributes)];
      if (file) appendImage(form, "variantImages", file);
      const { attributes, price, discount, quantity, weight, weightUnit, length, width, height, dimensionUnit } = variant;
      return {
        attributes: Object.fromEntries(Object.entries(attributes).map(([name, value]) => [name, value.trim().toLowerCase()])),
        price, discount, quantity, weight, weightUnit, length, width, height, dimensionUnit,
        ...(file ? {} : { image: variant.image || "" }),
      };
    });
    form.append("variants", JSON.stringify(variants));
  }

  const gallery = [...values.galleryImages];
  const primaryIndex = values.primaryImageIndex - (values.existingImages?.length ?? 0);
  if (primaryIndex > 0 && primaryIndex < gallery.length) {
    gallery.unshift(...gallery.splice(primaryIndex, 1));
  }
  for (const file of gallery) appendImage(form, "images", file);
  return form;
};
