"use client";

import { navigationIconButton } from "@/lib/constants/navigationStyles";

import { useTranslations } from "next-intl";


import { Menu, X } from "lucide-react";

import CartIcon from "@/components/atoms/CartIcon/CartIcon";

const NavbarActionWrapper = ({
  mobileOpen,
  toggle,
  accountControl,
}: {
  mobileOpen: boolean;
  toggle: () => void;
  accountControl: React.ReactNode;
}) => {
  const t = useTranslations("Nav");


  return (
    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
      <div className="hidden lg:block">{accountControl}</div>
      <CartIcon />
      <button
        className={`${navigationIconButton} lg:hidden!`}
        onClick={toggle}
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="marketplace-mobile-menu"
        aria-label={t("menu")}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </div>
  );
};

export default NavbarActionWrapper;
