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
