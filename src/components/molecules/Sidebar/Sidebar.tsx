"use client";

import { navigationControl, navigationDestructive, navigationEyebrow, navigationIconButton, navigationItem, navigationPrimary, navigationSecondary } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight, X } from "lucide-react";
import { useAboutUs } from "@/lib/hooks/useAboutUs";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useAccountLinks } from "@/lib/hooks/useAccountLinks";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import Logo from "@/components/atoms/Logo/Logo";
import WhatsappBtn from "@/components/atoms/WhatsappBtn/WhatsappBtn";
import { Skeleton } from "@/components/ui/skeleton";
import LanguagePicker from "../LanguagePicker/LanguagePicker";
import MainSearchbar from "../MainSearchbar/MainSearchbar";
import NavigationImage from "../NavigationImage/NavigationImage";
import MarketplaceCurrencyPicker from "@/features/currencies/components/molecules/MarketplaceCurrencyPicker/MarketplaceCurrencyPicker";
import MobileCategoryBrowser from "@/features/categories/components/organisms/MobileCategoryBrowser/MobileCategoryBrowser";

const browsingRowClassName = "flex min-h-13 w-full items-center justify-between gap-4 rounded-md p-3 text-left font-poppins text-base font-semibold leading-[1.4] transition-colors duration-150 ease-[ease] hover:bg-brand-subtle hover:text-brand-hover hover:active:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-3 active:bg-muted active:text-brand-hover aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand-hover motion-reduce:transition-none [&_svg]:shrink-0 [&_svg]:text-brand";

type MobileView = "root" | "categories" | "company";

