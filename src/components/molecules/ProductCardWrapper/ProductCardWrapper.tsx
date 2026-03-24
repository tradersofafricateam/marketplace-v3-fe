import ProductCard from "@/components/atoms/ProductCard/ProductCard";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";

import { ProductData } from "@/features/products/types";

const ProductCardWrapper = ({
  title,
  products,
}: {
  title: string;
  products: ProductData[];
}) => {
  return (
    <div className="space-y-4">
      <SectionTitle title={title} />
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2  p-4 bg-background">
        {products?.map((prod: ProductData) => (
          <ProductCard
            key={prod?.id}
            imgUrl={prod?.imgUrl}
            isInWishList={prod?.isInWishList}
            amount={prod.amount}
            unit={prod?.unit}
            productName={prod?.productName}
            storeName={prod?.storeName}
            id={prod?.id}
            totalReviews={prod?.totalReviews}
            currency={prod?.currency}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCardWrapper;
