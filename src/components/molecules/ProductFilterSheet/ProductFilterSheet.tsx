"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function ProductFilterSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = useTranslations("ProductCatalogue");
  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    dialog?.querySelector<HTMLButtonElement>("[data-filter-close]")?.focus();
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus();
      else document.querySelector<HTMLElement>("header a[href]")?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      id="product-filter-sheet"
      aria-modal="true"
      aria-labelledby="product-filters-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-clip border-0 bg-transparent p-0 text-foreground backdrop:bg-transparent"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const controls = [
          ...e.currentTarget.querySelectorAll<HTMLElement>(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]",
          ),
        ].filter(
          (node) => node.tabIndex >= 0 && node.getClientRects().length > 0,
        );
        if (e.shiftKey && document.activeElement === controls[0]) {
          e.preventDefault();
          controls.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === controls.at(-1)) {
          e.preventDefault();
          controls[0]?.focus();
        }
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("filters.close")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/35"
      />
      <div className="absolute inset-y-0 right-0 h-dvh w-[min(28rem,100vw)] bg-background px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-overlay animate-in slide-in-from-right-4 duration-200 motion-reduce:animate-none">
        {children}
      </div>
    </dialog>
  );
}
