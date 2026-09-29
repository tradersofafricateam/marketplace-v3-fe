import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Check, CheckCheck, FileText } from "lucide-react";
import type { Message } from "../../types";
import { safeAttachmentUrl } from "../../helpers";
export default function MessageBubble({ message, own, onReply, onAction }: { message: Message; own: boolean; onReply: () => void; onAction: (action: "edit" | "delete" | "report") => void }) {
  const t = useTranslations("MessageCenter");
  const locale = useLocale();
  const deleted = message.status === "deleted";
  return <article className={`flex ${own ? "justify-end" : "justify-start"}`}>
    <div className="max-w-[90%] sm:max-w-[78%]">
      <div className={`rounded-2xl px-4 py-3 ${own ? "rounded-br-sm bg-(--orange-light)" : "rounded-bl-sm border border-border bg-background"}`}>
        {!deleted && message.replyTo && <blockquote className="mb-2 line-clamp-2 border-l-2 border-(--orange) pl-3 text-sm text-muted-foreground">{message.replyTo.contentPreview}</blockquote>}
        <p className={`text-body whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${deleted ? "italic text-muted-foreground" : ""}`}>{deleted ? t("deleted") : message.content}</p>
        {!deleted && message.attachments.map((attachment) => {
          const url = safeAttachmentUrl(attachment.fileUrl);
          if (!url) return <p key={attachment.id} className="mt-2 text-sm text-muted-foreground">{t("attachmentUnavailable")}</p>;
          const isImage = (attachment.type || attachment.attachmentType) === "image" && /^image\/(jpeg|png|webp)$/.test(attachment.mimeType);
          return <a key={attachment.id} href={url} target="_blank" rel="noopener noreferrer" className="mt-3 block overflow-hidden rounded-xl border border-border bg-background" aria-label={t("openAttachment", { name: attachment.fileName })}>
            {isImage ? <Image src={url} width={320} height={240} unoptimized alt={attachment.fileName} className="max-h-60 w-auto object-contain" /> : <span className="flex items-center gap-3 p-3"><FileText size={22} className="shrink-0 text-(--orange)" /><span className="min-w-0"><span className="block break-all text-sm font-semibold">{attachment.fileName}</span><span className="text-xs text-muted-foreground">{new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(attachment.fileSize / 1024)} KB · {t("open")}</span></span></span>}
          </a>;
        })}
        <div className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
          {message.editedAt && !deleted && <span>{t("edited")}</span>}
          <time dateTime={message.sentAt}>{new Date(message.sentAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</time>
          {own && !deleted && <span aria-label={t(`status.${message.status}`)} title={t(`status.${message.status}`)} className={message.status === "read" ? "text-(--orange)" : ""}>{message.status === "sent" ? <Check size={14} /> : <CheckCheck size={14} />}</span>}
        </div>
      </div>
      {!deleted && <div className={`mt-1 flex flex-wrap gap-1 ${own ? "justify-end" : ""}`}>
        <button type="button" onClick={onReply} className="rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">{t("reply")}</button>
        {own ? <>{(message.messageType === "text" || message.messageType === "mixed") && <button type="button" onClick={() => onAction("edit")} className="rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">{t("edit")}</button>}<button type="button" onClick={() => onAction("delete")} className="rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">{t("delete")}</button></> : <button type="button" onClick={() => onAction("report")} className="rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">{t("report")}</button>}
      </div>}
    </div>
  </article>;
}
