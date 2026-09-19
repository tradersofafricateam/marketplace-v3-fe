"use client";
import { useState } from "react";
import { Building2, Leaf, Package } from "lucide-react";
import Image from "next/image";

export default function CategoryArtwork({ src, icon, className = "" }: { src?: string; icon?: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const url = src && (/^https?:\/\//.test(src) || (src.startsWith("/") && !src.startsWith("//"))) ? src : undefined;
  const optimized = !!url && (url.startsWith("/") || ["https://storage.googleapis.com/", "https://res.cloudinary.com/"].some((host) => url.startsWith(host)));
  const Icon = icon === "leaf" ? Leaf : icon === "building" ? Building2 : Package;
  return <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-(--orange-light)/40 text-(--orange) ${className}`}>
    {url && failedSrc !== url ? <Image src={url} alt="" fill sizes="150px" unoptimized={!optimized} className="object-cover" onError={() => setFailedSrc(url)} /> : <Icon aria-hidden="true" className="h-1/2 w-1/2" strokeWidth={1.5} />}
  </span>;
}
