"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { useClickOutside } from "@/lib/hooks/useClickOutside";

import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

const DropdownMenu = ({
  trigger,
  items,
  align = "left",
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-sm font-medium hover:text-(--orange) transition-colors duration-300 py-1"
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 w-52 bg-background rounded-xl shadow-xl border border-border overflow-hidden z-50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{ animation: "dropIn 0.18s ease" }}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm hover:bg-(--orange-light) hover:text-(--orange) transition-colors font-medium border-b border-muted last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
