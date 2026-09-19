import { getSellerVerificationStatus } from "@/features/dashboard/api";
import { safeReturnUrl } from "./routeAccess";

export async function getLoginDestination(returnUrl: string | undefined, dashboard: string, seller: string) {
  const intended = safeReturnUrl(returnUrl);
  if (intended) return intended;
  try {
    const { verificationStatus } = await getSellerVerificationStatus();
    return verificationStatus === "approved" ? seller : dashboard;
  } catch {
    // The buyer dashboard remains available if the verification service is down.
    return dashboard;
  }
}
