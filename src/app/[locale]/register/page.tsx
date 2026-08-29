import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/features/auth/components/templates/AuthLayout/AuthLayout";
import AuthHeading from "@/features/auth/components/molecules/AuthHeading/AuthHeading";
import SignUpPanel from "@/features/auth/components/organisms/SignUpPanel/SignUpPanel";
import TradeShowcase from "@/features/auth/components/organisms/TradeShowcase/TradeShowcase";

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Join Traders of Africa — the B2B and B2C marketplace connecting African suppliers to businesses and everyday buyers.",
};

export default async function RegisterPage() {
  const t = await getTranslations("Auth.signUp");

  return (
    <AuthLayout showcase={<TradeShowcase />}>
      <AuthHeading title={t("title")} subtitle={t("subtitle")} />
      <SignUpPanel />
    </AuthLayout>
  );
}
