import { axiosInstance } from "@/lib/axiosInstance";
import type { Address, AddressInput, CheckoutPreview, CheckoutSession, DeliveryOptions, DeliverySelection, PaymentMethod } from "../types";
function unwrap<T>(input: unknown): T {
  let value = input;
  while (value && typeof value === "object" && !Array.isArray(value)) {
    if ("success" in value && value.success === false) throw new Error("Checkout request failed.");
    if (!("data" in value)) break;
    value = value.data;
  }
  if (value == null || typeof value !== "object") throw new Error("Invalid checkout response.");
  return value as T;
}
export async function getAddresses(signal?: AbortSignal) {
  const { data } = await axiosInstance.get("/users/addresses", { signal });
  const addresses = unwrap<Address[]>(data);
  if (!Array.isArray(addresses) || addresses.some((address) => !address || typeof address.id !== "string" || typeof address.addressLine1 !== "string")) throw new Error("Invalid addresses.");
  return addresses;
}
export async function addAddress(payload: AddressInput) {
  const { data } = await axiosInstance.post("/users/addresses", payload);
  const address = unwrap<Address>(data);
  if (!address.id) throw new Error("Missing address ID.");
  return address;
}
export async function getDeliveryOptions(addressId: string, signal?: AbortSignal) {
  const selection = await axiosInstance.patch("/checkout/address", { deliveryAddressId: addressId }, { signal });
  unwrap(selection.data);
  const { data } = await axiosInstance.post("/checkout/delivery-options", { deliveryAddressId: addressId }, { signal });
  const options = unwrap<DeliveryOptions>(data);
  if (!Array.isArray(options.sellerGroups) || options.sellerGroups.some((group) => !group || typeof group.sellerId !== "string" || !Array.isArray(group.integratedOptions) || group.integratedOptions.some((quote) => !quote || typeof quote.quoteId !== "string" || typeof quote.currency !== "string" || !Number.isFinite(quote.amount) || !quote.estimatedDelivery))) throw new Error("Invalid delivery options.");
  return options;
}
export async function selectDelivery(sellerSelections: DeliverySelection[]) {
  const { data } = await axiosInstance.post("/checkout/delivery-options/select", { sellerSelections });
  return unwrap(data);
}
export async function applyProvider(providerId: string) {
  const { data } = await axiosInstance.post("/checkout/delivery-options/apply-provider", { providerId, applyTo: "eligible_seller_groups" });
  return unwrap<{ appliedSellerGroups: string[]; unavailableSellerGroups: string[]; logisticsTotal: number }>(data);
}
export async function getPaymentMethods(signal?: AbortSignal) {
  const { data } = await axiosInstance.get("/checkout/payment-methods", { signal });
  const methods = unwrap<PaymentMethod[]>(data);
  if (!Array.isArray(methods) || methods.some((method) => !method || typeof method.code !== "string" || typeof method.name !== "string")) throw new Error("Invalid payment methods.");
  return methods;
}
export async function selectPayment(paymentMethod: string) {
  const { data } = await axiosInstance.patch("/checkout/payment-method", { paymentMethod });
  return unwrap(data);
}
export async function getCheckoutPreview(signal?: AbortSignal) {
  const { data } = await axiosInstance.get("/checkout/preview", { signal });
  const preview = unwrap<CheckoutPreview>(data);
  if (!preview.summary || ![preview.summary.productsTotal, preview.summary.logisticsTotal, preview.summary.totalAmount].every(Number.isFinite) || typeof preview.summary.currency !== "string" || !preview.deliveryAddress || !preview.paymentMethod || !Array.isArray(preview.sellerGroups) || preview.sellerGroups.some((group) => !group || !Array.isArray(group.items) || !group.delivery)) throw new Error("Invalid checkout preview.");
  return preview;
}
export async function createCheckout(notes: string) {
  const { data } = await axiosInstance.post("/checkout", { notes });
  const session = unwrap<CheckoutSession>(data);
  if (!session.checkoutId || !Number.isFinite(session.totalAmount) || typeof session.currency !== "string" || !Number.isFinite(new Date(session.expiresAt).getTime())) throw new Error("Missing checkout ID.");
  return session;
}
