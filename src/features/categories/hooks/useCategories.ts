"use client";
import { useLocale } from "next-intl";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";
import { useStore } from "@/store/authStore";
import { getCategories, getCategoryTree } from "../api";

function useCategoryQuery(tree: boolean) {
  const locale = useLocale();
  const userId = useStore((state) => state.currentUser?.id);
  const selectedLanguage = useStore((state) => state.currentUser?.selectedLanguage);
  const language = selectedLanguage || locale;
  return useFreshQuery({
    queryKey: ["categories", tree ? "tree" : "list", locale, selectedLanguage, userId],
    queryFn: ({ signal }) => tree ? getCategoryTree(language, signal) : getCategories(language, signal),
  });
}
export const useCategories = () => useCategoryQuery(false);
export const useCategoryTree = () => useCategoryQuery(true);
