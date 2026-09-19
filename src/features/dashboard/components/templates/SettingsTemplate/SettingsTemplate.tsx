"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import DashboardSelectField from "@/features/dashboard/components/atoms/DashboardSelectField/DashboardSelectField";
import SettingsTabButton from "@/features/dashboard/components/atoms/SettingsTabButton/SettingsTabButton";
import AddressSettingsPanel from "@/features/dashboard/components/organisms/AddressSettingsPanel/AddressSettingsPanel";
import NotificationSettingsPanel from "@/features/dashboard/components/organisms/NotificationSettingsPanel/NotificationSettingsPanel";
import PasswordSettingsPanel from "@/features/dashboard/components/organisms/PasswordSettingsPanel/PasswordSettingsPanel";
import ProfileSettingsPanel from "@/features/dashboard/components/organisms/ProfileSettingsPanel/ProfileSettingsPanel";
import type { AuthUser } from "@/features/auth/types";

type SettingsTab = "profile" | "addresses" | "password" | "notifications";

const SettingsTemplate = ({ user }: { user: AuthUser }) => {
  const t = useTranslations("Settings");
  const [tab, setTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: t("tabs.profile") },
    { id: "addresses" as const, label: t("tabs.addresses") },
    { id: "password" as const, label: t("tabs.password") },
    { id: "notifications" as const, label: t("tabs.notifications") },
  ];

  return (
    <div className="space-y-7">
      <header>
        <h1 className="heading-font text-2xl font-bold sm:text-3xl">{t("title")}</h1>
        <p className="text-body mt-2 max-w-2xl text-muted-foreground">{t("description")}</p>
      </header>

      <div className="md:hidden">
        <DashboardSelectField
          id="settings-section"
          label={t("title")}
          value={tab}
          options={tabs.map((item) => ({ value: item.id, label: item.label }))}
          onChange={(event) => {
            const selected = tabs.find((item) => item.id === event.target.value);
            if (selected) setTab(selected.id);
          }}
          aria-controls="settings-panel"
        />
      </div>

      <div role="tablist" aria-label={t("title")} className="hidden gap-6 overflow-x-auto border-b border-border md:flex">
        {tabs.map((item) => (
          <SettingsTabButton
            key={item.id}
            label={item.label}
            active={tab === item.id}
            onClick={() => setTab(item.id)}
          />
        ))}
      </div>

      <div id="settings-panel" role="tabpanel" aria-label={tabs.find((item) => item.id === tab)?.label}>
        {tab === "profile" && <ProfileSettingsPanel user={user} />}
        {tab === "addresses" && <AddressSettingsPanel />}
        {tab === "password" && <PasswordSettingsPanel />}
        {tab === "notifications" && <NotificationSettingsPanel />}
      </div>
    </div>
  );
};

export default SettingsTemplate;
