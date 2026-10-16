import type { CartData } from "../types";
export type { CartData, CartItem, CartSellerGroup } from "../types";

import { axiosInstance } from "@/lib/axiosInstance";

export type AddCartItemPayload = { productId: string; variantId?: string; quantity: number };

export async function addCartItem({ productId, variantId, quantity }: AddCartItemPayload) {
  if (!productId.trim() || !Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid cart item.");
  }
  const { data } = await axiosInstance.post("/cart/items", {
    productId,
    ...(variantId?.trim() ? { variantId } : {}),
    quantity,
  });
  if (data?.success === false) throw new Error("Could not add item to cart.");
  return data;
}

export async function getCart(signal?: AbortSignal): Promise<CartData> {
  const { data } = await axiosInstance.get<unknown>("/cart/", { signal });
  let cart: unknown = data;
  while (typeof cart === "object" && cart !== null && !Array.isArray(cart)) {
    if ("success" in cart && cart.success === false) throw new Error("Could not load cart.");
    if (!("data" in cart)) break;
    cart = cart.data;
  }
  if (cart === null || typeof cart !== "object" || Array.isArray(cart)) throw new Error("Invalid cart response.");
  const result = cart as Partial<CartData>;
  if (!Array.isArray(result.sellerGroups) ||
      !Number.isSafeInteger(result.totalCount) || Number(result.totalCount) < 0 ||
      typeof result.productsSubtotal !== "number" || !Number.isFinite(result.productsSubtotal) ||
      (typeof result.currency !== "string" || !/^[A-Z]{3}$/.test(result.currency)) ||
      !(result.cartId === null || typeof result.cartId === "string") ||
      result.sellerGroups.some((group) => !group || typeof group.sellerId !== "string" || typeof group.storeName !== "string" || !Array.isArray(group.items) ||
        !Number.isFinite(group.productsSubtotal) || !Number.isSafeInteger(group.itemsCount) ||
        group.items.some((item) => !item || typeof item.cartItemId !== "string" || typeof item.productId !== "string" || typeof item.productName !== "string" ||
          typeof item.currency !== "string" || !/^[A-Z]{3}$/.test(item.currency) ||
          !Number.isFinite(item.quantity) || !Number.isFinite(item.finalUnitPrice) || !Number.isFinite(item.unitPrice) || !Number.isFinite(item.subtotal) ||
          !Number.isFinite(item.availableQuantity) || !item.minimumOrder || !Number.isFinite(item.minimumOrder.quantity) || typeof item.minimumOrder.unit !== "string"))) {
    throw new Error("Invalid cart response.");
  }
  return cart as CartData;
}

function assertCartWrite(data: unknown) {
  if (data && typeof data === "object" && "success" in data && data.success === false) {
    throw new Error("Cart request failed.");
  }
}
export async function updateCartItem(id: string, quantity: number) {
  if (!id || !Number.isFinite(quantity) || quantity <= 0) throw new Error("Invalid quantity.");
  const { data } = await axiosInstance.patch(`/cart/items/${encodeURIComponent(id)}`, { quantity });
  assertCartWrite(data);
}
export async function removeCartItem(id: string) {
  const { data } = await axiosInstance.delete(`/cart/items/${encodeURIComponent(id)}`);
  assertCartWrite(data);
}
export async function clearCart() {
  const { data } = await axiosInstance.delete("/cart");
  assertCartWrite(data);
}
