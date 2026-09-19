import AccountBoundary from "@/features/auth/components/templates/AccountBoundary/AccountBoundary";
import SellerWorkspaceShell from "@/features/sellers/components/templates/SellerWorkspaceShell/SellerWorkspaceShell";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <AccountBoundary seller><SellerWorkspaceShell>{children}</SellerWorkspaceShell></AccountBoundary>;
}
