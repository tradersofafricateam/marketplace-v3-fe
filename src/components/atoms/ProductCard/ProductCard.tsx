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
    <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg bg-background transition-shadow duration-300 hover:shadow">
      <WishListBtn productId={id} isInWishList={isInWishList} />
      <Link
        href={routes?.productInfo(id)}
        className="group flex min-w-0 flex-1 flex-col"
      >
        <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-muted/40">
          <Image
            src={imgUrl}
            alt={productName}
            width={500}
            height={500}
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 px-1 pt-2 sm:px-2">
          <p className="truncate text-[11px] capitalize text-muted-foreground">
            {storeName}
          </p>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="line-clamp-2 min-h-9 text-sm leading-tight font-medium transition-colors duration-300 group-hover:text-(--orange) sm:text-base">
              {productName}
            </p>
            <p className="mt-auto text-xs font-medium sm:text-sm">
              {currency} {amount}{" "}
              <span className="text-[9px] font-light sm:text-[11px]">
                / {unit}
              </span>
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 px-1 py-2 sm:px-2">
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
    </article>
  );
};

export default ProductCard;
