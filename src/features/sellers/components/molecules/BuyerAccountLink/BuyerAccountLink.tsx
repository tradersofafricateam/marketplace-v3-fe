"use client";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export default function BuyerAccountLink() {
  const t = useTranslations("SellerWorkspace");
  const { routes } = useGetAllRoutes();
  return <Link prefetch={false} href={routes.dashboard} className="flex items-center gap-3 rounded-2xl bg-(--brown) p-4 text-white transition hover:bg-(--brown)/90">
    <ShoppingBag size={21} className="shrink-0 text-(--orange)" />
    <span className="flex-1"><span className="block text-sm font-bold">{t("myPurchases")}</span><span className="mt-1 block text-xs text-white/65">{t("buyerDescription")}</span></span>
    <ArrowUpRight size={18} />
  </Link>;
}
