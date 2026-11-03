"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartActions } from "../../../hooks/useCartActions";
import { purchasePrimary, purchaseSecondary, purchaseText } from "@/lib/constants/purchaseStyles";

export default function ClearCartDialog({ disabled }: { disabled: boolean }) {
  const t = useTranslations("CartPage");
  const [open, setOpen] = useState(false);
  const action = useCartActions();
  return <Dialog.Root open={open} onOpenChange={(next) => { if (!action.isPending) setOpen(next); }}>
    <Dialog.Trigger disabled={disabled} className={`${purchaseText} text-muted-foreground! hover:text-foreground!`}>{t("clear")}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30" />
      <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-overlay outline-none">
        <Dialog.Title className="heading-font text-xl font-medium">{t("clearConfirm")}</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">{t("clearDescription")}</Dialog.Description>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Dialog.Close disabled={action.isPending} className={purchaseSecondary}>{t("cancel")}</Dialog.Close>
          <button type="button" disabled={action.isPending} aria-busy={action.isPending} onClick={() => action.mutate({ type: "clear" }, { onSuccess: () => setOpen(false) })} className={purchasePrimary}>{action.isPending && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />}{t(action.isPending ? "clearing" : "clear")}</button>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
