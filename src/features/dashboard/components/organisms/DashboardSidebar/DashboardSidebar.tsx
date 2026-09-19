"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { X, ArrowUpRight } from "lucide-react";

import Logo from "@/components/atoms/Logo/Logo";
import SidebarSection from "@/features/dashboard/components/molecules/SidebarSection/SidebarSection";
import SellerPromoCard from "@/features/dashboard/components/molecules/SellerPromoCard/SellerPromoCard";
import SellerReviewStatusCard from "@/features/dashboard/components/molecules/SellerReviewStatusCard/SellerReviewStatusCard";
import { useSellerVerificationStatus } from "@/features/dashboard/hooks/useSellerVerificationStatus";
import { DashboardNavSection } from "@/features/dashboard/types";

const BecomeSellerModal = dynamic(
  () =>
    import(
      "@/features/dashboard/components/organisms/BecomeSellerModal/BecomeSellerModal"
    ),
  { ssr: false },
);

const DashboardSidebar = ({
  sections,
  onNavigate,
  onClose,
}: {
  sections: DashboardNavSection[];
  onNavigate?: () => void;
  onClose?: () => void;
}) => {
  const t = useTranslations("SellerWorkspace");
  const { routes } = useGetAllRoutes();
  const [modalOpen, setModalOpen] = useState(false);
  const { status: sellerStatus, data, canSubmit } = useSellerVerificationStatus();

  const handleOpenModal = useCallback(() => setModalOpen(true), []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between px-3.5 pb-6">
        <Logo />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-muted"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-1">
        {sections.map((section) => (
          <SidebarSection
            key={section.label}
            section={section}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {sellerStatus === "approved" && <div className="p-3.5"><Link prefetch={false} href={routes.seller} className="flex items-center justify-between rounded-2xl bg-(--brown) p-5 text-sm font-bold text-white">{t("title")}<ArrowUpRight size={18} /></Link></div>}

      {(sellerStatus === "pending" || canSubmit) && (
        <div className="p-3.5">
          {sellerStatus === "pending" ? (
            <Link prefetch={false} href={routes.sellerStatus}><SellerReviewStatusCard /></Link>
          ) : (
            <SellerPromoCard onOpen={handleOpenModal} rejected={sellerStatus === "rejected"} rejectionReason={data?.rejectionReason} />
          )}
        </div>
      )}

      <BecomeSellerModal open={modalOpen && canSubmit} onOpenChange={setModalOpen} />
    </div>
  );
};

export default DashboardSidebar;
