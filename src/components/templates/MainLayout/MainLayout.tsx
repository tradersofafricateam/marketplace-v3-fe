"use client";

import { useLocale } from "next-intl";

import TopNavbar from "@/components/molecules/TopNavbar/TopNavbar";
import Navbar from "@/components/organisms/Navbar/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen relative w-full bg-muted/70 text-primary">
      <TopNavbar />
      <Navbar />
      <main dir={isRTL ? "rtl" : "ltr"}>{children}</main>
    </div>
  );
};

export default MainLayout;
