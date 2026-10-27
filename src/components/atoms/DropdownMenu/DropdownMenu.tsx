"use client";

import { navigationDestructive, navigationItem } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavigationPopover from "@/components/molecules/NavigationPopover/NavigationPopover";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "destructive";
}

export default function DropdownMenu({ trigger, items, align = "left" }: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}) {
  const pathname = usePathname();
  return <NavigationPopover trigger={trigger} align={align}>{close => items.map(item => item.href ? (
    <Link key={item.label} data-navigation-option href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} aria-current={pathname === item.href ? "page" : undefined} onClick={close} className={navigationItem}>{item.label}</Link>
  ) : (
    <button key={item.label} data-navigation-option type="button" onClick={() => { close(); item.onClick?.(); }} className={`${navigationItem} ${item.tone === "destructive" ? navigationDestructive : ""}`}>{item.label}</button>
  ))}</NavigationPopover>;
}
