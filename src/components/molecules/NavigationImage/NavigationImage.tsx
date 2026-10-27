"use client";

import Image from "next/image";
import { useState } from "react";

export default function NavigationImage({ src, alt, sizes, className = "" }: {
  src: string; alt: string; sizes: string; className?: string;
}) {
  const [failed, setFailed] = useState<string>();
  const valid = /^https?:\/\//.test(src) || (src.startsWith("/") && !src.startsWith("//"));
  if (!valid || failed === src) return null;
  const optimized = src.startsWith("/") || ["https://storage.googleapis.com/", "https://res.cloudinary.com/"].some(host => src.startsWith(host));
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={!optimized} className={className} onError={() => setFailed(src)} />;
}
