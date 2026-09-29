"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useTranslations } from "next-intl";

import UpdateProfileModal from "@/features/dashboard/components/organisms/UpdateProfileModal/UpdateProfileModal";
import DashboardTextareaField from "@/features/dashboard/components/atoms/DashboardTextareaField/DashboardTextareaField";
import { useDeactivateAccount } from "@/features/dashboard/hooks/useSettingsData";
import type { AuthUser } from "@/features/auth/types";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-3.5">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
  </div>
);

const ProfileSettingsPanel = ({ user }: { user: AuthUser }) => {
  const t = useTranslations("Settings.profile");
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [reason, setReason] = useState("");
  const deactivate = useDeactivateAccount();
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || t("unnamed");

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <p className="text-sm capitalize text-muted-foreground">{user.userType ?? "buyer"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="h-10 w-fit shrink-0 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-(--orange) hover:text-(--orange)"
          >
            {t("edit")}
          </button>
        </div>

        <div className="mt-4 divide-y divide-border sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
          <InfoRow label={t("email")} value={user.email} />
          <InfoRow label={t("phone")} value={user.phoneNumber || t("notSet")} />
          <div className="sm:col-span-2">
            <InfoRow label={t("bio")} value={user.companyBio || t("notSet")} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-foreground">{t("dangerTitle")}</h3>
          <p className="text-body mt-1 text-muted-foreground">{t("dangerDescription")}</p>
        </div>
        <button
          type="button"
          onClick={() => setDeactivateOpen(true)}
          className="h-10 shrink-0 rounded-xl border border-destructive px-4 text-sm font-bold text-destructive hover:bg-destructive hover:text-white"
        >
          {t("deactivate")}
        </button>
      </div>

      <UpdateProfileModal user={user} open={editOpen} onOpenChange={setEditOpen} />

      <Dialog.Root open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-2xl outline-none">
            <Dialog.Title className="text-lg font-bold">{t("confirmTitle")}</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              {t("confirmDescription")}
            </Dialog.Description>
            <div className="mt-5">
              <DashboardTextareaField
                id="deactivationReason"
                label={t("reason")}
                placeholder={t("reasonPlaceholder")}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close className="h-10 rounded-xl border px-4 text-sm font-bold">
                {t("cancel")}
              </Dialog.Close>
              <button
                type="button"
                disabled={!reason.trim() || deactivate.isPending}
                onClick={() => deactivate.mutate({ status: "delete", reason: reason.trim() })}
                className="h-10 rounded-xl bg-destructive px-4 text-sm font-bold text-white disabled:opacity-50"
              >
                {deactivate.isPending ? t("deactivating") : t("confirm")}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};

export default ProfileSettingsPanel;
