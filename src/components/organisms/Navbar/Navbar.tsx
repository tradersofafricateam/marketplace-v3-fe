"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "@/store/authStore";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { Skeleton } from "@/components/ui/skeleton";
import MarketplaceNavigation from "@/components/molecules/MarketplaceNavigation/MarketplaceNavigation";
import MainBar from "@/components/molecules/MainBar/MainBar";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import DesktopMegaMenu from "@/components/molecules/DesktopMegaMenu/DesktopMegaMenu";
import MegaMenuTrigger from "@/components/molecules/MegaMenuTrigger/MegaMenuTrigger";
import type { MegaMenuId } from "@/lib/types/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaMenuId | null>(null);
  const header = useRef<HTMLElement>(null);
  const t = useTranslations("Nav");
  const user = useStore((state) => state.currentUser);
  const initialized = useStore((state) => state.isAuthInitialized);
  const close = () => setActiveMenu(null);
  useClickOutside(header, close);
  // Stable callback keeps the modal's scroll-lock subscription intact.
  const toggle = useCallback(() => {
    setMobileOpen((previous) => !previous);
  }, []);
  const toggleMenu = (menu: MegaMenuId) =>
    setActiveMenu((previous) => (previous === menu ? null : menu));
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (!desktop.matches) setActiveMenu(null);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);
  return (
    <header
      ref={header}
      className={`sticky top-0 w-full border-b border-border bg-background ${mobileOpen ? "z-60" : "z-40"}`}
      onFocusCapture={(event) => {
        if (event.target.matches("button[data-compact-navigation], input"))
          close();
      }}
      onClickCapture={(event) => {
        if (
          (event.target as HTMLElement).closest(
            "button[data-compact-navigation]",
          )
        )
          close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && activeMenu) {
          event.preventDefault();
          event.stopPropagation();
          const trigger = document.getElementById(
            `desktop-trigger-${activeMenu}`,
          );
          close();
          trigger?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <MainBar
        mobileOpen={mobileOpen}
        toggle={toggle}
        onNavigate={close}
        accountControl={
          initialized ? (
            <MegaMenuTrigger
              menu="account"
              activeMenu={activeMenu}
              onToggle={toggleMenu}
            >
              <User size={18} aria-hidden="true" />
              {t(user ? "account" : "login")}
            </MegaMenuTrigger>
          ) : (
            <div
              className="flex h-10 w-24 items-center gap-2"
              aria-hidden="true"
            >
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          )
        }
      />
      <MarketplaceNavigation
        activeMenu={activeMenu}
        onToggle={toggleMenu}
        onNavigate={close}
      />
      {activeMenu && <DesktopMegaMenu menu={activeMenu} onClose={close} />}
      <AnimatePresence mode="wait">
        {mobileOpen && <Sidebar toggle={toggle} />}
      </AnimatePresence>
    </header>
  );
}
