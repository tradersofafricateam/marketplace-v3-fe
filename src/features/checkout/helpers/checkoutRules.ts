import type { DeliveryOptions, DeliverySelection } from "../types";
export const quoteIsValid = (expiresAt: string, now = Date.now()) => new Date(expiresAt).getTime() > now;
export function deliveryIsComplete(options: DeliveryOptions | undefined, selections: DeliverySelection[], sellerIds: string[], now = Date.now()) {
  if (!options || !sellerIds.length || selections.length !== sellerIds.length) return false;
  return sellerIds.every((id) => {
    const group = options.sellerGroups.find((group) => group.sellerId === id);
    const selection = selections.find((item) => item.sellerId === id);
    if (!group || !selection) return false;
    if (selection.type === "integrated_logistics") return group.integratedOptions.some((quote) => quote.quoteId === selection.quoteId && quoteIsValid(quote.expiresAt, now));
    return selection.quoteId === null && (selection.type === "seller_arranged" ? group.sellerArrangedOption?.available : selection.type === "buyer_arranged" && group.buyerArrangedOption?.available);
  });
}
