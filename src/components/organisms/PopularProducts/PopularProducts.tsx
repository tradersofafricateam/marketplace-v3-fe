import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";
import { products } from "@/features/products/constants/dummy";

const PopularProducts = () => {
  return (
    <SectionWrapper className="sm:pb-14 pb-10">
      <ProductCardWrapper title="Popular Products" products={products} />
    </SectionWrapper>
  );
};

export default PopularProducts;
