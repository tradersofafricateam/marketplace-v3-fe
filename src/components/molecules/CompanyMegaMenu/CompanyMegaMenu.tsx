"use client";

import { navigationEyebrow, navigationTitle } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAboutUs } from "@/lib/hooks/useAboutUs";
import WhatsappBtn from "@/components/atoms/WhatsappBtn/WhatsappBtn";
import NavigationImage from "../NavigationImage/NavigationImage";

export default function CompanyMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const about = useTranslations("aboutUs");
  const work = useTranslations("whatWeDo");
  const impact = useTranslations("impactContent");
  const { aboutItems } = useAboutUs();
  const descriptions = [about("ourMission"), work("providingVisibility"), impact("capacityTitle")];
  return <div className="grid items-stretch gap-10 lg:grid-cols-[.9fr_1.2fr_1fr]">
    <div className="flex flex-col justify-between gap-6 border-r border-border pr-8">
      <div><p className={navigationEyebrow}>{t("about.label")}</p><h2 className={navigationTitle}>Traders of Africa</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{about("theMission")}</p></div>
      <WhatsappBtn />
    </div>
    <nav aria-label={t("about.label")} className="flex flex-col justify-center gap-2">
      {aboutItems.map((item, index) => <Link data-mega-entry key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate} className={`flex items-center justify-between gap-5 rounded-md px-4 py-3.5 transition-colors duration-150 ease-[ease] hover:bg-brand-subtle hover:text-brand-hover hover:active:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 active:bg-muted aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand-hover motion-reduce:transition-none [&>div]:min-w-0 [&>div]:wrap-anywhere group`}>
        <div><span className="inline-flex items-center gap-3 text-lg font-semibold">{item.label}<ArrowUpRight size={17} aria-hidden="true" className="shrink-0 text-brand" /></span><p className="mt-1 max-w-64 text-sm leading-snug text-muted-foreground">{descriptions[index]}</p></div>
      </Link>)}
    </nav>
    <div className="relative min-h-60 overflow-hidden rounded-lg bg-muted">
      <NavigationImage src="/assets/images/our-impact/TOFA Tribe.jpg" alt={t("mega.communityAlt")} sizes="(min-width: 1440px) 360px, 30vw" className="object-cover" />
    </div>
  </div>;
}
