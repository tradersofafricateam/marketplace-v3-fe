import { SellerUpgradeFormErrors, SellerUpgradeFormState } from "../types";
import type { AuthUser } from "@/features/auth/types";
import type {
  UpdateProfileFormErrors,
  UpdateProfileFormState,
} from "../types";

export const validateSellerUpgradeForm = (
  values: SellerUpgradeFormState,
): SellerUpgradeFormErrors => {
  const errors: SellerUpgradeFormErrors = {};

  if (!values.storeName.trim()) {
    errors.storeName = "Store name is required";
  }

  if (!values.companyName.trim()) errors.companyName = "Company name is required";
  if (!values.businessType.trim()) errors.businessType = "Business type is required";
  if (!values.yearsOfBusiness.trim()) {
    errors.yearsOfBusiness = "Years of business is required";
  } else if (!Number.isFinite(Number(values.yearsOfBusiness)) || Number(values.yearsOfBusiness) < 0) {
    errors.yearsOfBusiness = "Enter a valid non-negative number of years";
  }
  if (!values.companyAddress.trim()) errors.companyAddress = "Company address is required";
  if (!values.pickupAddress.trim()) errors.pickupAddress = "Pickup address is required";

  if (!values.country.trim()) {
    errors.country = "Country is required";
  }

  return errors;
};

export const validateUpdateProfileForm = (
  values: UpdateProfileFormState,
): UpdateProfileFormErrors => {
  const errors: UpdateProfileFormErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  if (!/^\+?[1-9]\d{7,14}$/.test(values.phoneNumber.replace(/\s/g, ""))) {
    errors.phoneNumber = "Enter a valid phone number";
  }
  if (!values.selectedLanguage) errors.selectedLanguage = "Select a language";
  if (!values.deliveryAddress.trim()) {
    errors.deliveryAddress = "Delivery address is required";
  }

  return errors;
};

export const isUserProfileIncomplete = (user: AuthUser) => {
  if (typeof user.isProfileUpdated === "boolean") {
    return !user.isProfileUpdated;
  }
  if (typeof user.isProfileComplete === "boolean") {
    return !user.isProfileComplete;
  }

  return ![
    user.firstName,
    user.lastName,
    user.phoneNumber,
    user.selectedLanguage,
    user.deliveryAddress,
  ].every((value) => value?.trim());
};
