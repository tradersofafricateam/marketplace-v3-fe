export type CartLogistics = {
  weight: number | null;
  weightUnit: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  dimensionUnit: string | null;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  mainImage: string | null;
  sku: string | null;
  attributes: Record<string, string> | null;
  unitPrice: number;
  discount: number | null;
  finalUnitPrice: number;
  quantity: number;
  subtotal: number;
  currency: string;
  minimumOrder: { quantity: number; unit: string };
  availableQuantity: number;
  logistics: CartLogistics;
};

export type CartSellerGroup = {
  sellerId: string;
  storeName: string;
  items: CartItem[];
  itemsCount: number;
  productsSubtotal: number;
};

export type CartData = {
  cartId: string | null;
  sellerGroups: CartSellerGroup[];
  productsSubtotal: number;
  currency: string;
  /** Number of cart lines, supplied by the API; not the sum of item quantities. */
  totalCount: number;
};
