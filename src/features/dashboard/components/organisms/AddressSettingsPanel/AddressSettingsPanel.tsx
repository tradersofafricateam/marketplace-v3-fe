"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import AddressConfirmationDialog from "@/features/dashboard/components/organisms/AddressConfirmationDialog/AddressConfirmationDialog";
import AddressCard from "@/features/dashboard/components/molecules/AddressCard/AddressCard";
import AddressFormModal from "@/features/dashboard/components/organisms/AddressFormModal/AddressFormModal";
import { useAddresses, useAddressMutations } from "@/features/dashboard/hooks/useSettingsData";
import type { UserAddress, UserAddressPayload } from "@/features/dashboard/types";

const AddressSettingsPanel = () => {
  const t = useTranslations("Settings.addresses");
  const query = useAddresses();
  const mutations = useAddressMutations();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{ address: UserAddress; action: "delete" | "activate" }>();
  const [editing, setEditing] = useState<UserAddress>();

  const launch = (address?: UserAddress) => {
    setEditing(address);
    setOpen(true);
  };

  const save = async (payload: UserAddressPayload) => {
    if (editing) await mutations.updateAddress(editing.id, payload);
    else await mutations.createAddress(payload);
    setOpen(false);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
          <p className="text-body text-muted-foreground">{t("description")}</p>
        </div>
        <button
          type="button"
          onClick={() => launch()}
          className="h-10 w-fit shrink-0 rounded-xl bg-(--orange) px-4 text-sm font-bold text-white"
        >
          {t("add")}
        </button>
      </div>

      {query.isLoadingCurrentData ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : query.isError ? (
        <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          {t("error")}
        </p>
      ) : query.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {query.data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              disabled={mutations.isPending}
              onDefault={() => setConfirmation({ address, action: "activate" })}
              onEdit={() => launch(address)}
              onDelete={() => setConfirmation({ address, action: "delete" })}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
          <h3 className="font-bold text-foreground">{t("emptyTitle")}</h3>
          <p className="text-body mt-1 text-muted-foreground">{t("emptyDescription")}</p>
        </div>
      )}

      <AddressConfirmationDialog
        address={confirmation?.address}
        action={confirmation?.action ?? "delete"}
        pending={mutations.isPending}
        onClose={() => setConfirmation(undefined)}
        onConfirm={() => {
          if (!confirmation || mutations.isPending) return;
          const close = () => setConfirmation(undefined);
          if (confirmation.action === "activate") {
            mutations.setActiveAddress(confirmation.address.id, close);
          } else {
            mutations.deleteAddress(confirmation.address.id, { onSuccess: close });
          }
        }}
      />
      <AddressFormModal
        open={open}
        address={editing}
        pending={mutations.isPending}
        onOpenChange={setOpen}
        onSave={save}
      />
    </section>
  );
};

export default AddressSettingsPanel;
