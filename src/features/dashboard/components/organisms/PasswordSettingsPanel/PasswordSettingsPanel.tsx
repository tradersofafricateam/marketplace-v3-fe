"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import DashboardTextField from "@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField";
import { useChangePassword } from "@/features/dashboard/hooks/useSettingsData";

const PasswordSettingsPanel = () => {
  const t = useTranslations("Settings.password");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const change = useChangePassword();
  const invalid = newPassword.length < 8 || newPassword !== confirmPassword || !oldPassword;

  const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (invalid) return;
    change.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-background p-5 sm:p-7">
        <h2 className="font-bold text-foreground">{t("title")}</h2>
        <p className="text-body mt-1 text-muted-foreground">{t("description")}</p>

        <div className="mt-6 space-y-4">
          <DashboardTextField
            id="oldPassword"
            type="password"
            autoComplete="current-password"
            label={t("oldPassword")}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <DashboardTextField
            id="newPassword"
            type="password"
            autoComplete="new-password"
            label={t("newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={newPassword.length > 0 && newPassword.length < 8 ? t("minimum") : undefined}
          />
          <DashboardTextField
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            label={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && newPassword !== confirmPassword ? t("mismatch") : undefined}
          />
        </div>

        <button
          disabled={invalid || change.isPending}
          className="mt-6 h-11 rounded-xl bg-(--orange) px-5 text-sm font-bold text-white disabled:opacity-50"
        >
          {change.isPending ? t("saving") : t("save")}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-border bg-muted/40 p-6">
        <h3 className="font-bold text-foreground">{t("tipsTitle")}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("tips")}</p>
      </aside>
    </section>
  );
};

export default PasswordSettingsPanel;
