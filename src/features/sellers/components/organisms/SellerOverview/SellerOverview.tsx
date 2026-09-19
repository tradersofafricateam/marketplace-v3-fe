"use client";
import Link from "next/link";
import { ArrowUpRight, Package, ShoppingBag, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "@/store/authStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export default function SellerOverview() {
  const t = useTranslations("SellerWorkspace");
  const user = useStore((state) => state.currentUser);
  const { routes } = useGetAllRoutes();
  return <div className="space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-(--brown) p-7 text-white sm:p-10">
      <div aria-hidden="true" className="absolute -right-10 -top-20 size-72 rounded-full border-[35px] border-white/5" />
      <p className="text-xs font-semibold uppercase tracking-widest text-(--orange)">{t("approved")}</p>
      <h2 className="heading-font relative mt-3 text-3xl font-bold">{t("welcome", { name: user?.storeName || user?.companyName || user?.firstName || t("title") })}</h2>
      <p className="text-body relative mt-3 max-w-lg text-white/70">{t("intro")}</p>
      <Link prefetch={false} href={`${routes.seller}/store`} className="relative mt-6 inline-flex items-center gap-3 rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold">{t("viewStore")}<ArrowUpRight size={18} /></Link>
    </section>
    <div className="grid gap-4 md:grid-cols-3">{([{ key: "products", icon: Package }, { key: "orders", icon: ShoppingBag }, { key: "rfqs", icon: Store }] as const).map(({ key, icon: Icon }) => <Link prefetch={false} key={key} href={`${routes.seller}/${key}`} className="group rounded-2xl border border-border bg-background p-6 transition hover:border-(--orange)/50 hover:shadow-sm"><div className="flex justify-between"><span className="rounded-xl bg-(--orange)/10 p-3 text-(--orange)"><Icon size={22} /></span><ArrowUpRight size={18} className="text-muted-foreground group-hover:text-(--orange)" /></div><h3 className="mt-5 font-bold">{t(`nav.${key}`)}</h3><p className="text-body mt-2 text-muted-foreground">{t(`descriptions.${key}`)}</p></Link>)}</div>
    <section className="rounded-2xl border border-border bg-background p-6"><h3 className="font-bold">{t("businessActivity")}</h3><p className="text-body mt-3 text-muted-foreground">{t("unavailable")}</p></section>
  </div>;
}
