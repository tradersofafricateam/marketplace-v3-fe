import type { LucideIcon } from "lucide-react";

export type SellerUpgradePayload = {
  storeName: string;
  companyName: string;
  registrationNumber?: string;
  businessType: string;
  yearsOfBusiness: string;
  companyAddress: string;
  pickupAddress: string;
  companyBio?: string;
  country: string;
  companyLogo?: File;
};

export type SellerUpgradeFormState = Omit<
  SellerUpgradePayload, "registrationNumber" | "companyBio"
> & {
  registrationNumber: string;
  companyBio: string;
};

export type SellerUpgradeFormErrors = Partial<
  Record<keyof SellerUpgradeFormState, string>
>;

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  selectedLanguage: string;
  deliveryAddress: string;
  companyBio?: string;
};

export type UpdateProfileFormState = UpdateProfilePayload & {
  companyBio: string;
};

export type UpdateProfileFormErrors = Partial<
  Record<keyof UpdateProfileFormState, string>
>;

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type DashboardNavSection = {
  label: string;
  items: DashboardNavItem[];
};

export type BuyerAnalyticsDateRange = {
  dateFrom: string;
  dateTo: string;
};

export type BuyerAnalyticsOverview = {
  orders: {
    total: number;
    completed: number;
    active: number;
    cancelled: number;
  };
  // The API sample contains no entries; their schema is not yet specified.
  spendByCurrency: unknown[];
  rfqs: {
    direct: {
      created: number;
      quotesReceived: number;
      accepted: number;
    };
    market: {
      created: number;
      quotesReceived: number;
      awarded: number;
    };
    ordersCreatedFromQuotes: number;
  };
  suppliers: {
    uniqueSuppliersPurchasedFrom: number;
  };
};

export type UserAddress = {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  isDefault: boolean;
};

export type UserAddressPayload = Omit<UserAddress, "id">;

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateUserStatusPayload = {
  status: "delete";
  reason: string;
};

export type NotificationPreference = {
  category: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  isMandatory: boolean;
};

export type NotificationPreferencesPayload = {
  preferences: Array<
    Pick<NotificationPreference, "category" | "emailEnabled" | "inAppEnabled">
  >;
};

export type SellerVerificationStatus = {
  verificationStatus: "not_submitted" | "pending" | "approved" | "rejected";
  submittedAt: string | null;
  rejectionReason: string | null;
};
