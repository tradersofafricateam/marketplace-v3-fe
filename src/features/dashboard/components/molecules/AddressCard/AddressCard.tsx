import Image from "next/image";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { UserAddress } from "@/features/dashboard/types";

const AddressCard = ({
  address,
  disabled,
  onDefault,
  onEdit,
  onDelete,
}: {
  address: UserAddress;
  disabled: boolean;
  onDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const t = useTranslations("Settings.addresses");

  return (
    <article
      className={`relative isolate overflow-hidden rounded-2xl border p-5 transition ${
        address.isDefault
          ? "border-(--orange)/40 bg-(--orange-light)/40"
          : "border-border bg-background hover:border-(--orange)/25"
      }`}
    >
      <Image
        src="/assets/images/delivery-card.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
        className="pointer-events-none -z-20 object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,250,242,0.96)_0%,rgba(255,250,242,0.88)_50%,rgba(255,250,242,0.5)_100%)]"
      />
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-foreground">{address.label}</h3>
        {address.isDefault && (
          <span className="rounded-full bg-(--orange) px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            {t("default")}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold">
        {address.recipientName} · {address.phoneNumber}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {[
          address.addressLine1,
          address.addressLine2,
          address.city,
          address.state,
          address.country,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/8 pt-4">
        {!address.isDefault && (
          <button
            disabled={disabled}
            type="button"
            onClick={onDefault}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-(--orange) hover:bg-(--orange-light)"
          >
            <Check size={14} />
            {t("makeDefault")}
          </button>
        )}
        <button
          disabled={disabled}
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Pencil size={14} />
          {t("edit")}
        </button>
        <button
          disabled={disabled}
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={14} />
          {t("delete")}
        </button>
      </div>
    </article>
  );
};

export default AddressCard;
