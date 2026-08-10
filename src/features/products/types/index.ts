export interface ProductData {
  productName: string;
  storeName: string;
  id: string;
  currency: string;
  amount: number;
  imgUrl: string;
  isInWishList?: boolean;
  unit: string;
  totalReviews: number;
}

export interface CatalogueFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  verified: boolean;
  inStock: boolean;
  minOrder: string;
}

export type ProductView = "grid" | "list";
