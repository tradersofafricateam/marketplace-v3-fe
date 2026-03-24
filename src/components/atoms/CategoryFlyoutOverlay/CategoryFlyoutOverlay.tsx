"use client";

import { useTranslations } from "next-intl";

import { Category } from "@/lib/types/category";

import PointerArrow from "../PointerArrow/PointerArrow";
import Link from "next/link";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const CategoryFlyoutOverlay = ({
  onMouseEnter,
  onMouseLeave,
  subCategories,
}: {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  subCategories: Category[];
}) => {
  const t = useTranslations("Hero.categories");

  const { routes } = useGetAllRoutes();

  return (
    <div
      className="absolute left-[calc(100%+6px)] top-0 w-[calc(280%+12px)] overflow-y-scroll bg-background border border-muted rounded-xl shadow-lg p-4 grid lg:grid-cols-3 md:grid-cols-2 gap-6 z-20 h-full max-h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <PointerArrow />

      {subCategories?.map((cat) => (
        <div key={cat.id} className="w-full min-w-0">
          <Link
            href={routes?.categoryInfo(cat?.id)}
            className="text-[11px] font-medium text-muted-foreground uppercase pb-4 mb-2  hover:underline transition-all duration-300"
          >
            {t.has(cat.category) ? t(cat.category) : cat.category}
          </Link>
          {cat?.children?.map((sub) => (
            <Link
              key={sub.id}
              href={routes?.categoryInfo(sub?.id)}
              className="block text-xs text-foreground hover:text-(--orange)  py-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              {t.has(sub.category) ? t(sub.category) : sub.category}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoryFlyoutOverlay;
