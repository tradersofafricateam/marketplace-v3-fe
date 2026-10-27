"use client";

import { navigationControl, navigationPanel } from "@/lib/constants/navigationStyles";

import { useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export default function NavigationPopover({ trigger, children, align = "left", side = "bottom" }: {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => setOpen(false);
  useClickOutside(ref, close);

  return (
    <div ref={ref} className="relative min-w-0" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault(); event.stopPropagation(); close(); triggerRef.current?.focus();
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (!open) setOpen(true);
      requestAnimationFrame(() => {
        const items = [...(ref.current?.querySelectorAll<HTMLElement>("[data-navigation-option]") ?? [])];
        const current = items.indexOf(document.activeElement as HTMLElement);
        const index = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowDown" ? (current + 1) % items.length : current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
        items[index]?.focus();
      });
    }}>
      <button data-compact-navigation id={`${id}-trigger`} ref={triggerRef} type="button" className={navigationControl} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {trigger}<ChevronDown aria-hidden="true" size={13} className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div id={id} className={`${navigationPanel} absolute ${align === "right" ? "right-0" : "left-0"} ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
        {children(() => { close(); document.getElementById(`${id}-trigger`)?.focus(); })}
      </div>}
    </div>
  );
}
