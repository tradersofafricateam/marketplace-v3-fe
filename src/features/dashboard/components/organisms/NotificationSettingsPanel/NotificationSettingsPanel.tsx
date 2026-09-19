"use client";

import { useTranslations } from "next-intl";

import PreferenceSwitch from "@/features/dashboard/components/atoms/PreferenceSwitch/PreferenceSwitch";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/features/dashboard/hooks/useSettingsData";

const NotificationSettingsPanel = () => {
  const t = useTranslations("Settings.notifications");
  const query = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  const change = (
    category: string,
    channel: "emailEnabled" | "inAppEnabled",
    enabled: boolean,
  ) => {
    const preferences = (query.data ?? []).map((item) => ({
      category: item.category,
      emailEnabled:
        item.category === category
          ? channel === "emailEnabled"
            ? enabled
            : item.emailEnabled
          : item.emailEnabled,
      inAppEnabled:
        item.category === category
          ? channel === "inAppEnabled"
            ? enabled
            : item.inAppEnabled
          : item.inAppEnabled,
    }));
    update.mutate({ preferences });
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <p className="text-body text-muted-foreground">{t("description")}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-2 border-b bg-muted/40 px-4 py-3 text-center text-[11px] font-bold tracking-wide text-muted-foreground uppercase sm:px-6">
          <span className="text-left">{t("category")}</span>
          <span>{t("inApp")}</span>
          <span>{t("email")}</span>
        </div>

        {query.isLoadingCurrentData ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : query.isError ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {t("error")}
          </p>
        ) : (
          query.data?.map((preference) => (
            <div
              key={preference.category}
              className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] items-center gap-2 border-b border-border/70 px-4 py-4 last:border-0 sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold capitalize">
                    {preference.category.replaceAll("_", " ")}
                  </p>
                  {preference.isMandatory && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {t("required")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <PreferenceSwitch
                  label={t("inAppCategory", { category: preference.category })}
                  checked={preference.inAppEnabled}
                  disabled={preference.isMandatory || update.isPending}
                  onChange={(checked) => change(preference.category, "inAppEnabled", checked)}
                />
              </div>
              <div className="flex justify-center">
                <PreferenceSwitch
                  label={t("emailCategory", { category: preference.category })}
                  checked={preference.emailEnabled}
                  disabled={preference.isMandatory || update.isPending}
                  onChange={(checked) => change(preference.category, "emailEnabled", checked)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-body rounded-xl bg-muted/40 p-4 text-muted-foreground">{t("mandatoryNote")}</p>
    </section>
  );
};

export default NotificationSettingsPanel;
