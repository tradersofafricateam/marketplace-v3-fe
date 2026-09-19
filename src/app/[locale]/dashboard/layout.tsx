import AccountBoundary from "@/features/auth/components/templates/AccountBoundary/AccountBoundary";

export default function BuyerAccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountBoundary>{children}</AccountBoundary>;
}
