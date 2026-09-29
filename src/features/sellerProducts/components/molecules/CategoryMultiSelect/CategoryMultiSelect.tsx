import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import CategoryQueryState from "@/features/categories/components/molecules/CategoryQueryState/CategoryQueryState";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCategories } from "../../../hooks/useCategories";

const MAX_CATEGORIES = 5;

const CategoryMultiSelect = ({
  selectedIds,
  onChange,
  error,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}) => {
  const t = useTranslations("CategoryData");
  const [search, setSearch] = useState("");
  const { data: categories, isLoadingCurrentData, isError, refetch } = useCategories();

  const categoryNames = useMemo(() => new Map(categories?.map((item) => [item.id, item.name])), [categories]);
  const available = categories ?? [];
  const matches = available.filter((item) => item.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const missingIds = categories ? selectedIds.filter((id) => !categories.some((item) => item.id === id)) : [];

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else if (selectedIds.length < MAX_CATEGORIES) {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{t("title")}</span>
        <span className="text-xs text-muted-foreground">{t("selected", { count: selectedIds.length, max: MAX_CATEGORIES })}</span>
      </div>
      <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} aria-label={t("search")} placeholder={t("search")} className="h-10 rounded-xl border border-border px-3 text-sm outline-none focus:border-(--orange)" />
      <div className={cn("flex max-h-64 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border p-3", error && "border-destructive")}>
        <CategoryQueryState loading={isLoadingCurrentData} error={isError} empty={available.length === 0} onRetry={() => void refetch()} />
        {!isLoadingCurrentData && !isError && available.length > 0 && matches.length === 0 && <p className="text-sm text-muted-foreground">{t("noResults")}</p>}
        {matches.map((category) => {
          const checked = selectedIds.includes(category.id);
          return (
            <button
              key={category.id}
              aria-pressed={checked}
              type="button"
              onClick={() => toggle(category.id)}
              disabled={!checked && selectedIds.length >= MAX_CATEGORIES}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                checked
                  ? "border-(--orange) bg-(--orange-light) text-(--orange-dark)"
                  : "border-border text-muted-foreground hover:border-(--orange)/40",
              )}
            >
              {checked && <Check size={13} />}
              {category.parentId && categoryNames.has(category.parentId) ? `${categoryNames.get(category.parentId)} / ` : ""}{category.name}
            </button>
          );
        })}
      </div>
      {missingIds.map((id) => <button key={id} type="button" onClick={() => toggle(id)} className="text-left text-xs text-destructive">{t("unavailableSelected")}</button>)}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default CategoryMultiSelect;
