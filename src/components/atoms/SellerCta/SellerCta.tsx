"use client";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useStore } from "@/store/authStore";
import { useSellerVerificationStatus } from "@/features/dashboard/hooks/useSellerVerificationStatus";
import SellerReviewStatusCard from "@/features/dashboard/components/molecules/SellerReviewStatusCard/SellerReviewStatusCard";

const BecomeSellerModal = dynamic(
  () => import("@/features/dashboard/components/organisms/BecomeSellerModal/BecomeSellerModal"),
  { ssr: false },
);

import Link from "next/link";
import { cn } from "@/lib/utils";

const SellerCta = ({
  href,
  children,
  variant = "orange",
  fullWidth = false,
}: {
  href: string;
  children: string;
  variant?: "orange" | "outline";
  fullWidth?: boolean;
}) => {
  const { routes } = useGetAllRoutes();
  const workspaceT = useTranslations("SellerWorkspace");
  const [open, setOpen] = useState(false);
  const user = useStore((state) => state.currentUser);
  const initialized = useStore((state) => state.isAuthInitialized);
  const { status, data, canSubmit } = useSellerVerificationStatus();
  const t = useTranslations("Dashboard.sellerPromo");
  const className = cn(
    "inline-flex min-h-10 items-center justify-center rounded-lg px-7 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    variant === "outline"
      ? "border border-border text-foreground hover:border-(--orange)/40 hover:bg-(--orange-light) focus-visible:outline-(--orange)"
      : "bg-(--orange) text-white hover:bg-(--orange-dark) focus-visible:outline-(--orange)",
    fullWidth && "w-full",
  );

  if (!initialized) return null;
  if (!user) return <Link prefetch={false} href={href} className={className}>{children}</Link>;
  if (status === "approved") return <Link prefetch={false} href={routes.seller} className={className}>{workspaceT("title")}</Link>;
  if (status === "pending") return <Link prefetch={false} href={routes.sellerStatus}><SellerReviewStatusCard /></Link>;
  if (!canSubmit) return null;

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      {status === "rejected" && (
        <p className="mb-3 text-sm text-red-600">
          {data?.rejectionReason || t("rejectedDescription")}
        </p>
      )}
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {t(status === "rejected" ? "resubmit" : "cta")}
      </button>
      <BecomeSellerModal open={open && canSubmit} onOpenChange={setOpen} />
    </div>
  );
};

export default SellerCta;
