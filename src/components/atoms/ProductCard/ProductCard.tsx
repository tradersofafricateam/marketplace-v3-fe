"use client";

import Image from "next/image";
import Link from "next/link";

import AddToCartBtn from "../AddToCartBtn/AddToCartBtn";
import WishListBtn from "../WishListBtn/WishListBtn";

import { ProductData } from "@/features/products/types";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const ProductCard = ({
  productName,
  storeName,
  id,
  currency,
  amount,
  imgUrl,
  isInWishList = false,
  unit,
  totalReviews,
}: ProductData) => {
  const { routes } = useGetAllRoutes();

  return (
    <div className="overflow-hidden w-full rounded space-y-3 relative hover:shadow transition-all duration-300">
      <WishListBtn productId={id} isInWishList={isInWishList} />
      <Link href={routes?.productInfo(id)} className="group">
        <div className="w-full md:h-55 sm:h-44 h-28 bg-muted/40 rounded overflow-hidden">
          <Image
            src={imgUrl}
            alt={productName}
            width={250}
            height={220}
            className="w-full h-full object-cover rounded group-hover:scale-110 transition-all duration-300"
          />
        </div>
        <div className="space-y-2 sm:px-2">
          <p className="capitalize text-[11px] truncate whitespace-nowrap">
            {storeName}
          </p>
          <div className="space-y-1">
            <p className="font-medium group-hover:text-(--orange) transition-all duration-300 whitespace-nowrap truncate max-sm:text-sm">
              {productName}
            </p>
            <p className="sm:text-sm text-xs font-medium">
              {currency} {amount}{" "}
              <span className="sm:text-[11px] text-[9px] font-light">
                {" "}
                / {unit}
              </span>
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-4 justify-between py-3 sm:px-2">
        <AddToCartBtn productId={id} />
        <div
          className="sm:flex items-center gap-1 hidden"
          aria-label="Total reviews"
        >
          <svg
            width="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2689 3.45105C11.0665 2.18298 12.9335 2.18298 13.7311 3.45105L15.6599 6.5178C15.9406 6.96396 16.3864 7.28413 16.9023 7.41009L20.4489 8.27584C21.9153 8.63382 22.4922 10.3891 21.5187 11.5308L19.1643 14.2919C18.8218 14.6936 18.6515 15.2116 18.6897 15.7356L18.9527 19.3374C19.0615 20.8268 17.5511 21.9116 16.1518 21.3491L12.7678 19.9888C12.2755 19.7909 11.7245 19.7909 11.2322 19.9888L7.84818 21.3491C6.44893 21.9116 4.93851 20.8268 5.04726 19.3374L5.31026 15.7356C5.34853 15.2116 5.17825 14.6936 4.83572 14.2919L2.48129 11.5308C1.50776 10.3891 2.08469 8.63382 3.55115 8.27584L7.09769 7.41009C7.61365 7.28413 8.05944 6.96396 8.34006 6.5178L10.2689 3.45105Z"
              fill="#FDD037"
            />
          </svg>
          <p className="text-sm">({totalReviews})</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