export default function Sidebar({ toggle }: { toggle: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const companyHeading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MobileView>("root");
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Nav");
  const about = useTranslations("aboutUs");
  const { aboutItems } = useAboutUs();
  const { routes } = useGetAllRoutes();
  const { authLinks, dashboardLinks } = useAccountLinks();
  const pathname = usePathname();
  const user = useStore(state => state.currentUser);
  const initialized = useStore(state => state.isAuthInitialized);
  const cartCount = useCartStore(state => state.cart?.totalCount ?? 0);

  const returnToRoot = () => {
    const previous = view;
    setView("root");
    requestAnimationFrame(() => document.getElementById(`mobile-${previous}`)?.focus());
  };
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    if (view === "company") companyHeading.current?.focus({ preventScroll: true });
  }, [view]);
  useEffect(() => {
    const opener = document.querySelector<HTMLButtonElement>('header button[aria-controls="marketplace-mobile-menu"]');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.showModal();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) toggle(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus();
      else document.querySelector<HTMLElement>("header a[href]")?.focus();
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [toggle]);

  return <dialog ref={dialogRef} id="marketplace-mobile-menu" aria-label={t("menu")}
    className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-clip border-0 bg-transparent p-0 text-foreground backdrop:bg-transparent lg:hidden"
    onCancel={event => { event.preventDefault(); toggle(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')]
        .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0]?.focus(); }
    }}>
    <motion.button tabIndex={-1} type="button" aria-label={t("closeMenu")} onClick={toggle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} className="absolute inset-0 cursor-default bg-foreground/35" />
    <motion.aside initial={{ x: reduceMotion ? 0 : "100%" }} animate={{ x: 0 }} exit={{ x: reduceMotion ? 0 : "100%" }} transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }} className="absolute inset-y-0 right-0 flex h-dvh w-[min(27rem,96vw)] flex-col overflow-clip bg-background shadow-xl">
      <div className="shrink-0 border-b border-border px-5 pb-5 pt-5">
        <div className="mb-5 flex items-center justify-between gap-4"><div onClick={toggle}><Logo width={96} height={48} /></div><button autoFocus type="button" onClick={toggle} aria-label={t("closeMenu")} className={navigationIconButton}><X size={20} aria-hidden="true" /></button></div>
        <MainSearchbar onNavigate={toggle} />
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {view === "categories" ? <MobileCategoryBrowser onBack={returnToRoot} onNavigate={toggle} /> : view === "company" ? <div className="px-5 pb-6 pt-3">
          <div className="sticky top-0 z-10 bg-background pb-2"><button type="button" onClick={returnToRoot} className={`${navigationControl} px-0!`}><ArrowLeft size={17} aria-hidden="true" />{t("mega.back")}</button>
          <h2 ref={companyHeading} tabIndex={-1} className="font-poppins mb-5 mt-3 text-xl font-semibold outline-none">{t("mega.companyCommunity")}</h2></div>
          <div className="relative mb-5 aspect-2/1 overflow-hidden rounded-lg bg-muted"><NavigationImage src="/assets/images/our-impact/TOFA Tribe.jpg" alt={t("mega.communityAlt")} sizes="430px" className="object-cover" /></div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{about("theMission")}</p>
          <nav aria-label={t("about.label")}>{aboutItems.map(item => <Link key={item.href} href={item.href} onClick={toggle} aria-current={pathname === item.href ? "page" : undefined} className={`${navigationItem} min-h-14! px-0! font-semibold!`}>{item.label}<ArrowUpRight size={16} aria-hidden="true" className="text-brand" /></Link>)}</nav>
          <div className="mt-5 border-t border-border pt-5"><WhatsappBtn /></div>
        </div> : <>
          <nav aria-label={t("navigation.browse")} className="px-5 pt-5">
            <p className={`${navigationEyebrow} mb-3`}>{t("mega.browse")}</p>
            <div className="space-y-1">
              <Link href={routes.products} onClick={toggle} aria-current={pathname === routes.products ? "page" : undefined} className={browsingRowClassName}><span>{t("navigation.products")}</span><ChevronRight size={18} aria-hidden="true" /></Link>
              <button id="mobile-categories" type="button" onClick={() => setView("categories")} className={browsingRowClassName}><span>{t("mega.categories")}</span><ChevronRight size={20} aria-hidden="true" /></button>
            </div>
          </nav>
          <div className="px-5 pb-5 pt-1">
            <Link href={routes.cart} onClick={toggle} aria-current={pathname === routes.cart ? "page" : undefined} className={`${navigationItem} mb-4 font-semibold!`}><span>{t("cart")}</span><span className="text-sm tabular-nums text-muted-foreground">{cartCount}</span></Link>
            <p className={`${navigationEyebrow} mb-3`}>{t("account")}</p>
            {!initialized ? <div role="status" aria-label={t("account")} className="grid grid-cols-2 gap-3"><Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" /></div> : <nav aria-label={t("account")} className={user ? "grid grid-cols-2 gap-1" : "grid grid-cols-2 gap-3"}>{(user ? dashboardLinks : authLinks).map(item => item.href ? <Link key={item.label} href={item.href} onClick={toggle} className={user ? navigationItem : item.href === routes.login ? navigationPrimary : navigationSecondary}>{item.label}</Link> : <button key={item.label} type="button" onClick={() => { toggle(); if ("onClick" in item) item.onClick?.(); }} className={`${navigationItem} ${navigationDestructive}`}>{item.label}</button>)}</nav>}
          </div>
          <nav aria-label={t("navigation.selling")} className="border-t border-border px-5 py-2">
            <Link href={routes.becomeSeller} onClick={toggle} className={`${navigationItem} px-0!`}>{t("sellOnTofa")}<ArrowUpRight size={16} aria-hidden="true" /></Link>
            <button id="mobile-company" type="button" onClick={() => setView("company")} className={`${navigationItem} px-0!`}>{t("about.label")}<ChevronRight size={17} aria-hidden="true" /></button>
            <button type="button" disabled title={t("navigation.rfqUnavailable")} className={`${navigationItem} px-0! cursor-not-allowed text-muted-foreground! opacity-60`}>{t("requestQuote")}</button>
          </nav>
          <section aria-label={t("navigation.preferences")} className="bg-muted/35 px-5 pb-3 pt-5">
            <h2 className={`${navigationEyebrow} mb-2`}>{t("navigation.preferences")}</h2>
            <div className="flex min-h-12 items-center justify-between gap-2 text-sm"><span>{t("navigation.language")}</span><LanguagePicker side="top" /></div>
            <div className="flex min-h-12 items-center justify-between gap-2 text-sm"><span>{t("navigation.currency")}</span><MarketplaceCurrencyPicker side="top" /></div>
          </section>
          <div className="bg-muted/35 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 text-muted-foreground"><WhatsappBtn /></div>
        </>}
      </div>
    </motion.aside>
  </dialog>;
}
