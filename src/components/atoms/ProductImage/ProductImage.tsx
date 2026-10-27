"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductImage({
  src,
  name,
  sizes,
}: {
  src?: string;
  name: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState<string>();
  const [imageFit, setImageFit] = useState<{ src: string; contain: boolean }>();
  // Unknown subjects may include packaging or specifications. Only cover when
  // the natural ratio closely matches the shared 4:3 frame (at most 2% crop).
  const contain = imageFit?.src !== src || imageFit?.contain;
  const t = useTranslations("ProductCatalogue");
  const valid =
    src &&
    (/^https?:\/\//.test(src) ||
      (src.startsWith("/") && !src.startsWith("//")));
  const optimized =
    src?.startsWith("/") ||
    src?.startsWith("https://storage.googleapis.com/") ||
    src?.startsWith("https://res.cloudinary.com/");
  if (!valid || failed === src)
    return (
      <span
        role="img"
        aria-label={t("imageUnavailable", { name })}
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
      >
        <Package size={32} strokeWidth={1.25} aria-hidden="true" />
      </span>
    );
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes}
      unoptimized={!optimized}
      className={`object-center transition-[transform,opacity] duration-200 motion-reduce:scale-100 motion-reduce:transform-none motion-reduce:transition-none ${contain ? "object-contain pointer-fine:group-hover:opacity-95" : "object-cover motion-safe:pointer-fine:group-hover:scale-[1.02]"}`}
      onLoad={(event) => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        const ratio = naturalWidth / naturalHeight;
        setImageFit({ src, contain: !Number.isFinite(ratio) || Math.abs(ratio / (4 / 3) - 1) > 0.02 });
      }}
      onError={() => setFailed(src)}
    />
  );
}
