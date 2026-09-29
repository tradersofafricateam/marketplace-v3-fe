import Image from "next/image";
import { safeAttachmentUrl } from "../../helpers";
import type { Participant } from "../../types";

export default function MessageAvatar({ participant }: { participant: Participant }) {
  const url = safeAttachmentUrl(participant.profileImage);
  return <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-(--orange-light) text-sm font-bold text-(--orange-dark)">
    {url ? <Image src={url} alt="" fill sizes="44px" unoptimized className="object-cover" /> : participant.displayName.split(/\s+/).slice(0, 2).map((name) => name[0]).join("")}
  </span>;
}
