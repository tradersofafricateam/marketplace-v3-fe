import type { SellerVerificationStatus } from "@/features/dashboard/types";

type AccessResult =
  | { kind: "authenticated"; status?: SellerVerificationStatus["verificationStatus"] }
  | { kind: "unauthorized" }
  | { kind: "unavailable" };

export async function checkAccountAccess(token: string, seller: boolean): Promise<AccessResult> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return { kind: "unavailable" };
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}${seller ? "/users/me/verification-status" : "/users/me"}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 401 || response.status === 403) return { kind: "unauthorized" };
    if (!response.ok) return { kind: "unavailable" };
    const body = await response.json();
    const data = body.data ?? body;
    if (!seller) return data?.id ? { kind: "authenticated" } : { kind: "unavailable" };
    const status = data?.verificationStatus;
    if (!["approved", "pending", "rejected", "not_submitted"].includes(status)) return { kind: "unavailable" };
    return { kind: "authenticated", status };
  } catch {
    return { kind: "unavailable" };
  }
}
