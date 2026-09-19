import AccountBoundary from "@/features/auth/components/templates/AccountBoundary/AccountBoundary";
import SellerStatusTemplate from "@/features/sellers/components/templates/SellerStatusTemplate/SellerStatusTemplate";
export const metadata = { title: "Seller application status | TOFA" };
export default function SellerStatusPage() { return <AccountBoundary><SellerStatusTemplate /></AccountBoundary>; }
