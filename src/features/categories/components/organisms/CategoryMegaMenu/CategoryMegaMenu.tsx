"use client";

import { navigationEyebrow, navigationItem, navigationPrimary, navigationSecondary, navigationTitle } from "@/lib/constants/navigationStyles";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryTree } from "../../../hooks/useCategories";
import { flattenCategories } from "../../../helpers";
import type { Category } from "../../../types";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryArtwork from "../../atoms/CategoryArtwork/CategoryArtwork";


// Utility recipes are local to this menu; dimensions stay at each call site.
const categoryImageLinkClassName = "active:opacity-85 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-3 hover:not-focus-visible:outline-1 hover:not-focus-visible:outline-brand hover:not-focus-visible:outline-offset-1 hover:[&+h2_a]:text-brand-hover relative flex items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground [&_svg]:max-h-9 [&_svg]:max-w-9";
const categoryHeadingClassName = "-mx-2.5 flex min-h-12 items-center justify-between gap-4 rounded-md px-2.5 py-2 font-poppins text-lg font-semibold leading-[1.4] wrap-anywhere transition-colors duration-150 ease-[ease] hover:bg-brand-subtle hover:text-brand-hover hover:active:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-3 active:bg-muted active:text-brand-hover aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand-hover motion-reduce:transition-none [&_svg]:shrink-0 [&_svg]:text-brand";

