import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "./useGetAllRoutes";

export const useAccountLinks = () => {
  const t = useTranslations("Nav");
  const { routes } = useGetAllRoutes();

  const accountLinks = [
    { label: t("account"), href: routes?.overview },
    { label: t("orders"), href: routes?.orders },
    { label: t("settings"), href: routes?.settings },
  ];

  const authLinks = [
    { label: t("login"), href: routes?.login },
    { label: t("join"), href: routes?.register },
  ];
  return { accountLinks, authLinks };
};
