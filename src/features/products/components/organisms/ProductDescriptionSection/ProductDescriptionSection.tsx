"use client";

import { getLocalizedText } from "@/features/products/helpers";
import { ProductDetail } from "@/features/products/types";

const ProductDescriptionSection = ({
  product,
  locale,
}: {
  product: ProductDetail;
  locale: string;
}) => {
  return (
    <p className="text-body whitespace-pre-line text-muted-foreground">
      {getLocalizedText(product.productDescription, locale)}
    </p>
  );
};

export default ProductDescriptionSection;
