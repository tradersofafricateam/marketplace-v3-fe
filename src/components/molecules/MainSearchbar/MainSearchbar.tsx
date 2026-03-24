"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

const MainSearchbar = () => {
  const t = useTranslations("Nav");

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 max-w-2xl">
      <form className="relative group w-full lg:h-12 h-10 flex items-center justify-between rounded-full focus-within:border-(--orange) border border-border transition-all duration-300">
        <button
          type="submit"
          className=" block lg:hidden pl-2 text-muted-foreground"
        >
          <Search
            size={16}
            className="group-focus-within:text-(--orange) transition-colors"
          />
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full text-sm px-2 h-full bg-background outline-none transition-all duration-300 placeholder:text-muted-foreground flex-1 rounded-l-full"
        />
        <button
          type="submit"
          className="h-full bg-(--orange) hover:bg-(--orange-dark) transition-all duration-300 rounded-r-full px-8 hidden lg:block text-white"
        >
          search
        </button>
      </form>
    </div>
  );
};

export default MainSearchbar;
