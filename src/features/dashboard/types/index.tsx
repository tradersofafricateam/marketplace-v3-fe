import type { LucideIcon } from "lucide-react";

export type SellerUpgradePayload = {
  storeName: string;
  businessCategory: string;
  phoneNumber: string;
  country: string;
};

export type SellerUpgradeFormState = SellerUpgradePayload;

export type SellerUpgradeFormErrors = Partial<
  Record<keyof SellerUpgradeFormState, string>
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
