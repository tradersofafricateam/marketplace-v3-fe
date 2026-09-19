"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  UploadCloud,
  X,
} from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { useTranslations } from "next-intl";

import DashboardTextField from "@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField";
import RichTextEditor from "@/components/molecules/RichTextEditor/RichTextEditor";
import { useSellerUpgradeForm } from "@/features/dashboard/hooks/useSellerUpgradeForm";
import { useSellerVerificationStatus } from "@/features/dashboard/hooks/useSellerVerificationStatus";
import { useSellerUpgrade } from "@/features/dashboard/hooks/useSellerUpgrade";

const BecomeSellerModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const t = useTranslations("Dashboard.becomeSellerModal");

  const { canSubmit, status, data } = useSellerVerificationStatus();

  const { submit, isSubmitting } = useSellerUpgrade({
    onSuccess: () => {
      onOpenChange(false);
      reset();
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
  } = useSellerUpgradeForm((values) => {
    if (canSubmit && !isSubmitting) submit(values);
  });

  const logoPreviewRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!values.companyLogo || !logoPreviewRef.current) return;
    const url = URL.createObjectURL(values.companyLogo);
    logoPreviewRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [values.companyLogo, open, canSubmit]);

  const renderField = (
    field:
      | "storeName"
      | "companyName"
      | "registrationNumber"
      | "businessType"
      | "yearsOfBusiness"
      | "companyAddress"
      | "pickupAddress"
      | "country",
  ) => (
    <DashboardTextField
      key={field}
      id={field}
      name={field}
      label={t(field)}
      required={field !== "registrationNumber"}
      type={field === "yearsOfBusiness" ? "number" : "text"}
      min={field === "yearsOfBusiness" ? 0 : undefined}
      step={field === "yearsOfBusiness" ? "any" : undefined}
      value={values[field]}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSubmitting}
      error={touched[field] ? errors[field] : undefined}
    />
  );

  return (
    <Dialog.Root open={open && canSubmit} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl outline-none">
          <header className="relative shrink-0 overflow-hidden border-b border-border bg-(--brown) px-6 py-6 text-white sm:px-9 sm:py-7">
            <Image
              src="/assets/images/become-form-header.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="pointer-events-none object-cover object-right"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(25,15,8,0.88)_0%,rgba(25,15,8,0.7)_45%,rgba(25,15,8,0.15)_100%)]"
            />
            <div className="relative pr-9">
              <Dialog.Title className="heading-font text-2xl font-bold sm:text-3xl">
                {t("title")}
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-lg text-sm leading-6 text-white/85">
                {t("description")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t("cancel")}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-black/25 text-white/90 transition hover:bg-black/40 hover:text-white focus-visible:outline-2 sm:right-6"
            >
              <X size={20} />
            </Dialog.Close>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="min-h-0 overflow-y-auto p-6 sm:p-9">
              {status === "rejected" && data?.rejectionReason && (
                <p className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                  {data.rejectionReason}
                </p>
              )}
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-9">
                <div className="space-y-8">
                  <fieldset className="min-w-0">
                    <legend className="mb-5 flex items-center gap-2.5 text-base font-bold">
                      <Building2 size={19} className="text-(--orange)" />
                      {t("businessDetails")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(
                        [
                          "storeName",
                          "companyName",
                          "businessType",
                          "yearsOfBusiness",
                          "registrationNumber",
                          "country",
                        ] as const
                      ).map(renderField)}
                    </div>
                  </fieldset>
                  <fieldset className="min-w-0 border-t border-border pt-6">
                    <legend className="flex items-center gap-2.5 pr-3 text-base font-bold">
                      <MapPin size={19} className="text-(--orange)" />
                      {t("businessLocation")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {renderField("companyAddress")}
                      {renderField("pickupAddress")}
                    </div>
                  </fieldset>
                  <RichTextEditor
                    label={t("companyBio")}
                    value={values.companyBio}
                    onChange={(html) => setFieldValue("companyBio", html)}
                    placeholder={t("bioPlaceholder")}
                    disabled={isSubmitting}
                    error={touched.companyBio ? errors.companyBio : undefined}
                  />
                </div>

                <aside className="rounded-2xl border border-border bg-muted/30 p-5 lg:self-start">
                  <h3 className="text-base font-bold">{t("brandIdentity")}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t("logoHint")}
                  </p>
                  <label className="group relative mt-5 flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-(--orange)/30 bg-background px-4 py-6 text-center transition hover:border-(--orange) hover:bg-(--orange)/5 focus-within:border-(--orange)">
                    <input
                      id="companyLogo"
                      name="companyLogo"
                      aria-label={t("companyLogo")}
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-wait"
                    />
                    {values.companyLogo ? (
                      // A local object URL previews the file before it is uploaded.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        ref={logoPreviewRef}
                        alt={t("companyLogo")}
                        className="size-24 rounded-2xl border border-border bg-white object-contain p-2 shadow-sm"
                      />
                    ) : (
                      <span className="flex size-20 items-center justify-center rounded-2xl bg-(--orange)/10 text-(--orange) transition group-hover:scale-105">
                        <UploadCloud size={32} strokeWidth={1.5} />
                      </span>
                    )}
                    <span className="text-sm font-semibold text-(--orange)">
                      {t(values.companyLogo ? "changeLogo" : "chooseLogo")}
                    </span>
                    <span className="max-w-full break-all text-xs leading-5 text-muted-foreground">
                      {values.companyLogo?.name || t("companyLogo")}
                    </span>
                  </label>
                </aside>
              </div>
            </div>
            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-6 py-4 sm:px-9">
              <Dialog.Close className="h-11 rounded-xl border border-border px-6 text-sm font-semibold transition hover:bg-muted">
                {t("cancel")}
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-(--orange) px-6 text-sm font-semibold text-white transition hover:bg-(--orange-dark) disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? t("submitting") : t("submit")}
                <ArrowUpRight size={18} />
              </button>
            </footer>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BecomeSellerModal;
