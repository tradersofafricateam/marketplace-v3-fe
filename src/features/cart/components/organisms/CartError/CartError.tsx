"use client";
import { useCartStore } from "@/store/cartStore";
import { useTranslations } from "next-intl";
export default function CartError({ unstable_retry }: { unstable_retry: () => void }) {
  const t = useTranslations("CartPage");
  return <div role="alert" className="mx-auto max-w-lg px-6 py-24 text-center"><h2 className="text-xl font-bold">{t("loadError")}</h2><button type="button" onClick={() => { void useCartStore.getState().fetchCart({ force: true }).then(unstable_retry); }} className="mt-6 rounded-xl bg-(--orange) px-6 py-3 font-semibold text-white">{t("retry")}</button></div>;
}
