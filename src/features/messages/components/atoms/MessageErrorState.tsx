import { useTranslations } from "next-intl";
export default function MessageErrorState({ retry, text }: { retry: () => void; text?: string }) {
  const t = useTranslations("MessageCenter");
  return <div role="alert" className="m-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center">
    <p className="text-body">{text || t("loadError")}</p>
    <button type="button" onClick={retry} className="mt-4 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold">{t("retry")}</button>
  </div>;
}
