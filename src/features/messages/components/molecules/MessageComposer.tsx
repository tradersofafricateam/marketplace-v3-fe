"use client";
import { useRef, useState } from "react";
import { Send, Smile, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Message } from "../../types";
export default function MessageComposer({ onSend, reply, onCancelReply, disabled }: { onSend: (content: string) => void; reply: Message | null; onCancelReply: () => void; disabled: boolean }) {
  const t = useTranslations("MessageCenter");
  const [text, setText] = useState("");
  const [emojis, setEmojis] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const submit = () => { if (!text.trim() || disabled) return; onSend(text); setText(""); setEmojis(false); };
  return <div className="shrink-0 border-t border-border bg-background p-3 sm:p-4">
    {reply && <div className="mb-3 flex items-start justify-between gap-3 rounded-xl border-l-2 border-(--orange) bg-muted/60 px-3 py-2"><div className="min-w-0"><p className="text-xs font-bold text-(--orange)">{t("replyingTo", { name: reply.sender.displayName })}</p><p className="truncate text-sm text-muted-foreground">{reply.content || t("attachment")}</p></div><button type="button" onClick={onCancelReply} aria-label={t("cancelReply")} className="p-1"><X size={16} /></button></div>}
    {emojis && <div className="mb-2 flex flex-wrap gap-1 rounded-xl border border-border p-2">{["😊", "👍", "🙏", "✅", "👋", "🤝", "📦", "🎉"].map((emoji) => <button key={emoji} type="button" onClick={() => { const start = input.current?.selectionStart ?? text.length; const end = input.current?.selectionEnd ?? start; setText(text.slice(0, start) + emoji + text.slice(end)); input.current?.focus(); }} className="rounded-lg p-2 text-xl hover:bg-muted" aria-label={emoji}>{emoji}</button>)}</div>}
    <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2 focus-within:border-(--orange)/50">
      <button type="button" disabled={disabled} onClick={() => setEmojis(!emojis)} aria-expanded={emojis} aria-label={t("emoji")} className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted disabled:opacity-40"><Smile size={20} /></button>
      <textarea ref={input} value={text} onChange={(event) => setText(event.target.value)} disabled={disabled} rows={2} aria-label={t("compose")} placeholder={t("compose")} className="max-h-40 min-h-12 flex-1 resize-y bg-transparent py-2 text-base outline-none disabled:opacity-50" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} />
      <button type="button" onClick={submit} disabled={disabled || !text.trim()} aria-label={t("send")} className="rounded-xl bg-(--orange) p-3 text-white hover:bg-(--orange-dark) disabled:opacity-40"><Send size={19} /></button>
    </div>
    <p className="mt-2 text-xs text-muted-foreground">{t("composerHint")}</p>
  </div>;
}
