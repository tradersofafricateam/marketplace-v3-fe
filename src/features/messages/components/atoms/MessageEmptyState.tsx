import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
export type MessageEmptyKind = "inbox" | "selection" | "conversation" | "search" | "unread";

const emptyStateSketches: Record<MessageEmptyKind, string> = {
  inbox: "/assets/images/sketchs/messages-inbox-empty.png",
  selection: "/assets/images/sketchs/messages-no-selection.png",
  conversation: "/assets/images/sketchs/messages-conversation-empty.png",
  search: "/assets/images/sketchs/messages-search-empty.png",
  unread: "/assets/images/sketchs/messages-unread-empty.png",
};

export default function MessageEmptyState({ kind, name = "", children }: { kind: MessageEmptyKind; name?: string; children?: ReactNode }) {
  const t = useTranslations("MessageCenter");
  return <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 py-8 text-center">
    <div className="relative mb-5 h-36 w-full max-w-60">
      <Image src={emptyStateSketches[kind]} fill sizes="240px" alt="" className="object-contain" />
    </div>
    <h2 className="heading-font max-w-sm text-lg font-semibold">{t(`empty.${kind}.title`, { name })}</h2>
    <p className="text-body mt-2 max-w-sm text-muted-foreground">{t(`empty.${kind}.description`)}</p>
    {children && <div className="mt-5">{children}</div>}
  </div>;
}
