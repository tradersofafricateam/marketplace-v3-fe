"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProductImage } from "../../../types";

const ProductDetailGallery = ({ images, name }: { images: ProductImage[]; name: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[Math.min(activeIndex, images.length - 1)];

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
        No product photos yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-white">
        <Image
          src={active.url}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-contain p-6"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id || image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors",
                index === activeIndex ? "border-(--orange)" : "border-border hover:border-(--orange)/40",
              )}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailGallery;