export default function CategoryMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const currentId = useSearchParams().get("category");
  const query = useCategoryTree();
  const [selectedId, setSelectedId] = useState<string>();
  const t = useTranslations("CategoryData");
  const nav = useTranslations("Nav");
  const { routes } = useGetAllRoutes();
  const allCategories = <Link href={routes.categories} onClick={onNavigate} className={navigationSecondary}>{nav("navigation.allCategories")}<ChevronRight size={15} aria-hidden="true" /></Link>;
  const image = (category: Category, sizes: string) => <CategoryArtwork src={category.image} icon={category.icon} sizes={sizes} imageClassName="object-contain p-2" className="size-full bg-muted! text-muted-foreground!" />;
  const childLinks = (category: Category) => category.children.map(child => <div key={child.id}>
    <Link href={routes.categoryInfo(child.id)} aria-current={currentId === child.id ? "page" : undefined} onClick={onNavigate} className={`${navigationItem} font-semibold!`}>{child.name}</Link>
    {flattenCategories(child.children).map(leaf => <Link key={leaf.id} href={routes.categoryInfo(leaf.id)} aria-current={currentId === leaf.id ? "page" : undefined} onClick={onNavigate} className={`${navigationItem} py-2! text-muted-foreground!`}>{leaf.name}</Link>)}
  </div>);

  if (query.isLoadingCurrentData) return <div role="status" aria-label={t("loading")}>
    <div className="mb-4 flex items-center justify-between gap-6"><Skeleton className="h-5 w-28" /><Skeleton className="h-10 w-36" /></div>
    <div className="grid grid-cols-3 gap-x-6 gap-y-5 xl:gap-x-8 xl:gap-y-6">{[0, 1, 2].map(n => <div key={n}><Skeleton className="h-37 w-full" /><Skeleton className="mt-3 h-5 w-2/3" /></div>)}</div>
  </div>;
  if (query.isError || !query.data?.length) return <div className="flex items-center justify-between gap-8 py-2" role={query.isError ? "alert" : undefined}>
    <div><h2 className={navigationTitle}>{t("title")}</h2><p className="mt-2 text-sm text-muted-foreground">{t(query.isError ? "error" : "empty")}</p></div>
    <div className="flex items-center gap-3">{query.isError && <button type="button" disabled={query.isFetching} onClick={() => void query.refetch()} className={navigationSecondary}>{t("retry")}</button>}<Link href={routes.products} onClick={onNavigate} className={navigationSecondary}>{nav("navigation.products")}<ChevronRight size={15} aria-hidden="true" /></Link></div>
  </div>;

  const categories = query.data;
  if (categories.length === 1) {
    const category = categories[0];
    return <div>
      <div className="flex items-center gap-7">
        {category.image && <Link href={routes.categoryInfo(category.id)} onClick={onNavigate} aria-label={category.name} className={`${categoryImageLinkClassName} h-33 w-55 shrink-0 xl:h-36 xl:w-60`}>{image(category, "240px")}</Link>}
        <div className="min-w-0 flex-1">
          <p className={navigationEyebrow}>{t("title")}</p>
          <h2><Link href={routes.categoryInfo(category.id)} aria-current={currentId === category.id ? "page" : undefined} onClick={onNavigate} className={`${categoryHeadingClassName} justify-start! text-2xl! leading-8!`}>{category.name}<ChevronRight size={20} aria-hidden="true" /></Link></h2>
          {category.description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{category.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={routes.categoryInfo(category.id)} onClick={onNavigate} className={navigationPrimary}>{nav("mega.browseAll")}</Link>
          {allCategories}
        </div>
      </div>
      {!!category.children.length && <nav aria-label={category.name} className="mt-5 grid grid-cols-3 gap-x-8 gap-y-3">{childLinks(category)}</nav>}
    </div>;
  }

  if (categories.length <= 6 || categories.every(category => !category.children.length)) {
    const showImages = categories.some(category => category.image);
    const directory = categories.length > 6;
    return <div>
      <div className="mb-4 flex items-center justify-between gap-6"><h2 className={`${navigationTitle} mt-0! text-xl!`}>{t("title")}</h2>{allCategories}</div>
      <nav aria-label={t("title")} className={`grid gap-x-6 gap-y-5 xl:gap-x-8 xl:gap-y-6 ${categories.length === 2 ? "grid-cols-2" : categories.length > 6 ? "grid-cols-3 xl:grid-cols-4" : "grid-cols-3"}`}>
        {categories.map(category => <section key={category.id} className={`min-w-0 ${directory ? "flex items-center gap-4.5 [&>h2]:min-w-0 [&>h2]:flex-1" : ""}`}>
          {showImages && (!directory || category.image) && <Link href={routes.categoryInfo(category.id)} onClick={onNavigate} aria-label={category.name} className={`${categoryImageLinkClassName} ${directory ? "h-18 w-24 shrink-0" : "mb-2 h-37 w-full"}`}>{image(category, directory ? "96px" : categories.length === 2 ? "(min-width: 1440px) 640px, 45vw" : "(min-width: 1440px) 420px, 30vw")}</Link>}
          <h2><Link href={routes.categoryInfo(category.id)} aria-current={currentId === category.id ? "page" : undefined} onClick={onNavigate} className={categoryHeadingClassName}>{category.name}<ChevronRight size={17} aria-hidden="true" /></Link></h2>
          {!!category.children.length && <div className="mt-1 grid gap-0.5">{childLinks(category)}</div>}
        </section>)}
      </nav>
    </div>;
  }

  const selected = categories.find(category => category.id === selectedId) ?? categories.find(category => category.id === currentId || flattenCategories(category.children).some(child => child.id === currentId)) ?? categories.find(category => category.children.length) ?? categories[0];
  const selectedImage = selected.image || selected.children.find(child => child.image)?.image;
  return <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-7 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-9">
    <div className="border-r border-border pr-5">
      <p className={`${navigationEyebrow} px-3`}>{t("title")}</p>
      <div className="mt-3 max-h-80 overflow-y-auto">{categories.map(category => !category.children.length ? <Link key={category.id} href={routes.categoryInfo(category.id)} aria-current={currentId === category.id ? "page" : undefined} onClick={onNavigate} className={navigationItem}>{category.name}<ChevronRight size={14} aria-hidden="true" /></Link> : <button key={category.id} type="button" aria-pressed={selected.id === category.id} onClick={() => setSelectedId(category.id)} className={navigationItem}>{category.name}<ChevronRight size={14} aria-hidden="true" /></button>)}</div>
      <div className="mt-4">{allCategories}</div>
    </div>
    <div>
      <div className="mb-4 flex items-center justify-between gap-6"><div><h2 className={`${navigationTitle} mt-0!`}>{selected.name}</h2>{selected.description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{selected.description}</p>}</div><Link href={routes.categoryInfo(selected.id)} onClick={onNavigate} className={`${navigationSecondary} shrink-0`}>{nav("mega.browseAll")}</Link></div>
      <div className={`grid gap-7 ${selectedImage ? "grid-cols-[minmax(0,1fr)_180px] xl:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
        <nav aria-label={selected.name} className="grid grid-cols-2 content-start gap-x-6 gap-y-5 xl:grid-cols-3">{childLinks(selected)}</nav>
        {selectedImage && <Link href={routes.categoryInfo(selected.id)} onClick={onNavigate} aria-label={selected.name} className={`${categoryImageLinkClassName} h-41`}>{image({ ...selected, image: selectedImage }, "220px")}</Link>}
      </div>
    </div>
  </div>;
}
