"use client";
import { useTranslations } from "next-intl";
import { sellerWorkspaceSections, type SellerSection } from "../../../constants/workspace";
import { useStore } from "@/store/authStore";

export default function SellerSectionTemplate({ section }: { section: SellerSection }) {
  const t = useTranslations("SellerWorkspace");
  const user = useStore((state) => state.currentUser);
  const item = sellerWorkspaceSections.find((item) => item.key === section)!;
  const Icon = item.icon;
  return <div className="space-y-6"><div><p className="text-xs font-semibold uppercase tracking-widest text-(--orange)">{t("title")}</p><h2 className="heading-font mt-2 text-2xl font-bold">{t(`nav.${section}`)}</h2><p className="text-body mt-2 text-muted-foreground">{t(`descriptions.${section}`)}</p></div>
    {section === "store" && <section className="rounded-2xl border border-border bg-background p-6"><h3 className="text-xl font-bold">{user?.storeName || user?.companyName || t("nav.store")}</h3>{user?.companyBio && <p className="text-body mt-3 whitespace-pre-wrap text-muted-foreground">{user.companyBio}</p>}{user?.country && <p className="text-body mt-4">{user.country}</p>}</section>}
    <section className="flex flex-col items-center rounded-2xl border border-border bg-background px-6 py-16 text-center"><span className="rounded-2xl bg-muted p-5 text-(--orange)"><Icon size={30} strokeWidth={1.5} /></span><h3 className="mt-5 font-bold">{t("unavailableTitle")}</h3><p className="text-body mt-2 max-w-md text-muted-foreground">{t("unavailable")}</p></section>
  </div>;
}
