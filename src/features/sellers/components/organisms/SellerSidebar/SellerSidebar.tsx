"use client";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "@/components/atoms/Logo/Logo";
import SidebarSection from "@/features/dashboard/components/molecules/SidebarSection/SidebarSection";
import type { DashboardNavSection } from "@/features/dashboard/types";
import BuyerAccountLink from "../../molecules/BuyerAccountLink/BuyerAccountLink";

export default function SellerSidebar({ sections, onNavigate, onClose }: { sections: DashboardNavSection[]; onNavigate?: () => void; onClose?: () => void }) {
  const t = useTranslations("SellerWorkspace");
  return <div className="flex h-full flex-col">
    <div className="flex items-start justify-between px-4 pb-5"><div><Logo /><p className="mt-3 text-xs font-semibold uppercase tracking-widest text-(--orange)">{t("title")}</p></div>{onClose && <button type="button" onClick={onClose} aria-label={t("closeMenu")} className="rounded-lg p-2 hover:bg-muted"><X size={18} /></button>}</div>
    <nav aria-label={t("title")} className="flex-1 overflow-y-auto px-1">{sections.map((section) => <SidebarSection key={section.label} section={section} onNavigate={onNavigate} />)}</nav>
    <div className="border-t border-border px-3 pt-4"><BuyerAccountLink /></div>
  </div>;
}
