"use client";
import MessageNavLink from "@/features/messages/components/molecules/MessageNavLink";
import Link from "next/link";
import { Bell, Menu, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import UserMenu from "@/components/molecules/UserMenu/UserMenu";
import TopbarIconLink from "@/features/dashboard/components/atoms/TopbarIconLink/TopbarIconLink";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import WorkspaceSearch from "../../molecules/WorkspaceSearch/WorkspaceSearch";

export default function SellerTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const t = useTranslations("SellerWorkspace");
  const { routes } = useGetAllRoutes();
  return <header className="shrink-0 border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><button type="button" onClick={onMenuClick} aria-label={t("openMenu")} className="rounded-lg p-2 hover:bg-muted lg:hidden"><Menu size={20} /></button><h1 className="heading-font text-base font-bold sm:text-lg">{t("brandTitle")}</h1></div>
      <div className="flex items-center gap-1"><MessageNavLink href={`${routes.seller}/messages`} /><TopbarIconLink href={`${routes.seller}/notifications`} icon={Bell} label={t("nav.notifications")} /><div className="ml-2 border-l border-border pl-3"><UserMenu /></div></div>
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><WorkspaceSearch /><Link prefetch={false} href={routes.home} className="inline-flex items-center gap-2 text-sm font-semibold text-(--orange)">{t("marketplace")}<ArrowUpRight size={17} /></Link></div>
  </header>;
}
