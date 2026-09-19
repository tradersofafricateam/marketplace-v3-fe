import type { SellerVerificationStatus } from "@/features/dashboard/types";

export function safeReturnUrl(value?: string): string | undefined {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20]/.test(value)) return undefined;
  try {
    const url = new URL(value, "https://tofa.local");
    return url.origin === "https://tofa.local" ? `${url.pathname}${url.search}${url.hash}` : undefined;
  } catch { return undefined; }
}

export function sellerAccessDestination(status: SellerVerificationStatus["verificationStatus"], locale: string) {
  if (status === "approved") return `/${locale}/seller`;
  if (status === "not_submitted") return `/${locale}/become-seller`;
  return `/${locale}/become-seller/status`;
}
