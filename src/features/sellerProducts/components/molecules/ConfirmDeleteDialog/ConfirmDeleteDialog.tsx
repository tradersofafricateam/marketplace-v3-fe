"use client";

import { useRef } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle, Trash2 } from "lucide-react";

const ConfirmDeleteDialog = ({
  open,
  title,
  description,
  pending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !pending) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Popup
          initialFocus={cancelRef}
          aria-busy={pending}
          className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-background p-6 shadow-2xl outline-none sm:p-8"
        >
          <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" size={23} />
          </span>
          <Dialog.Title className="heading-font text-xl font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">{description}</Dialog.Description>
          <div className="mt-7 flex gap-3">
            <Dialog.Close
              ref={cancelRef}
              disabled={pending}
              className="h-11 flex-1 rounded-xl border border-border text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </Dialog.Close>
            <button
              type="button"
              disabled={pending}
              onClick={onConfirm}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-destructive text-sm font-semibold text-white transition hover:bg-destructive/90 disabled:opacity-50"
            >
              {pending && <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDeleteDialog;
