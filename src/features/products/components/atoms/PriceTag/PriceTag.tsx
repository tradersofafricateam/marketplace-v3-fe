"use client";

import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

const PriceTag = ({
  price,
  discount,
  currency,
  unit,
  size = "lg",
}: {
  price: number;
  discount: number | null;
  currency: string;
  unit?: string;
  size?: "md" | "lg";
}) => {
  const { formatMoney } = useCurrency();
  const finalPrice = discount ? price - (price * discount) / 100 : price;


  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <p
        className={`font-sans font-bold text-foreground ${size === "lg" ? "text-2xl sm:text-3xl" : "text-lg"}`}
      >
        {formatMoney(finalPrice, currency)}
        {unit && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">/{unit}</span>
        )}
      </p>
      {discount ? (
        <>
          <p className="text-sm text-muted-foreground line-through">
            {formatMoney(price, currency)}
          </p>
          <span className="rounded-full bg-(--orange)/10 px-2 py-0.5 text-xs font-semibold text-(--orange)">
            -{discount}%
          </span>
        </>
      ) : null}
    </div>
  );
};

export default PriceTag;
