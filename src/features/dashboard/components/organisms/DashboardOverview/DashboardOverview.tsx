"use client";

import { useTranslations } from "next-intl";

import DashboardStatCard from "@/features/dashboard/components/atoms/DashboardStatCard/DashboardStatCard";
import { useStore } from "@/store/authStore";

const DashboardOverview = () => {
  const t = useTranslations("Dashboard.overview");
  const currentUser = useStore((state) => state.currentUser);
  const firstName =
    currentUser?.firstName ||
    currentUser?.email.split("@")[0] ||
    t("fallbackName");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="heading-font text-2xl font-bold text-foreground">
          {t("greeting", { name: firstName })}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardStatCard
          label={t("stats.orders")}
          value="0"
          hint={t("stats.ordersHint")}
        />
        <DashboardStatCard
          label={t("stats.rfqs")}
          value="0"
          hint={t("stats.rfqsHint")}
        />
        <DashboardStatCard
          label={t("stats.points")}
          value={String(currentUser?.totalPoints ?? 0)}
          hint={t("stats.pointsHint")}
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-8 text-center">
        <p className="text-sm font-semibold text-foreground">
          {t("recentOrders.title")}
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-muted-foreground">
          {t("recentOrders.empty")}
        </p>
      </div>
    </div>
  );
};

export default DashboardOverview;
