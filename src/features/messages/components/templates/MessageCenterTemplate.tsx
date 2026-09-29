"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStore } from "@/store/authStore";
import { useStartConversation } from "../../hooks/useStartConversation";
import { useMessageReconnect } from "../../hooks/useMessageReconnect";
import { messageError } from "../../helpers";
import type { Conversation, PendingMessage } from "../../types";
import ConversationList from "../organisms/ConversationList";
import ConversationPanel from "../organisms/ConversationPanel";
import MessageEmptyState from "../atoms/MessageEmptyState";
import MessageErrorState from "../atoms/MessageErrorState";
import MessageLoading from "../atoms/MessageLoading";

export default function MessageCenterTemplate() {
  const userId = useStore((state) => state.currentUser?.id);
  return userId ? <MessageCenterSession key={userId} /> : <MessageLoading />;
}
function MessageCenterSession() {
  const t = useTranslations("MessageCenter");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const recipient = params.get("recipientUserId");
  const userId = useStore((state) => state.currentUser?.id);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [outbox, setOutbox] = useState<Record<string, PendingMessage | undefined>>({});
  const requested = useRef<string | null>(null);
  const { mutate: start, reset, isPending, isError, error } = useStartConversation();
  useMessageReconnect();
  useEffect(() => {
    if (!recipient || !userId || recipient === userId || requested.current === recipient) return;
    requested.current = recipient;
    start(recipient, { onSuccess: (conversation) => { if (requested.current === recipient) setSelected(conversation); } });
  }, [recipient, userId, start]);
  const select = (conversation: Conversation) => {
    reset();
    setSelected(conversation);
    requested.current = conversation.participant.id;
    router.replace(`${pathname}?${new URLSearchParams({ recipientUserId: conversation.participant.id })}`, { scroll: false });
  };
  const showConversation = !!selected || !!recipient;
  const waitingForRecipient = !!recipient && recipient !== userId && selected?.participant.id !== recipient;
  const back = () => { reset(); requested.current = null; setSelected(null); router.replace(pathname, { scroll: false }); };
  return <div className="space-y-5">
    <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--orange)">{t("eyebrow")}</p><h1 className="heading-font mt-2 text-2xl font-bold">{t("title")}</h1><p className="text-body mt-2 text-muted-foreground">{t("subtitle")}</p></div>
    <div className="grid h-[calc(100dvh-13rem)] min-h-[32rem] max-h-[56rem] overflow-hidden rounded-3xl border border-border bg-background shadow-sm md:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.7fr)]">
      <div className={`min-h-0 ${showConversation ? "hidden md:block" : ""}`}><ConversationList selectedId={selected?.conversationId} onSelect={select} /></div>
      <div className={`min-h-0 min-w-0 ${showConversation ? "" : "hidden md:block"}`}>
        {(isPending || isError || waitingForRecipient || recipient === userId) && <button type="button" onClick={back} className="m-3 rounded-xl border border-border px-3 py-2 text-sm md:hidden">{t("back")}</button>}
        {isPending ? <MessageLoading /> : isError ? <MessageErrorState text={messageError(error, t("startError"))} retry={() => recipient && start(recipient, { onSuccess: setSelected })} /> : recipient === userId ? <p role="alert" className="p-6">{t("selfMessage")}</p> : waitingForRecipient ? <MessageLoading /> : selected ? <ConversationPanel key={selected.conversationId} conversation={selected} pendingMessage={outbox[selected.conversationId]} setPendingMessage={(pending) => setOutbox((current) => ({ ...current, [selected.conversationId]: pending }))} onBack={back} /> : <MessageEmptyState kind="selection" />}
      </div>
    </div>
  </div>;
}
