"use client";

import { navigationControl } from "@/lib/constants/navigationStyles";

import { ChevronDown } from "lucide-react";

import type { MegaMenuId } from "@/lib/types/navigation";

export default function MegaMenuTrigger({ menu, activeMenu, onToggle, children }: {
  menu: MegaMenuId;
  activeMenu: MegaMenuId | null;
  onToggle: (menu: MegaMenuId) => void;
  children: React.ReactNode;
}) {
  return <button id={`desktop-trigger-${menu}`} type="button" className={navigationControl}
    aria-expanded={activeMenu === menu} aria-controls={`desktop-panel-${menu}`}
    onClick={() => onToggle(menu)} onKeyDown={event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeMenu !== menu) onToggle(menu);
        requestAnimationFrame(() => { const panel = document.getElementById(`desktop-panel-${menu}`); (panel?.querySelector<HTMLElement>("[data-mega-entry]") ?? panel?.querySelector<HTMLElement>("a, button") ?? panel)?.focus(); });
      }
    }}>
    {children}<ChevronDown size={13} aria-hidden="true" className={`shrink-0 transition-transform ${activeMenu === menu ? "rotate-180" : ""}`} />
  </button>;
}
