import { SellerUpgradeFormErrors, SellerUpgradeFormState } from "../types";

export const validateSellerUpgradeForm = (
  values: SellerUpgradeFormState,
): SellerUpgradeFormErrors => {
  const errors: SellerUpgradeFormErrors = {};

  if (!values.storeName.trim()) {
    errors.storeName = "Store name is required";
  }

  if (!values.businessCategory.trim()) {
    errors.businessCategory = "Business category is required";
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  }

  if (!values.country.trim()) {
    errors.country = "Country is required";
  }

  return errors;
};
