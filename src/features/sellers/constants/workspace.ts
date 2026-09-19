import { BarChart3, Banknote, Bell, CreditCard, FileText, LayoutDashboard, MessageSquare, Package, Receipt, ShoppingBag, Star, Store } from "lucide-react";

export const sellerWorkspaceSections = [
  { key: "overview", path: "", icon: LayoutDashboard, group: "business" },
  { key: "products", path: "products", icon: Package, group: "business" },
  { key: "orders", path: "orders", icon: ShoppingBag, group: "business" },
  { key: "rfqs", path: "rfqs", icon: FileText, group: "business" },
  { key: "messages", path: "messages", icon: MessageSquare, group: "business" },
  { key: "analytics", path: "analytics", icon: BarChart3, group: "business" },
  { key: "reviews", path: "reviews", icon: Star, group: "business" },
  { key: "settlements", path: "settlements", icon: Receipt, group: "finance" },
  { key: "payouts", path: "payouts", icon: Banknote, group: "finance" },
  { key: "subscription", path: "subscription", icon: CreditCard, group: "finance" },
  { key: "store", path: "store", icon: Store, group: "manage" },
  { key: "notifications", path: "notifications", icon: Bell, group: "manage" },
] as const;
export type SellerSection = typeof sellerWorkspaceSections[number]["key"];
