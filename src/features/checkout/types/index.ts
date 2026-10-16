import type { CartItem } from "@/features/cart/types";
export type Address = {
  id: string; label: string; recipientName: string; phoneNumber: string;
  addressLine1: string; addressLine2?: string | null; city: string; state: string;
  country: string; postalCode?: string | null; isDefault: boolean;
};
export type AddressInput = Omit<Address, "id">;
export type DeliveryType = "integrated_logistics" | "seller_arranged" | "buyer_arranged";
export type DeliverySelection = { sellerId: string; type: DeliveryType; quoteId: string | null };
export type DeliveryQuote = {
  quoteId: string; type: "integrated_logistics"; providerId: string; providerName: string;
  serviceName: string; amount: number; currency: string;
  estimatedDelivery: { min: number; max: number; unit: string }; expiresAt: string;
};
export type ExternalDelivery = { available: boolean; type: DeliveryType; amount: null; description: string };
export type DeliveryOptions = { deliveryAddress: Partial<Address>; sellerGroups: {
  sellerId: string; storeName: string; integratedOptions: DeliveryQuote[];
  sellerArrangedOption: ExternalDelivery; buyerArrangedOption: ExternalDelivery;
}[] };
export type PaymentMethod = { code: string; name: string; requiresProof: boolean; imgUrl?: string };
export type CheckoutPreview = {
  sourceType: "cart"; deliveryAddress: Address;
  priceChanges?: { productId: string; previousPrice: number; currentPrice: number }[];
  sellerGroups: { sellerId: string; storeName: string; items: Pick<CartItem, "productId" | "variantId" | "productName" | "quantity" | "unitPrice" | "subtotal">[];
    productsSubtotal: number; delivery: { type: DeliveryType; providerName?: string; serviceName?: string; amount: number | null; estimatedDelivery?: string; description?: string }; sellerTotal: number;
  }[];
  paymentMethod: PaymentMethod;
  summary: { productsTotal: number; logisticsTotal: number; totalAmount: number; currency: string };
};
export type CheckoutSession = { checkoutId: string; sourceType: string; productsTotal: number; logisticsTotal: number; totalAmount: number; currency: string; paymentMethod: string; sellerGroupsCount: number; status: string; expiresAt: string };
