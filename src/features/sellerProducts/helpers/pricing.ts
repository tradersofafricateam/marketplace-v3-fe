/**
 * finalPrice = price - (price * discount / 100), or price when discount is
 * null/0. Display-only - the backend calculates the authoritative value.
 */
export const calculateFinalPrice = (price: number, discount: number | null) =>
  discount ? price - (price * discount) / 100 : price;

/** 0 < discount < 100, or null. A 100% discount is not a valid product discount (spec 3.21). */
export const isValidDiscount = (discount: number | null) =>
  discount === null || (discount > 0 && discount < 100);

export const isValidLeadTime = (minDuration: number, maxDuration: number) =>
  minDuration >= 0 && maxDuration >= minDuration;
