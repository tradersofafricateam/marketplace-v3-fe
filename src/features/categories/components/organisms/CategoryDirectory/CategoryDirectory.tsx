"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCategories } from "../../../hooks/useCategories";
import CategoryQueryState from "../../molecules/CategoryQueryState/CategoryQueryState";
import MainCategoryCard from "@/components/atoms/MainCategoryCard/MainCategoryCard";
import Container from "@/components/atoms/Container/Container";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export default function CategoryDirectory() {
  const t = useTranslations("CategoryData");
  const query = useCategories();
  const { routes } = useGetAllRoutes();
  const [search, setSearch] = useState("");
  const categories = query.data ?? [];
  const matches = categories.filter((category) => category.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  return <Container className="space-y-8 py-10 xl:px-14">
    <h1 className="heading-font text-3xl font-bold">{t("title")}</h1>
    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} aria-label={t("search")} placeholder={t("search")} className="h-12 w-full max-w-md rounded-xl border border-border px-4 outline-none focus:border-(--orange)" />
    <CategoryQueryState loading={query.isLoadingCurrentData} error={query.isError} empty={!categories.length} onRetry={() => void query.refetch()} />
    {categories.length > 0 && !matches.length && <p>{t("noResults")}</p>}
    <div className="flex flex-wrap gap-6">{matches.map((category) => <MainCategoryCard key={category.id} href={routes.categoryInfo(category.id)} category={category.name} image={category.image} />)}</div>
  </Container>;
}
