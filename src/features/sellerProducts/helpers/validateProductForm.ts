import { getCountryOptions, marketplaceUnits } from "../constants/productOptions";
import type { ProductFormErrors, ProductFormState } from "../types";
import { isValidDiscount, isValidLeadTime } from "./pricing";
import { getMissingColorImages } from "./variantCombinations";

const countryNames = new Set(getCountryOptions("en").map((country) => country.value));
const unitValues = new Set(marketplaceUnits.map((unit) => unit.value));

const isNumeric = (value: string) => /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) && Number.isFinite(Number(value)) && Number(value) <= Number.MAX_SAFE_INTEGER;
const isPositiveNumber = (value: string) => isNumeric(value) && Number(value) > 0;
const isNonNegativeNumber = (value: string) => isNumeric(value) && Number(value) >= 0;

/** The rich-text editor's "empty" HTML is still a non-empty string (e.g. "<p></p>"). */
const isEmptyHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;|&#xA0;|\u00a0|\u200b/gi, " ").trim() === "";

export const validateProductForm = (values: ProductFormState, hasExistingImages = false): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!values.productName.trim()) errors.productName = "Product name is required";
  if (isEmptyHtml(values.productDescription)) errors.productDescription = "Product description is required";
  if (!countryNames.has(values.countryOfOrigin)) errors.countryOfOrigin = "Country of origin is required";
  if (!values.currency.trim()) errors.currency = "Currency is required";
  if (values.categoryIds.length < 1 || values.categoryIds.length > 5) {
    errors.categoryIds = "Select between 1 and 5 categories";
  }

  if (values.productType === "SIMPLE") {
    if (!isPositiveNumber(values.price)) errors.price = "Enter a price greater than zero";
    if (values.discount && (!isNumeric(values.discount) || !isValidDiscount(Number(values.discount)))) {
      errors.discount = "Discount must be between 0 and 100";
    }
    if (!isNonNegativeNumber(values.quantity) || !Number.isSafeInteger(Number(values.quantity))) errors.quantity = "Enter a valid stock quantity";
  } else {
    if (values.variantOptions.length < 1 || values.variantOptions.length > 3 || values.variantOptions.some((option) => !option.name.trim() || !option.values.length || option.values.some((value) => !value.trim()))) {
      errors.variantOptions = "Define between 1 and 3 named variant options, each with at least one value";
    }
    const invalidVariant = values.variants.find(
      (variant) => !Number.isFinite(variant.price) || !(variant.price > 0) || !Number.isSafeInteger(variant.quantity) || variant.quantity < 0 || !isValidDiscount(variant.discount),
    );
    if (!values.variants.length || invalidVariant) errors.variants = "Every variant needs a price above zero, a non-negative quantity, and a valid discount";

    const missingColorImages = getMissingColorImages(values.variantOptions, values.variantImagesByColor);
    if (missingColorImages.length > 0) {
      errors.variantImagesByColor = `Add an image for: ${missingColorImages.join(", ")}`;
    }
  }

  if (!isPositiveNumber(values.supplyCapacity)) errors.supplyCapacity = "Enter a valid supply capacity";
  if (!unitValues.has(values.unitForSupplyCapacity)) errors.unitForSupplyCapacity = "Unit is required";
  if (!isPositiveNumber(values.minOrdersAllowed)) errors.minOrdersAllowed = "Enter a valid minimum order quantity";
  if (!unitValues.has(values.unitForMinOrder)) errors.unitForMinOrder = "Unit is required";

  if (!isNonNegativeNumber(values.minDuration) || !Number.isSafeInteger(Number(values.minDuration))) {
    errors.minDuration = "Enter a whole number of days or weeks";
  }
  if (!isNonNegativeNumber(values.maxDuration) || !Number.isSafeInteger(Number(values.maxDuration))) {
    errors.maxDuration = "Enter a whole number of days or weeks";
  } else if (!errors.minDuration && !isValidLeadTime(Number(values.minDuration), Number(values.maxDuration))) {
    errors.maxDuration = "Maximum duration must be greater than or equal to minimum duration";
  }
  if (!["days", "weeks"].includes(values.durationUnit)) errors.durationUnit = "Duration unit is required";

  if (values.galleryImages.length === 0 && !hasExistingImages) errors.galleryImages = "Add at least one product image";

  return errors;
};
