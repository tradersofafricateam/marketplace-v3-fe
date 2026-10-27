"use client";
import { useState } from "react";
import { Building2, Leaf, Package } from "lucide-react";
import Image from "next/image";

export default function CategoryArtwork({ src, icon, className = "", sizes = "150px", imageClassName = "object-cover" }: { src?: string; icon?: string; className?: string; sizes?: string; imageClassName?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const url = src && (/^https?:\/\//.test(src) || (src.startsWith("/") && !src.startsWith("//"))) ? src : undefined;
  const optimized = !!url && (url.startsWith("/") || ["https://storage.googleapis.com/", "https://res.cloudinary.com/"].some((host) => url.startsWith(host)));
  const Icon = icon === "leaf" ? Leaf : icon === "building" ? Building2 : Package;
  return <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle/40 text-brand ${className}`}>
    {url && failedSrc !== url ? <Image src={url} alt="" fill sizes={sizes} unoptimized={!optimized} className={imageClassName} onError={() => setFailedSrc(url)} /> : <Icon aria-hidden="true" className="h-1/2 w-1/2" strokeWidth={1.5} />}
  </span>;
}
