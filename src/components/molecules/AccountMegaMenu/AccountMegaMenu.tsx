"use client";

import { navigationDestructive, navigationEyebrow, navigationItem, navigationPrimary, navigationSecondary, navigationTitle } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAccountLinks } from "@/lib/hooks/useAccountLinks";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useStore } from "@/store/authStore";

export default function AccountMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const user = useStore(state => state.currentUser);
  const { authLinks, dashboardLinks } = useAccountLinks();
  const { routes } = useGetAllRoutes();
  return <div className={user ? "mx-auto grid max-w-250 grid-cols-[minmax(220px,.8fr)_minmax(0,1.2fr)] items-center gap-12" : "mx-auto flex max-w-220 items-center justify-between gap-8 py-1 [&_h2]:text-[21px]"}>
    <div className="min-w-0">
      <p className={navigationEyebrow}>{t("account")}</p>
      <h2 className={navigationTitle}>{user ? user.firstName || user.companyName || t("dashboard") : t("mega.guestTitle")}</h2>
    </div>
    {user ? <nav aria-label={t("account")} className="grid grid-cols-2 gap-x-6 gap-y-1">{dashboardLinks.map(item => item.href ?
      <Link key={item.label} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate} className={`${navigationItem} min-h-12!`}>{item.label}</Link> :
      <button key={item.label} type="button" onClick={() => { onNavigate(); item.onClick?.(); }} className={`${navigationItem} ${navigationDestructive} min-h-12!`}>{item.label}</button>
    )}</nav> : <div>
      <div className="flex flex-wrap items-center gap-3 [&>a]:min-w-36">{authLinks.map(item => <Link key={item.label} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate} className={item.href === routes.login ? navigationPrimary : navigationSecondary}>{item.label}</Link>)}</div>
    </div>}
  </div>;
}
