"use client";

import { navigationPrimary } from "@/lib/constants/navigationStyles";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const MainSearchbar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full min-w-0 flex-1 max-w-2xl">
      <form
        role="search"
        className="group relative flex h-12 w-full items-center gap-2 rounded-xl border border-input bg-muted/40 p-1 transition-[border-color,box-shadow] duration-150 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10"
        onSubmit={(event) => {
          event.preventDefault();
          const query = searchQuery.trim();
          router.push(
            `/${locale}/products${query ? `?q=${encodeURIComponent(query)}` : ""}`,
          );
          onNavigate?.();
        }}
      >
        <Search size={18} aria-hidden="true" className="ml-3 hidden shrink-0 text-muted-foreground sm:block" />
        <input
          type="search"
          aria-label={t("search.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm sm:px-1 outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label={t("search.placeholder")}
          className={`${navigationPrimary} min-h-9! rounded-lg! px-4! sm:px-5!`}
        >
          <span className="hidden sm:inline">{t("navigation.searchAction")}</span>
          <Search size={17} aria-hidden="true" className="sm:hidden" />
        </button>
      </form>
    </div>
  );
};

export default MainSearchbar;
