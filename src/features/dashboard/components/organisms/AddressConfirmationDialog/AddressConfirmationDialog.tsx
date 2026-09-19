"use client";

import { useRef } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserAddress } from "@/features/dashboard/types";

const AddressConfirmationDialog = ({ address, pending, onClose, onConfirm, action }: {
  action: "delete" | "activate";
  address?: UserAddress;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const t = useTranslations("Settings.addresses");
  const deleting = action === "delete";
  const Icon = deleting ? Trash2 : MapPin;
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root open={!!address} onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Popup initialFocus={cancelRef} aria-busy={pending} className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-background p-6 shadow-2xl outline-none sm:p-8">
          <span className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${deleting ? "bg-destructive/10 text-destructive" : "bg-(--orange-light) text-(--orange)"}`}><Icon aria-hidden="true" size={23} /></span>
          <Dialog.Title className="heading-font text-xl font-bold">{t(deleting ? "deleteConfirm" : "makeDefault")}</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">
            {address && [address.label, address.recipientName, address.addressLine1, address.city, address.country].filter(Boolean).join(" · ")}
          </Dialog.Description>
          <div className="mt-7 flex gap-3">
            <Dialog.Close ref={cancelRef} disabled={pending} className="h-11 flex-1 rounded-xl border border-border text-sm font-semibold transition hover:bg-muted disabled:opacity-50">{t("form.cancel")}</Dialog.Close>
            <button type="button" disabled={pending} onClick={onConfirm} className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 ${deleting ? "bg-destructive hover:bg-destructive/90" : "bg-(--orange) hover:bg-(--orange-dark)"}`}>
              {pending && <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />}
              {t(deleting ? "delete" : "makeDefault")}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddressConfirmationDialog;
