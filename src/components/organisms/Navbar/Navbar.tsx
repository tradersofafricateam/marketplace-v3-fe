"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

import { AnimatePresence } from "framer-motion";

import MainBar from "@/components/molecules/MainBar/MainBar";
import TopNavbar from "@/components/molecules/TopNavbar/TopNavbar";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";

const Navbar = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header
      className="w-full sticky top-0 z-40 bg-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <TopNavbar />
      <MainBar mobileOpen={mobileOpen} toggle={toggle} />
      <AnimatePresence mode="wait">
        {mobileOpen && <Sidebar toggle={toggle} />}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
