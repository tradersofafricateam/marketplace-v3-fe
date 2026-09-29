import { useTranslations } from "next-intl";
export default function MessageLoading({ list = false }: { list?: boolean }) {
  const t = useTranslations("MessageCenter");
  return <div role="status" aria-label={t("loading")} className="space-y-5 p-5">
    {[0, 1, 2, 3].map((item) => <div key={item} className={`flex gap-3 motion-safe:animate-pulse ${!list && item % 2 ? "flex-row-reverse" : ""}`}>
      {list && <div className="size-11 rounded-2xl bg-muted" />}
      <div className={list ? "flex-1 space-y-2" : "w-2/3 space-y-2"}><div className="h-4 w-2/3 rounded bg-muted" /><div className="h-8 rounded-xl bg-muted" /></div>
    </div>)}
  </div>;
}
