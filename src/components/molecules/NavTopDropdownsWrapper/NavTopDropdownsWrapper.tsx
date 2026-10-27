"use client";

import { navigationControl, navigationLink } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import MarketplaceCurrencyPicker from "@/features/currencies/components/molecules/MarketplaceCurrencyPicker/MarketplaceCurrencyPicker";
import LanguagePicker from "../LanguagePicker/LanguagePicker";

export default function NavTopDropdownsWrapper() {
  const { routes } = useGetAllRoutes();
  const t = useTranslations("Nav");
  return (
    <div className="flex shrink-0 items-center gap-1 xl:gap-2">
      <Link href={routes.becomeSeller} className={navigationLink}>{t("sellOnTofa")}</Link>
      <button type="button" disabled className={navigationControl} title={t("navigation.rfqUnavailable")}>{t("requestQuote")}</button>
      <div className="ml-1 border-l border-border pl-2"><LanguagePicker /></div>
      <MarketplaceCurrencyPicker />
    </div>
  );
}
