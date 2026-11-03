import type { SellerUpgradePayload } from "../types";

export const buildSellerUpgradeFormData = (payload: SellerUpgradePayload): FormData => {
  if (payload.merchantTerms !== true) {
    throw new Error("Accept the Merchant Terms before submitting your application");
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      formData.append(key, typeof value === "boolean" ? String(value) : value);
    }
  });
  return formData;
};
