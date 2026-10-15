"use client";

import { useMemo } from "react";

import { sanitizeRichText } from "@/lib/helpers/sanitizeRichText";
import ProductDetailCard from "../../molecules/ProductDetailCard/ProductDetailCard";

const ProductDescriptionCard = ({ description }: { description: string }) => {
  const safeHtml = useMemo(() => sanitizeRichText(description), [description]);

  return (
    <ProductDetailCard title="Description">
      {safeHtml.trim() ? (
        <div
          className="text-sm leading-6 text-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
          // Sanitized above to a strict paragraph/bold/italic/list allowlist.
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">No description provided.</p>
      )}
    </ProductDetailCard>
  );
};

export default ProductDescriptionCard;
