"use client";

import { navigationLink } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import MegaMenuTrigger from "../MegaMenuTrigger/MegaMenuTrigger";
import type { MegaMenuId } from "@/lib/types/navigation";
import NavTopDropdownsWrapper from "../NavTopDropdownsWrapper/NavTopDropdownsWrapper";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export default function MarketplaceNavigation({ activeMenu, onToggle, onNavigate }: { activeMenu: MegaMenuId | null; onToggle: (menu: MegaMenuId) => void; onNavigate: () => void }) {
  const t = useTranslations("Nav");
  const { routes } = useGetAllRoutes();

  const pathname = usePathname();
  return (
    <div className="hidden border-t border-border bg-muted/35 lg:block">
      <Container>
        <nav aria-label={t("navigation.browse")} className="flex min-h-12 items-center justify-between gap-3 py-1">
          <div className="flex min-w-0 items-center gap-1 xl:gap-3">
            <MegaMenuTrigger menu="categories" activeMenu={activeMenu} onToggle={onToggle}>{t("mega.categories")}</MegaMenuTrigger>
            <Link onClick={onNavigate} href={routes.products} aria-current={pathname === routes.products ? "page" : undefined} className={navigationLink}>{t("navigation.products")}</Link>
            <MegaMenuTrigger menu="company" activeMenu={activeMenu} onToggle={onToggle}>{t("about.label")}</MegaMenuTrigger>
          </div>
          <NavTopDropdownsWrapper />
        </nav>
      </Container>
    </div>
  );
}
