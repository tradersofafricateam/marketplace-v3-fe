"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useTranslations } from "next-intl";
import type { Message, ReportReason } from "../../types";
export default function MessageActionDialog({ action, message, pending, error, onClose, onConfirm }: {
  action: "edit" | "delete" | "report"; message: Message; pending: boolean; error?: string;
  onClose: () => void; onConfirm: (content: string, reason: ReportReason) => void;
}) {
  const t = useTranslations("MessageCenter");
  const [content, setContent] = useState(action === "edit" ? message.content || "" : "");
  const [reason, setReason] = useState<ReportReason>("spam");
  return <Dialog.Root open onOpenChange={(open) => { if (!open && !pending) onClose(); }}><Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" />
    <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-background p-6 shadow-xl outline-none">
      <Dialog.Title className="heading-font text-xl font-semibold">{t(action)}</Dialog.Title>
      <Dialog.Description className="text-body mt-2 text-muted-foreground">{t(`${action}Description`)}</Dialog.Description>
      {action === "report" && <label className="mt-4 block text-sm font-semibold">{t("reason")}<select value={reason} onChange={(event) => setReason(event.target.value as ReportReason)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3">{(["spam", "abusive_content", "fraud_attempt", "payment_scam", "inappropriate_content", "off_platform_solicitation", "other"] as ReportReason[]).map((value) => <option key={value} value={value}>{t(`reasons.${value}`)}</option>)}</select></label>}
      {action !== "delete" && <label className="mt-4 block text-sm font-semibold">{t(action === "edit" ? "message" : "details")}<textarea rows={5} value={content} onChange={(event) => setContent(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-base" /></label>}
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex justify-end gap-3"><Dialog.Close disabled={pending} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">{t("cancel")}</Dialog.Close><button type="button" disabled={pending || (action === "edit" && !content.trim())} onClick={() => onConfirm(content, reason)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 ${action === "delete" ? "bg-destructive" : "bg-(--orange)"}`}>{t(pending ? "saving" : action === "edit" ? "save" : action)}</button></div>
    </Dialog.Popup>
  </Dialog.Portal></Dialog.Root>;
}
