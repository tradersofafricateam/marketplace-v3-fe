import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import Navbar from "@/components/organisms/Navbar/Navbar";

import { useTranslations } from "next-intl";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("Nav");
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <FooterSection />
    </div>
  );
};

export default MainLayout;
