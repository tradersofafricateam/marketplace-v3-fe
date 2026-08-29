"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import MailSentSketch from "@/features/auth/components/atoms/MailSentSketch/MailSentSketch";

const AuthSuccessPanel = ({
  email,
  onResend,
  onChangeEmail,
  resending,
}: {
  email: string;
  onResend: () => void;
  onChangeEmail: () => void;
  resending: boolean;
}) => {
  const t = useTranslations("Auth.signUp.success");

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="relative flex size-36 items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="absolute size-24 rounded-full bg-(--orange-light)"
        />
        <MailSentSketch className="relative size-32 text-(--orange)" />
      </motion.div>

      <div className="flex flex-col gap-1.5">
        <h2 className="heading-font text-xl font-bold text-foreground">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("description")}{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex w-full flex-col gap-2.5 pt-2">
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="h-12 w-full rounded-xl bg-(--orange) text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-(--orange-dark) disabled:pointer-events-none disabled:opacity-60"
        >
          {resending ? t("resending") : t("resend")}
        </button>
        <button
          type="button"
          onClick={onChangeEmail}
          className="h-12 w-full rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t("changeEmail")}
        </button>
      </div>
    </div>
  );
};

export default AuthSuccessPanel;
