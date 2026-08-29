"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

import AuthFormField from "@/features/auth/components/molecules/AuthFormField/AuthFormField";
import PasswordField from "@/features/auth/components/molecules/PasswordField/PasswordField";
import PasswordStrengthChecklist from "@/features/auth/components/molecules/PasswordStrengthChecklist/PasswordStrengthChecklist";
import TermsCheckboxField from "@/features/auth/components/molecules/TermsCheckboxField/TermsCheckboxField";
import ReferralCodeField from "@/features/auth/components/molecules/ReferralCodeField/ReferralCodeField";
import AuthSubmitButton from "@/features/auth/components/atoms/AuthSubmitButton/AuthSubmitButton";
import AuthDivider from "@/features/auth/components/molecules/AuthDivider/AuthDivider";
import GoogleAuthButton from "@/features/auth/components/molecules/GoogleAuthButton/GoogleAuthButton";
import AuthFooterPrompt from "@/features/auth/components/molecules/AuthFooterPrompt/AuthFooterPrompt";

import { useSignUpForm } from "@/features/auth/hooks/useSignUpForm";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const SignUpForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: {
    email: string;
    password: string;
    confirmPassword: string;
    referralCode: string;
    termsOfUse: boolean;
  }) => void;
  isSubmitting: boolean;
}) => {
  const t = useTranslations("Auth.signUp");
  const { routes } = useGetAllRoutes();

  const { continueWithGoogle, isRedirecting } = useGoogleAuth();

  const { values, errors, touched, handleChange, handleBlur, setTermsOfUse, handleSubmit } =
    useSignUpForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <AuthFormField
        id="email"
        name="email"
        type="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        icon={<Mail size={16} />}
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : undefined}
        autoComplete="email"
      />

      <div className="flex flex-col gap-1.5">
        <PasswordField
          id="password"
          name="password"
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          autoComplete="new-password"
        />
        <PasswordStrengthChecklist
          password={values.password}
          visible={values.password.length > 0}
        />
      </div>

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label={t("confirmPasswordLabel")}
        placeholder={t("confirmPasswordPlaceholder")}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        autoComplete="new-password"
      />

      <ReferralCodeField
        value={values.referralCode}
        onChange={handleChange}
        label={t("referralPlaceholder")}
        triggerLabel={t("referralTrigger")}
      />

      <TermsCheckboxField
        checked={values.termsOfUse}
        onCheckedChange={setTermsOfUse}
        error={touched.termsOfUse ? errors.termsOfUse : undefined}
      >
        {t("termsPrefix")}{" "}
        <span className="font-semibold text-foreground">{t("terms")}</span>{" "}
        {t("and")}{" "}
        <span className="font-semibold text-foreground">{t("privacy")}</span>
      </TermsCheckboxField>

      <AuthSubmitButton loading={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submit")}
      </AuthSubmitButton>

      <AuthDivider label={t("orDivider")} />

      <GoogleAuthButton
        onClick={continueWithGoogle}
        loading={isRedirecting}
        label={t("google")}
      />

      <AuthFooterPrompt
        text={t("haveAccount")}
        actionText={t("login")}
        href={routes.login}
      />
    </form>
  );
};

export default SignUpForm;
