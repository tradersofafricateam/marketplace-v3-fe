import type { Metadata } from "next";

import SettingsDashboardShell from "@/features/dashboard/components/templates/SettingsDashboardShell/SettingsDashboardShell";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description:
    "Manage your TOFA profile, addresses, security and notifications.",
};

export default function SettingsPage() {
  return <SettingsDashboardShell />;
}
