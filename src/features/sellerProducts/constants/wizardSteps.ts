import { ClipboardList, Coins, Images, Layers, ListChecks, Truck } from "lucide-react";

import type { ProductType, WizardStep } from "../types";

export const getWizardSteps = (productType: ProductType): WizardStep[] => [
  { key: "basicInfo", label: "Basic info", icon: ClipboardList },
  ...(productType === "SIMPLE"
    ? ([{ key: "pricing", label: "Pricing & stock", icon: Coins }] as const)
    : ([{ key: "variants", label: "Variants", icon: Layers }] as const)),
  { key: "logistics", label: "Logistics", icon: Truck },
  { key: "images", label: "Images", icon: Images },
  { key: "review", label: "Review", icon: ListChecks },
];
