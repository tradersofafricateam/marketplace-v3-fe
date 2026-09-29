"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useTranslations } from "next-intl";

import DashboardTextField from "@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField";
import PreferenceSwitch from "@/features/dashboard/components/atoms/PreferenceSwitch/PreferenceSwitch";
import type { UserAddress, UserAddressPayload } from "@/features/dashboard/types";

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const initialValues = (address?: UserAddress): UserAddressPayload => ({
  label: address?.label ?? "",
  recipientName: address?.recipientName ?? "",
  phoneNumber: address?.phoneNumber ?? "",
  addressLine1: address?.addressLine1 ?? "",
  addressLine2: address?.addressLine2 ?? null,
  city: address?.city ?? "",
  state: address?.state ?? "",
  country: address?.country ?? "",
  postalCode: address?.postalCode ?? null,
  isDefault: address?.isDefault ?? false,
});

type FieldName =
  | "label"
  | "recipientName"
  | "phoneNumber"
  | "addressLine1"
  | "city"
  | "state"
  | "country";

const AddressForm = ({
  address,
  pending,
  onCancel,
  onSave,
}: {
  address?: UserAddress;
  pending: boolean;
  onCancel: () => void;
  onSave: (payload: UserAddressPayload) => Promise<unknown>;
}) => {
  const t = useTranslations("Settings.addresses.form");
  const [values, setValues] = useState(() => initialValues(address));
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  const change = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const blur = (event: React.FocusEvent<HTMLInputElement>) =>
    setTouched((current) => ({ ...current, [event.target.name]: true }));

  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.label.trim()) errors.label = t("required");
  if (!values.recipientName.trim()) errors.recipientName = t("required");
  if (!PHONE_REGEX.test(values.phoneNumber.replace(/\s/g, ""))) errors.phoneNumber = t("invalidPhone");
  if (!values.addressLine1.trim()) errors.addressLine1 = t("required");
  if (!values.city.trim()) errors.city = t("required");
  if (!values.state.trim()) errors.state = t("required");
  if (!values.country.trim()) errors.country = t("required");

  const valid = Object.keys(errors).length === 0;

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({
      label: true,
      recipientName: true,
      phoneNumber: true,
      addressLine1: true,
      city: true,
      state: true,
      country: true,
    });
    if (!valid) return;
    await onSave({
      ...values,
      phoneNumber: values.phoneNumber.replace(/\s/g, ""),
      addressLine2: values.addressLine2?.trim() || null,
      postalCode: values.postalCode?.trim() || null,
    });
  };

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
      <DashboardTextField
        name="label"
        label={t("label")}
        placeholder={t("labelPlaceholder")}
        value={values.label}
        onChange={change}
        onBlur={blur}
        error={touched.label ? errors.label : undefined}
      />
      <DashboardTextField
        name="recipientName"
        label={t("recipient")}
        value={values.recipientName}
        onChange={change}
        onBlur={blur}
        error={touched.recipientName ? errors.recipientName : undefined}
      />
      <DashboardTextField
        name="phoneNumber"
        type="tel"
        label={t("phone")}
        placeholder={t("phonePlaceholder")}
        value={values.phoneNumber}
        onChange={change}
        onBlur={blur}
        error={touched.phoneNumber ? errors.phoneNumber : undefined}
      />
      <DashboardTextField
        name="country"
        label={t("country")}
        value={values.country}
        onChange={change}
        onBlur={blur}
        error={touched.country ? errors.country : undefined}
      />
      <div className="sm:col-span-2">
        <DashboardTextField
          name="addressLine1"
          label={t("line1")}
          value={values.addressLine1}
          onChange={change}
          onBlur={blur}
          error={touched.addressLine1 ? errors.addressLine1 : undefined}
        />
      </div>
      <div className="sm:col-span-2">
        <DashboardTextField
          name="addressLine2"
          label={t("line2")}
          value={values.addressLine2 ?? ""}
          onChange={change}
        />
      </div>
      <DashboardTextField
        name="city"
        label={t("city")}
        value={values.city}
        onChange={change}
        onBlur={blur}
        error={touched.city ? errors.city : undefined}
      />
      <DashboardTextField
        name="state"
        label={t("state")}
        value={values.state}
        onChange={change}
        onBlur={blur}
        error={touched.state ? errors.state : undefined}
      />
      <DashboardTextField
        name="postalCode"
        label={t("postalCode")}
        value={values.postalCode ?? ""}
        onChange={change}
      />
      <div className="flex items-center gap-2.5 self-end pb-3">
        <PreferenceSwitch
          label={t("default")}
          checked={values.isDefault}
          onChange={(checked) => setValues((current) => ({ ...current, isDefault: checked }))}
        />
        <span className="text-sm font-semibold">{t("default")}</span>
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onCancel} className="h-10 rounded-xl border px-4 text-sm font-bold">
          {t("cancel")}
        </button>
        <button
          disabled={pending}
          className="h-10 rounded-xl bg-(--orange) px-5 text-sm font-bold text-white disabled:opacity-50"
        >
          {pending ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
};

const AddressFormModal = ({
  open,
  address,
  pending,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  address?: UserAddress;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: UserAddressPayload) => Promise<unknown>;
}) => {
  const t = useTranslations("Settings.addresses");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl outline-none">
          <Dialog.Title className="text-lg font-bold">
            {address ? t("editTitle") : t("addTitle")}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            {t("formDescription")}
          </Dialog.Description>
          <AddressForm
            key={address?.id ?? "new"}
            address={address}
            pending={pending}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddressFormModal;
