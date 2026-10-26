import type { CartData, CartItem } from "../types";

export const validCartQuantity = (quantity: number, item: Pick<CartItem, "minimumOrder" | "availableQuantity">) =>
  Number.isFinite(quantity) && Number.isFinite(item.minimumOrder.quantity) && Number.isFinite(item.availableQuantity) && quantity > 0 && quantity >= item.minimumOrder.quantity && quantity <= item.availableQuantity;

export const canCheckout = (cart: CartData) => cart.totalCount > 0 && cart.sellerGroups.length > 0 &&
  cart.sellerGroups.every((group) => group.items.length > 0 && group.items.every((item) => item.currency === cart.currency && validCartQuantity(item.quantity, item)));

/** Changes to quantities/prices/items invalidate delivery selections and previews. */
export const cartRevision = (cart: CartData) => JSON.stringify(cart.sellerGroups.map((group) => [group.sellerId, group.items.map((item) => [item.cartItemId, item.quantity, item.subtotal, item.availableQuantity])]));
