"use client";

import Container from "@/components/atoms/Container/Container";
import CategoryMegaMenu from "@/features/categories/components/organisms/CategoryMegaMenu/CategoryMegaMenu";
import CompanyMegaMenu from "../CompanyMegaMenu/CompanyMegaMenu";
import AccountMegaMenu from "../AccountMegaMenu/AccountMegaMenu";
import type { MegaMenuId } from "@/lib/types/navigation";

export default function DesktopMegaMenu({ menu, onClose }: { menu: MegaMenuId; onClose: () => void }) {
  return <div id={`desktop-panel-${menu}`} role="region" tabIndex={-1} aria-labelledby={`desktop-trigger-${menu}`} className="absolute inset-x-0 top-full max-h-[calc(100dvh-132px)] overflow-y-auto overscroll-contain border-b border-border bg-background shadow-overlay animate-disclosure motion-reduce:animate-none max-lg:hidden">
    <Container className="py-7 xl:px-14">
      {menu === "categories" ? <CategoryMegaMenu onNavigate={onClose} /> : menu === "company" ? <CompanyMegaMenu onNavigate={onClose} /> : <AccountMegaMenu onNavigate={onClose} />}
    </Container>
  </div>;
}
