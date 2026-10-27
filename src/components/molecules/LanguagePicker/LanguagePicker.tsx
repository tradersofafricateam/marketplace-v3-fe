"use client";

import { usePathname } from "next/navigation";
import { locales } from "@/lib/constants/language";
import SelectDropdown from "@/components/atoms/SelectDropdown/SelectDropdown";

export default function LanguagePicker({ side = "bottom" }: { side?: "top" | "bottom" }) {
  const pathname = usePathname();
  const pathnameLocale = pathname.split("/")[1];
  const locale = locales.some(({ value }) => value === pathnameLocale)
    ? pathnameLocale
    : "en";

  const switchLocale = (newLocale: string) => {
    const localePattern = locales.map(({ value }) => value).join("|");
    const pathWithoutLocales = pathname.replace(
      new RegExp(`^/(?:${localePattern})(?=/|$)(?:/(?:${localePattern})(?=/|$))*`),
      "",
    );

    window.location.assign(`/${newLocale}${pathWithoutLocales || ""}`);
  };

  const currentLocale = locales.find((l) => l.value === locale);

  return (
      <SelectDropdown
        selected={locale}
        onSelect={switchLocale}
        options={locales}
        align="right"
        side={side}
        trigger={
          <span className="flex items-center gap-1">
            <span>{currentLocale?.label}</span>
          </span>
        }
      />
  );
}
