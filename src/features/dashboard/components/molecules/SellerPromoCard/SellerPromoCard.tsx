"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const SellerPromoCard = ({ onOpen, rejected = false, rejectionReason }: { onOpen: () => void; rejected?: boolean; rejectionReason?: string | null }) => {
  const t = useTranslations("Dashboard.sellerPromo");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-(--brown) p-5">
      <Image
        src="/assets/images/become-form-header.png"
        alt=""
        fill
        sizes="256px"
        className="pointer-events-none object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,10,6,0.88),rgba(15,10,6,0.78))]"
      />
      <p className="relative text-sm font-bold text-white">{t(rejected ? "rejectedTitle" : "title")}</p>
      <p className="text-body relative mt-1.5 text-white/85">
        {rejected ? rejectionReason || t("rejectedDescription") : t("description")}
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="relative mt-4 w-full rounded-xl bg-(--orange) py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-(--orange-dark)"
      >
        {t(rejected ? "resubmit" : "cta")}
      </button>
    </div>
  );
};

export default SellerPromoCard;
